package com.company.sales_management.service.impl;

import com.company.sales_management.dto.response.DashboardResponse;
import com.company.sales_management.repository.CustomerRepository;
import com.company.sales_management.repository.OrderRepository;
import com.company.sales_management.repository.ProductRepository;
import com.company.sales_management.service.DashboardService;
import com.company.sales_management.service.TenantScopeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private TenantScopeService tenantScopeService;

    @Override
    public DashboardResponse getDashboardStats(String startDate, String endDate) {
        Integer shopId = tenantScopeService.requiredShopId();
        Integer branchId = tenantScopeService.branchScopeId();
        LocalDateTime start = startDate != null && !startDate.isBlank() ? LocalDate.parse(startDate).atStartOfDay()
                : LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime end = endDate != null && !endDate.isBlank() ? LocalDate.parse(endDate).atTime(23, 59, 59)
                : LocalDateTime.now();

        DashboardResponse response = new DashboardResponse();
        response.setTotalOrders(orderRepository.countByCreatedAtBetween(shopId, branchId, start, end));
        
        Double revenueDouble = orderRepository.sumFinalAmountByCreatedAtBetween(shopId, branchId, start, end);
        response.setTotalRevenue(revenueDouble != null ? BigDecimal.valueOf(revenueDouble) : BigDecimal.ZERO);
        
        response.setTotalProducts(productRepository.countByShopIdAndActiveTrue(shopId));
        response.setTotalCustomers(customerRepository.countByShopId(shopId));
        response.setLowStockProducts((long) productRepository.findLowStockProducts(shopId).size());

        // Revenue by day
        List<Object[]> revenueData = orderRepository.getRevenueByDay(shopId, branchId, start, end);
        List<DashboardResponse.RevenueByDayResponse> revenueByDay = revenueData.stream().map(row -> {
            DashboardResponse.RevenueByDayResponse r = new DashboardResponse.RevenueByDayResponse();
            r.setDate(row[0].toString());
            r.setRevenue(row[1] != null ? BigDecimal.valueOf(((Number) row[1]).doubleValue()) : BigDecimal.ZERO);
            r.setOrders(row[2] != null ? ((Number) row[2]).longValue() : 0L);
            return r;
        }).toList();
        response.setRevenueByDay(revenueByDay);

        // Top products
        List<Object[]> topProductData = orderRepository.getTopProducts(shopId, branchId, start, end);
        List<DashboardResponse.TopProductResponse> topProducts = topProductData.stream().map(row -> {
            DashboardResponse.TopProductResponse t = new DashboardResponse.TopProductResponse();
            t.setProductId(row[0] != null ? ((Number) row[0]).intValue() : null);
            t.setProductName(row[1] != null ? row[1].toString() : null);
            t.setTotalQuantity(row[2] != null ? ((Number) row[2]).longValue() : 0L);
            t.setTotalRevenue(row[3] != null ? BigDecimal.valueOf(((Number) row[3]).doubleValue()) : BigDecimal.ZERO);
            return t;
        }).toList();
        response.setTopProducts(topProducts);

        return response;
    }
}
