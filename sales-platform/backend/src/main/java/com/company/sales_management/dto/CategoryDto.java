package com.company.sales_management.dto;

import com.company.sales_management.entity.Category;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class CategoryDto {

    public static class Request {
        @NotBlank(message = "Tên danh mục là bắt buộc")
        public String name;
        public String description;
    }

    public static class Response {
        public Long id;
        public String name;
        public String description;
        public LocalDateTime createdAt;

        public static Response from(Category c) {
            Response r = new Response();
            r.id = c.getId();
            r.name = c.getName();
            r.description = c.getDescription();
            r.createdAt = c.getCreatedAt();
            return r;
        }
    }
}
