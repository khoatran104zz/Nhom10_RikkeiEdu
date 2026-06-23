package com.company.sales_management.controller;

import com.company.sales_management.entity.Order;
import com.company.sales_management.entity.Product;
import com.company.sales_management.repository.CustomerRepository;
import com.company.sales_management.repository.OrderRepository;
import com.company.sales_management.repository.ProductRepository;
import com.company.sales_management.service.TenantScopeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin
public class DashboardController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private TenantScopeService tenantScopeService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getDashboardData() {
        Integer shopId = tenantScopeService.requiredShopId();
        Integer branchId = tenantScopeService.branchScopeId();
        LocalDate today = LocalDate.now();
        LocalDateTime startOfLast6Months = today.minusMonths(5).withDayOfMonth(1).atStartOfDay();
        LocalDateTime endOfToday = today.atTime(23, 59, 59);

        // 1. Stats
        Map<String, Object> stats = new HashMap<>();
        long totalOrders = orderRepository.countByStatus(shopId, branchId, "completed");
        Double totalRevenueDouble = orderRepository.calculateTotalRevenue(shopId, branchId);
        BigDecimal totalRevenue = totalRevenueDouble != null ? BigDecimal.valueOf(totalRevenueDouble) : BigDecimal.ZERO;
        long totalCustomers = customerRepository.countByShopId(shopId);
        long totalProducts = productRepository.countByShopIdAndActiveTrue(shopId);

        stats.put("totalOrders", totalOrders);
        stats.put("totalRevenue", totalRevenue);
        stats.put("totalCustomers", totalCustomers);
        stats.put("totalProducts", totalProducts);

        // 2. Monthly Revenue (last 6 months)
        List<Map<String, Object>> monthlyRevenue = new ArrayList<>();
        for (int i = 5; i >= 0; i--) {
            LocalDate date = today.minusMonths(i);
            String monthName = "Thg " + date.getMonthValue();
            Map<String, Object> monthData = new HashMap<>();
            monthData.put("month", monthName);
            monthData.put("revenue", BigDecimal.ZERO);
            monthlyRevenue.add(monthData);
        }

        List<Object[]> dailyData = orderRepository.getRevenueByDay(shopId, branchId, startOfLast6Months, endOfToday);
        for (Object[] row : dailyData) {
            if (row[0] == null || row[1] == null) continue;
            LocalDate date;
            if (row[0] instanceof java.sql.Date) {
                date = ((java.sql.Date) row[0]).toLocalDate();
            } else if (row[0] instanceof java.time.LocalDate) {
                date = (LocalDate) row[0];
            } else {
                date = LocalDate.parse(row[0].toString());
            }
            String targetMonth = "Thg " + date.getMonthValue();
            BigDecimal revenue = BigDecimal.valueOf(((Number) row[1]).doubleValue());

            for (Map<String, Object> m : monthlyRevenue) {
                if (m.get("month").equals(targetMonth)) {
                    BigDecimal current = (BigDecimal) m.get("revenue");
                    m.put("revenue", current.add(revenue));
                    break;
                }
            }
        }

        // 3. Top Products (last 6 months)
        List<Object[]> topData = orderRepository.getTopProducts(shopId, branchId, startOfLast6Months, endOfToday);
        List<Map<String, Object>> topProducts = new ArrayList<>();
        int count = 0;
        for (Object[] row : topData) {
            if (count >= 5) break;
            Map<String, Object> item = new HashMap<>();
            item.put("name", row[1] != null ? row[1].toString() : "Sản phẩm không tên");
            item.put("quantity", row[2] != null ? ((Number) row[2]).longValue() : 0L);
            topProducts.add(item);
            count++;
        }

        // 4. Recent Orders (last 5)
        List<Order> recent = orderRepository.findRecentOrders(shopId, branchId, PageRequest.of(0, 5));
        List<Map<String, Object>> recentOrders = recent.stream().map(order -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", order.getId());
            map.put("code", order.getCode());
            map.put("customerName", order.getCustomer() != null ? order.getCustomer().getName() : "Khách lẻ");
            map.put("total", order.getTotal());
            map.put("status", order.getStatus());
            map.put("createdAt", order.getCreatedAt());
            return map;
        }).toList();

        // 5. Low Stock
        List<Product> lowStockList = productRepository.findLowStockProducts(shopId);
        List<Map<String, Object>> lowStock = lowStockList.stream().map(p -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", p.getId());
            map.put("name", p.getName());
            map.put("categoryName", p.getCategory() != null ? p.getCategory().getName() : "Không có");
            map.put("sku", p.getSku());
            map.put("stock", p.getStock());
            return map;
        }).toList();

        // Assemble Dashboard
        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("stats", stats);
        dashboard.put("monthlyRevenue", monthlyRevenue);
        dashboard.put("topProducts", topProducts);
        dashboard.put("recentOrders", recentOrders);
        dashboard.put("lowStock", lowStock);

        return ResponseEntity.ok(dashboard);
    }
}
