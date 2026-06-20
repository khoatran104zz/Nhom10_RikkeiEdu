package com.company.sales_management.dto;

import com.company.sales_management.entity.Product;
import com.company.sales_management.entity.StockMovement;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class StockDto {

    /** Dòng trong bảng tồn kho (Stock.jsx) — gần giống ProductDto.Response nhưng phẳng hơn */
    public static class StockItemResponse {
        public Long id;
        public String name;
        public String sku;
        public String categoryName;
        public BigDecimal costPrice;
        public BigDecimal salePrice;
        public Integer stock;
        public String image;

        public static StockItemResponse from(Product p) {
            StockItemResponse r = new StockItemResponse();
            r.id = p.getId();
            r.name = p.getName();
            r.sku = p.getSku();
            r.categoryName = p.getCategory() != null ? p.getCategory().getName() : null;
            r.costPrice = p.getCostPrice();
            r.salePrice = p.getSalePrice();
            r.stock = p.getStock();
            r.image = p.getImage();
            return r;
        }
    }

    public static class ImportRequest {
        @NotNull(message = "Vui lòng chọn sản phẩm")
        public Long productId;

        @NotNull(message = "Số lượng là bắt buộc")
        @Positive(message = "Số lượng phải lớn hơn 0")
        public Integer quantity;

        public Long supplierId;
        public String note;
    }

    public static class ExportRequest {
        @NotNull(message = "Vui lòng chọn sản phẩm")
        public Long productId;

        @NotNull(message = "Số lượng là bắt buộc")
        @Positive(message = "Số lượng phải lớn hơn 0")
        public Integer quantity;

        public String note;
    }

    public static class MovementResponse {
        public Long id;
        public Long productId;
        public String productName;
        public Integer quantity;
        public String supplierName;
        public String note;
        public LocalDateTime createdAt;

        public static MovementResponse from(StockMovement m) {
            MovementResponse r = new MovementResponse();
            r.id = m.getId();
            r.productId = m.getProduct() != null ? m.getProduct().getId() : null;
            r.productName = m.getProduct() != null ? m.getProduct().getName() : null;
            r.quantity = m.getQuantity();
            r.supplierName = m.getSupplier() != null ? m.getSupplier().getName() : null;
            r.note = m.getNote();
            r.createdAt = m.getCreatedAt();
            return r;
        }
    }

    public static class MovementResult {
        public Long id;
        public Integer newStock;

        public MovementResult(Long id, Integer newStock) {
            this.id = id;
            this.newStock = newStock;
        }
    }
}
