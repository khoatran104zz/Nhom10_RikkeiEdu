package com.company.sales_management.service;

import com.company.sales_management.dto.DashboardDto;
import com.company.sales_management.dto.OrderDto;
import com.company.sales_management.dto.StockDto;
import com.company.sales_management.entity.Order;
import com.company.sales_management.entity.OrderItem;
import com.company.sales_management.entity.Product;
import com.company.sales_management.repository.CustomerRepository;
import com.company.sales_management.repository.OrderItemRepository;
import com.company.sales_management.repository.OrderRepository;
import com.company.sales_management.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private static final int LOW_STOCK_THRESHOLD = 10;

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;

    public DashboardService(OrderRepository orderRepository,
                             OrderItemRepository orderItemRepository,
                             ProductRepository productRepository,
                             CustomerRepository customerRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
    }

    @Transactional(readOnly = true)
    public DashboardDto.Response get() {
        List<Order> completedOrders = orderRepository.findByStatus("completed");

        BigDecimal totalRevenue = completedOrders.stream()
                .map(Order::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalOrders = orderRepository.count();
        long totalCustomers = customerRepository.count();
        long totalProducts = productRepository.count();

        DashboardDto.Stats stats = new DashboardDto.Stats(totalRevenue, totalOrders, totalCustomers, totalProducts);

        List<DashboardDto.MonthlyRevenue> monthlyRevenue = buildMonthlyRevenue(completedOrders);
        List<DashboardDto.TopProduct> topProducts = buildTopProducts();

        List<OrderDto.SummaryResponse> recentOrders = orderRepository.findTop5ByOrderByIdDesc().stream()
                .map(OrderDto.SummaryResponse::from)
                .collect(Collectors.toList());

        List<StockDto.StockItemResponse> lowStock = productRepository
                .findByStockLessThanEqualAndActiveTrue(LOW_STOCK_THRESHOLD).stream()
                .sorted(Comparator.comparingInt(Product::getStock))
                .map(StockDto.StockItemResponse::from)
                .collect(Collectors.toList());

        return new DashboardDto.Response(stats, monthlyRevenue, topProducts, recentOrders, lowStock);
    }

    /** Doanh thu 6 tháng gần nhất (kể cả tháng không có đơn hàng nào -> revenue = 0) */
    private List<DashboardDto.MonthlyRevenue> buildMonthlyRevenue(List<Order> completedOrders) {
        Map<YearMonth, BigDecimal> revenueByMonth = completedOrders.stream()
                .filter(o -> o.getCreatedAt() != null)
                .collect(Collectors.groupingBy(
                        o -> YearMonth.from(o.getCreatedAt()),
                        Collectors.reducing(BigDecimal.ZERO, Order::getTotal, BigDecimal::add)
                ));

        List<DashboardDto.MonthlyRevenue> result = new ArrayList<>();
        YearMonth current = YearMonth.from(LocalDateTime.now());
        for (int i = 5; i >= 0; i--) {
            YearMonth ym = current.minusMonths(i);
            String label = "Th" + ym.getMonthValue();
            BigDecimal revenue = revenueByMonth.getOrDefault(ym, BigDecimal.ZERO);
            result.add(new DashboardDto.MonthlyRevenue(label, revenue));
        }
        return result;
    }

    /** Top 5 sản phẩm bán chạy nhất theo số lượng, tính từ các đơn hàng đã hoàn thành */
    private List<DashboardDto.TopProduct> buildTopProducts() {
        List<OrderItem> items = orderItemRepository.findAllFromCompletedOrders();

        Map<String, List<OrderItem>> byProductName = items.stream()
                .collect(Collectors.groupingBy(OrderItem::getProductName));

        return byProductName.entrySet().stream()
                .map(entry -> {
                    long qty = entry.getValue().stream().mapToLong(OrderItem::getQuantity).sum();
                    BigDecimal revenue = entry.getValue().stream()
                            .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    return new DashboardDto.TopProduct(entry.getKey(), qty, revenue);
                })
                .sorted(Comparator.comparingLong((DashboardDto.TopProduct p) -> p.quantity).reversed())
                .limit(5)
                .collect(Collectors.toList());
    }
}
