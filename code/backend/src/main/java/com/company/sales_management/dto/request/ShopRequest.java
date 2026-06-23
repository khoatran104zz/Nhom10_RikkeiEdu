package com.company.sales_management.dto.request;

import jakarta.validation.constraints.*;

public class ShopRequest {

    @NotBlank(message = "Mã shop là bắt buộc")
    @Size(max = 50, message = "Mã shop không được vượt quá 50 ký tự")
    private String code;

    @NotBlank(message = "Tên shop là bắt buộc")
    @Size(max = 150, message = "Tên shop không được vượt quá 150 ký tự")
    private String name;

    @Size(max = 255, message = "Địa chỉ không được vượt quá 255 ký tự")
    private String address;

    @Size(max = 20, message = "Số điện thoại không được vượt quá 20 ký tự")
    private String phone;

    @Email(message = "Email không hợp lệ")
    @Size(max = 100, message = "Email không được vượt quá 100 ký tự")
    private String email;

    private Boolean active;

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}
