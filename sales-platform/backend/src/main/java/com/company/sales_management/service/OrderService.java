package com.company.sales_management.service;

import com.company.sales_management.dto.OrderDto;
import com.company.sales_management.dto.PageResponse;
import com.company.sales_management.entity.Customer;
import com.company.sales_management.entity.Employee;
import com.company.sales_management.entity.Order;
import com.company.sales_management.entity.OrderItem;
import com.company.sales_management.entity.Product;
import com.company.sales_management.exception.BusinessException;
import com.company.sales_management.exception.NotFoundException;
import com.company.sales_management.repository.CustomerRepository;
import com.company.sales_management.repository.EmployeeRepository;
import com.company.sales_management.repository.OrderRepository;
import com.company.sales_management.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private static final Set<String> VALID_STATUSES = Set.of("pending", "processing", "completed", "cancelled");

    /** Tỷ lệ tích điểm mặc định: 1 điểm cho mỗi 10.000đ chi tiêu (cấu hình đơn giản hóa cho V1.0) */
    private static final BigDecimal POINTS_PER_VND = BigDecimal.valueOf(10000);

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final EmployeeRepository employeeRepository;

    public OrderService(OrderRepository orderRepository,
                         ProductRepository productRepository,
                         CustomerRepository customerRepository,
                         EmployeeRepository employeeRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
        this.employeeRepository = employeeRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<OrderDto.SummaryResponse> getAll(String search, String status, int page, int limit) {
        int safePage = Math.max(page, 1);
        int safeLimit = limit <= 0 ? 10 : limit;
        Page<Order> result = orderRepository.search(
                search, status, PageRequest.of(safePage - 1, safeLimit, Sort.by(Sort.Direction.DESC, "id")));

        List<OrderDto.SummaryResponse> data = result.getContent().stream()
                .map(OrderDto.SummaryResponse::from)
                .collect(Collectors.toList());

        return new PageResponse<>(data, result.getTotalElements(), result.getTotalPages() == 0 ? 1 : result.getTotalPages());
    }

    @Transactional(readOnly = true)
    public OrderDto.Response getById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy đơn hàng"));
        return OrderDto.Response.from(order);
    }

    /**
     * Tạo đơn hàng từ giỏ hàng POS. Đơn được tạo trực tiếp ở trạng thái "completed"
     * (thanh toán ngay tại quầy) và trừ tồn kho tương ứng (AC-03), đồng thời cộng
     * điểm tích lũy cho khách hàng nếu có (BR-06).
     */
    @Transactional
    public OrderDto.Response create(OrderDto.CreateRequest req) {
        if (req.items == null || req.items.isEmpty()) {
            throw new BusinessException("Giỏ hàng trống");
        }

        Order order = new Order();
        order.setDiscount(req.discount != null ? req.discount : BigDecimal.ZERO);
        order.setPaymentMethod(req.paymentMethod != null && !req.paymentMethod.isBlank() ? req.paymentMethod : "cash");
        order.setNote(req.note);
        order.setStatus("completed");

        if (req.customerId != null) {
            Customer customer = customerRepository.findById(req.customerId)
                    .orElseThrow(() -> new NotFoundException("Không tìm thấy khách hàng"));
            order.setCustomer(customer);
        }

        Employee employee = resolveEmployee(req.employeeId);
        order.setEmployee(employee);

        BigDecimal subtotal = BigDecimal.ZERO;

        for (OrderDto.ItemRequest itemReq : req.items) {
            if (itemReq.productId == null || itemReq.quantity == null || itemReq.quantity <= 0) {
                throw new BusinessException("Dữ liệu sản phẩm trong giỏ hàng không hợp lệ");
            }
            Product product = productRepository.findById(itemReq.productId)
                    .orElseThrow(() -> new NotFoundException("Sản phẩm không tồn tại: " + itemReq.productId));

            if (product.getStock() < itemReq.quantity) {
                throw new BusinessException("Sản phẩm \"" + product.getName() + "\" không đủ tồn kho");
            }

            product.setStock(product.getStock() - itemReq.quantity);
            productRepository.save(product);

            BigDecimal price = itemReq.price != null ? itemReq.price : product.getSalePrice();

            OrderItem item = new OrderItem();
            item.setProduct(product);
            item.setProductName(product.getName());
            item.setQuantity(itemReq.quantity);
            item.setPrice(price);
            order.addItem(item);

            subtotal = subtotal.add(price.multiply(BigDecimal.valueOf(itemReq.quantity)));
        }

        BigDecimal total = subtotal.subtract(order.getDiscount());
        if (total.compareTo(BigDecimal.ZERO) < 0) total = BigDecimal.ZERO;
        order.setTotal(total);

        Order saved = orderRepository.save(order);
        saved.setCode(generateCode(saved.getId()));
        saved = orderRepository.save(saved);

        // Cộng điểm tích lũy khi đơn hoàn tất ngay (BR-06)
        if (saved.getCustomer() != null) {
            awardPoints(saved.getCustomer(), saved.getTotal());
        }

        return OrderDto.Response.from(saved);
    }

    @Transactional
    public OrderDto.Response updateStatus(Long id, String newStatus) {
        if (newStatus == null || !VALID_STATUSES.contains(newStatus)) {
            throw new BusinessException("Trạng thái đơn hàng không hợp lệ");
        }
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy đơn hàng"));

        String oldStatus = order.getStatus();

        // Đơn bị hủy sau khi đã trừ kho thì hoàn lại tồn kho
        if ("cancelled".equals(newStatus) && !"cancelled".equals(oldStatus)) {
            for (OrderItem item : order.getItems()) {
                if (item.getProduct() != null) {
                    Product p = item.getProduct();
                    p.setStock(p.getStock() + item.getQuantity());
                    productRepository.save(p);
                }
            }
            // Hoàn điểm đã cộng nếu đơn trước đó đã completed (BR-06)
            if ("completed".equals(oldStatus) && order.getCustomer() != null) {
                revokePoints(order.getCustomer(), order.getTotal());
            }
        }

        // Đơn chuyển sang completed từ trạng thái khác (không qua POS) thì cộng điểm
        if ("completed".equals(newStatus) && !"completed".equals(oldStatus) && order.getCustomer() != null) {
            awardPoints(order.getCustomer(), order.getTotal());
        }

        order.setStatus(newStatus);
        return OrderDto.Response.from(orderRepository.save(order));
    }

    private void awardPoints(Customer customer, BigDecimal orderTotal) {
        int earned = orderTotal.divide(POINTS_PER_VND, 0, java.math.RoundingMode.DOWN).intValue();
        customer.setPoints(customer.getPoints() + earned);
        customerRepository.save(customer);
    }

    private void revokePoints(Customer customer, BigDecimal orderTotal) {
        int toRevoke = orderTotal.divide(POINTS_PER_VND, 0, java.math.RoundingMode.DOWN).intValue();
        customer.setPoints(Math.max(0, customer.getPoints() - toRevoke));
        customerRepository.save(customer);
    }

    /**
     * FE (POS.jsx) hiện hardcode employeeId dạng chuỗi không phải số (vd "emp2").
     * Cố gắng parse sang Long; nếu không hợp lệ hoặc không tìm thấy thì bỏ qua (null)
     * thay vì làm hỏng toàn bộ giao dịch bán hàng.
     */
    private Employee resolveEmployee(String rawEmployeeId) {
        if (rawEmployeeId == null || rawEmployeeId.isBlank()) return null;
        try {
            Long id = Long.parseLong(rawEmployeeId.trim());
            return employeeRepository.findById(id).orElse(null);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private String generateCode(Long id) {
        return "DH" + String.format("%05d", id);
    }
}
