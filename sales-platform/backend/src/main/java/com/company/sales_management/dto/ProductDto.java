package com.company.sales_management.dto;

import com.company.sales_management.entity.Product;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ProductDto {

    public static class Request {
        @NotBlank(message = "SKU là bắt buộc")
        public String sku;

        @NotBlank(message = "Tên sản phẩm là bắt buộc")
        public String name;

        /** Đến từ <select> ở FE nên có thể là String rỗng "" khi chưa chọn */
        public String categoryId;
        public String brandId;

        public BigDecimal costPrice;
        public BigDecimal salePrice;
        public Integer stock;
        public String image;
        public String description;
    }

    public static class Response {
        public Long id;
        public String sku;
        public String name;
        public Long categoryId;
        public String categoryName;
        public Long brandId;
        public String brandName;
        public BigDecimal costPrice;
        public BigDecimal salePrice;
        public Integer stock;
        public String image;
        public String description;
        public LocalDateTime createdAt;
        public LocalDateTime updatedAt;

        public static Response from(Product p) {
            Response r = new Response();
            r.id = p.getId();
            r.sku = p.getSku();
            r.name = p.getName();
            if (p.getCategory() != null) {
                r.categoryId = p.getCategory().getId();
                r.categoryName = p.getCategory().getName();
            }
            if (p.getBrand() != null) {
                r.brandId = p.getBrand().getId();
                r.brandName = p.getBrand().getName();
            }
            r.costPrice = p.getCostPrice();
            r.salePrice = p.getSalePrice();
            r.stock = p.getStock();
            r.image = p.getImage();
            r.description = p.getDescription();
            r.createdAt = p.getCreatedAt();
            r.updatedAt = p.getUpdatedAt();
            return r;
        }
    }
}
