package com.company.sales_management.dto;

import com.company.sales_management.entity.Customer;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class CustomerDto {

    public static class Request {
        @NotBlank(message = "Tên khách hàng là bắt buộc")
        public String name;

        @NotBlank(message = "Số điện thoại là bắt buộc")
        public String phone;

        public String email;
        public String address;
    }

    public static class Response {
        public Long id;
        public String code;
        public String name;
        public String phone;
        public String email;
        public String address;
        public Integer points;
        public LocalDateTime createdAt;

        public static Response from(Customer c) {
            Response r = new Response();
            r.id = c.getId();
            r.code = c.getCode();
            r.name = c.getName();
            r.phone = c.getPhone();
            r.email = c.getEmail();
            r.address = c.getAddress();
            r.points = c.getPoints();
            r.createdAt = c.getCreatedAt();
            return r;
        }
    }
}
