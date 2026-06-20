package com.company.sales_management.dto;

import com.company.sales_management.entity.Supplier;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class SupplierDto {

    public static class Request {
        @NotBlank(message = "Tên nhà cung cấp là bắt buộc")
        public String name;
        public String phone;
        public String email;
        public String address;
    }

    public static class Response {
        public Long id;
        public String name;
        public String phone;
        public String email;
        public String address;
        public LocalDateTime createdAt;

        public static Response from(Supplier s) {
            Response r = new Response();
            r.id = s.getId();
            r.name = s.getName();
            r.phone = s.getPhone();
            r.email = s.getEmail();
            r.address = s.getAddress();
            r.createdAt = s.getCreatedAt();
            return r;
        }
    }
}
