package com.company.sales_management.entity;

import jakarta.persistence.*;

/**
 * Bảng cấu hình cửa hàng - chỉ có một dòng duy nhất (id = 1) trong phạm vi V1.0
 * (hệ thống chưa hỗ trợ đa chi nhánh đầy đủ ở bản rút gọn này).
 */
@Entity
@Table(name = "store_settings")
public class StoreSettings {

    @Id
    private Long id = 1L;

    @Column(name = "store_name", length = 200)
    private String storeName = "eManage Store";

    @Column(length = 500)
    private String address = "123 Nguyễn Huệ, Q.1, TP.HCM";

    @Column(length = 30)
    private String phone = "028 1234 5678";

    @Column(length = 150)
    private String email = "contact@emanage.vn";

    @Column(name = "tax_code", length = 50)
    private String taxCode = "";

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getStoreName() { return storeName; }
    public void setStoreName(String storeName) { this.storeName = storeName; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTaxCode() { return taxCode; }
    public void setTaxCode(String taxCode) { this.taxCode = taxCode; }
}
