package com.company.sales_management.dto;

import com.company.sales_management.entity.Employee;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class EmployeeDto {

    public static class Request {
        @NotBlank(message = "Tên nhân viên là bắt buộc")
        public String name;
        public String role;
        public String phone;
        public String email;
    }

    public static class Response {
        public Long id;
        public String name;
        public String role;
        public String phone;
        public String email;
        public LocalDateTime createdAt;

        public static Response from(Employee e) {
            Response r = new Response();
            r.id = e.getId();
            r.name = e.getName();
            r.role = e.getRole();
            r.phone = e.getPhone();
            r.email = e.getEmail();
            r.createdAt = e.getCreatedAt();
            return r;
        }
    }
}
