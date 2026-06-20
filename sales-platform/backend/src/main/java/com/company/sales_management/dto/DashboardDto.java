package com.company.sales_management.dto;

import java.math.BigDecimal;
import java.util.List;

public class DashboardDto {

    public static class Stats {
        public BigDecimal totalRevenue;
        public long totalOrders;
        public long totalCustomers;
        public long totalProducts;

        public Stats(BigDecimal totalRevenue, long totalOrders, long totalCustomers, long totalProducts) {
            this.totalRevenue = totalRevenue;
            this.totalOrders = totalOrders;
            this.totalCustomers = totalCustomers;
            this.totalProducts = totalProducts;
        }
    }

    public static class MonthlyRevenue {
        public String month;
        public BigDecimal revenue;

        public MonthlyRevenue(String month, BigDecimal revenue) {
            this.month = month;
            this.revenue = revenue;
        }
    }

    public static class TopProduct {
        public String name;
        public long quantity;
        public BigDecimal revenue;

        public TopProduct(String name, long quantity, BigDecimal revenue) {
            this.name = name;
            this.quantity = quantity;
            this.revenue = revenue;
        }
    }

    public static class Response {
        public Stats stats;
        public List<MonthlyRevenue> monthlyRevenue;
        public List<TopProduct> topProducts;
        public List<OrderDto.SummaryResponse> recentOrders;
        public List<StockDto.StockItemResponse> lowStock;

        public Response(Stats stats, List<MonthlyRevenue> monthlyRevenue, List<TopProduct> topProducts,
                         List<OrderDto.SummaryResponse> recentOrders, List<StockDto.StockItemResponse> lowStock) {
            this.stats = stats;
            this.monthlyRevenue = monthlyRevenue;
            this.topProducts = topProducts;
            this.recentOrders = recentOrders;
            this.lowStock = lowStock;
        }
    }
}
