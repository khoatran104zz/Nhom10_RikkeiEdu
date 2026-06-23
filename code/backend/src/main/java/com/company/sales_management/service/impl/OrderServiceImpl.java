package com.company.sales_management.service.impl;

import com.company.sales_management.dto.request.OrderItemRequest;
import com.company.sales_management.dto.request.OrderRequest;
import com.company.sales_management.dto.response.OrderItemResponse;
import com.company.sales_management.dto.response.OrderResponse;
import com.company.sales_management.entity.*;
import com.company.sales_management.exception.BadRequestException;
import com.company.sales_management.exception.ResourceNotFoundException;
import com.company.sales_management.repository.*;
import com.company.sales_management.service.OrderService;
import com.company.sales_management.service.TenantScopeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private TenantScopeService tenantScopeService;

    @Override
    public Page<OrderResponse> findAll(String search, String status, String startDate, String endDate, Pageable pageable) {
        LocalDateTime start = startDate != null && !startDate.isBlank() ? LocalDate.parse(startDate).atStartOfDay() : null;
        LocalDateTime end = endDate != null && !endDate.isBlank() ? LocalDate.parse(endDate).atTime(23, 59, 59) : null;
        return orderRepository.searchOrders(tenantScopeService.requiredShopId(), tenantScopeService.branchScopeId(), search, status, start, end, pageable).map(this::toResponse);
    }

    @Override
    public OrderResponse findById(Integer id) {
        Order order = orderRepository.findByIdAndShopId(id, tenantScopeService.requiredShopId())
                .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng", "id", id));
        if (order.getBranch() != null) {
            tenantScopeService.assertCanAccessBranch(order.getBranch().getId());
        }
        return toResponse(order);
    }

    @Override
    @Transactional
    public OrderResponse create(OrderRequest request) {
        Shop shop = tenantScopeService.currentShop();
        Branch branch = tenantScopeService.resolveBranchForWrite(request.getBranchId());
        Order order = new Order();
        order.setShop(shop);
        order.setBranch(branch);

        // Generate order code
        String orderCode = "HD" + System.currentTimeMillis();
        order.setCode(orderCode);

        if (request.getCustomerId() != null) {
            Customer customer = customerRepository.findByIdAndShopId(request.getCustomerId(), shop.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Khách hàng", "id", request.getCustomerId()));
            
            // Accumulate loyalty points: 1% of total order
            int pointsEarned = (int) (request.getTotal() * 0.01);
            customer.setPoints(customer.getPoints() + pointsEarned);
            customerRepository.save(customer);
            order.setCustomer(customer);
        }
        
        if (request.getEmployeeId() != null) {
            try {
                Integer empId = Integer.parseInt(request.getEmployeeId());
                Employee employee = employeeRepository.findByIdAndShopId(empId, shop.getId()).orElse(null);
                if (employee != null && employee.getBranch() != null) {
                    tenantScopeService.assertCanAccessBranch(employee.getBranch().getId());
                }
                order.setEmployee(employee);
            } catch (NumberFormatException e) {
                // Ignore non-numeric employee IDs (like "emp2")
            }
        }
        
        order.setTotal(request.getTotal());
        order.setDiscount(request.getDiscount() != null ? request.getDiscount() : 0.0);
        order.setPaymentMethod(request.getPaymentMethod());
        order.setStatus(request.getStatus() != null ? request.getStatus() : "completed");
        order.setNote(request.getNote());

        Order savedOrder = orderRepository.save(order);

        // Create order items and update stock
        List<OrderItem> items = new ArrayList<>();
        for (OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findByIdAndShopId(itemReq.getProductId(), shop.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm", "id", itemReq.getProductId()));

            if (product.getStock() < itemReq.getQuantity()) {
                throw new BadRequestException("Sản phẩm '" + product.getName() + "' không đủ số lượng tồn kho");
            }

            OrderItem item = new OrderItem();
            item.setOrder(savedOrder);
            item.setProduct(product);
            item.setProductName(product.getName());
            item.setQuantity(itemReq.getQuantity());
            item.setPrice(itemReq.getPrice());
            items.add(item);

            // Decrease stock
            product.setStock(product.getStock() - itemReq.getQuantity());
            productRepository.save(product);
        }
        orderItemRepository.saveAll(items);
        savedOrder.setItems(items);

        return toResponse(savedOrder);
    }

    @Override
    public OrderResponse updateStatus(Integer id, String status) {
        Order order = orderRepository.findByIdAndShopId(id, tenantScopeService.requiredShopId())
                .orElseThrow(() -> new ResourceNotFoundException("Đơn hàng", "id", id));
        if (order.getBranch() != null) {
            tenantScopeService.assertCanAccessBranch(order.getBranch().getId());
        }
        order.setStatus(status);
        return toResponse(orderRepository.save(order));
    }

    private OrderResponse toResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setCode(order.getCode());
        if (order.getShop() != null) {
            response.setShopId(order.getShop().getId());
            response.setShopName(order.getShop().getName());
        }
        if (order.getBranch() != null) {
            response.setBranchId(order.getBranch().getId());
            response.setBranchName(order.getBranch().getName());
        }
        response.setTotal(order.getTotal());
        response.setDiscount(order.getDiscount());
        response.setPaymentMethod(order.getPaymentMethod());
        response.setStatus(order.getStatus());
        response.setNote(order.getNote());
        response.setCreatedAt(order.getCreatedAt());
        response.setUpdatedAt(order.getUpdatedAt());

        if (order.getCustomer() != null) {
            response.setCustomerId(order.getCustomer().getId());
            response.setCustomerName(order.getCustomer().getName());
        } else {
            response.setCustomerName("Khách lẻ");
        }
        if (order.getEmployee() != null) {
            response.setEmployeeId(order.getEmployee().getId());
            response.setEmployeeName(order.getEmployee().getName());
        }
        if (order.getItems() != null) {
            List<OrderItemResponse> itemResponses = order.getItems().stream().map(item -> {
                OrderItemResponse ir = new OrderItemResponse();
                ir.setId(item.getId());
                ir.setQuantity(item.getQuantity());
                ir.setPrice(item.getPrice());
                if (item.getProduct() != null) {
                    ir.setProductId(item.getProduct().getId());
                    ir.setProductName(item.getProduct().getName());
                } else {
                    ir.setProductName(item.getProductName());
                }
                return ir;
            }).collect(Collectors.toList());
            response.setItems(itemResponses);
        }
        return response;
    }
}
