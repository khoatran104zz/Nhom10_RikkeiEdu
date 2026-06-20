package com.company.sales_management.dto;

import com.company.sales_management.entity.Brand;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class BrandDto {

    public static class Request {
        @NotBlank(message = "Tên thương hiệu là bắt buộc")
        public String name;
        public String description;
    }

    public static class Response {
        public Long id;
        public String name;
        public String description;
        public LocalDateTime createdAt;

        public static Response from(Brand b) {
            Response r = new Response();
            r.id = b.getId();
            r.name = b.getName();
            r.description = b.getDescription();
            r.createdAt = b.getCreatedAt();
            return r;
        }
    }
}
