package com.company.sales_management.dto;

import com.company.sales_management.entity.Order;
import com.company.sales_management.entity.OrderItem;
import jakarta.validation.constraints.NotEmpty;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class OrderDto {

    /** Item gửi lên khi tạo đơn hàng từ giỏ hàng POS */
    public static class ItemRequest {
        public Long productId;
        public String productName;
        public BigDecimal price;
        public Integer quantity;
    }

    public static class CreateRequest {
        /** Có thể null (khách lẻ) */
        public Long customerId;

        /**
         * FE (POS.jsx) hiện đang hardcode giá trị chuỗi không phải số (vd "emp2").
         * Dùng kiểu String ở đây để nhận mọi giá trị mà không vỡ request;
         * service sẽ cố gắng parse sang Long, nếu không hợp lệ thì bỏ qua (để null).
         */
        public String employeeId;

        @NotEmpty(message = "Giỏ hàng không được trống")
        public List<ItemRequest> items;

        public BigDecimal discount = BigDecimal.ZERO;
        public String paymentMethod = "cash";
        public String note;
    }

    public static class UpdateStatusRequest {
        public String status;
    }

    public static class ItemResponse {
        public Long productId;
        public String productName;
        public Integer quantity;
        public BigDecimal price;

        public static ItemResponse from(OrderItem item) {
            ItemResponse r = new ItemResponse();
            r.productId = item.getProduct() != null ? item.getProduct().getId() : null;
            r.productName = item.getProductName();
            r.quantity = item.getQuantity();
            r.price = item.getPrice();
            return r;
        }
    }

    public static class Response {
        public Long id;
        public String code;
        public Long customerId;
        public String customerName;
        public Long employeeId;
        public String employeeName;
        public List<ItemResponse> items;
        public BigDecimal discount;
        public BigDecimal total;
        public String paymentMethod;
        public String status;
        public String note;
        public LocalDateTime createdAt;

        public static Response from(Order o) {
            Response r = new Response();
            r.id = o.getId();
            r.code = o.getCode();
            if (o.getCustomer() != null) {
                r.customerId = o.getCustomer().getId();
                r.customerName = o.getCustomer().getName();
            } else {
                r.customerName = "Khách lẻ";
            }
            if (o.getEmployee() != null) {
                r.employeeId = o.getEmployee().getId();
                r.employeeName = o.getEmployee().getName();
            }
            r.items = o.getItems().stream().map(ItemResponse::from).collect(Collectors.toList());
            r.discount = o.getDiscount();
            r.total = o.getTotal();
            r.paymentMethod = o.getPaymentMethod();
            r.status = o.getStatus();
            r.note = o.getNote();
            r.createdAt = o.getCreatedAt();
            return r;
        }
    }

    /** Dạng rút gọn cho danh sách (bảng Orders.jsx) */
    public static class SummaryResponse {
        public Long id;
        public String code;
        public String customerName;
        public String employeeName;
        public BigDecimal total;
        public String status;
        public LocalDateTime createdAt;

        public static SummaryResponse from(Order o) {
            SummaryResponse r = new SummaryResponse();
            r.id = o.getId();
            r.code = o.getCode();
            r.customerName = o.getCustomer() != null ? o.getCustomer().getName() : "Khách lẻ";
            r.employeeName = o.getEmployee() != null ? o.getEmployee().getName() : null;
            r.total = o.getTotal();
            r.status = o.getStatus();
            r.createdAt = o.getCreatedAt();
            return r;
        }
    }
}
