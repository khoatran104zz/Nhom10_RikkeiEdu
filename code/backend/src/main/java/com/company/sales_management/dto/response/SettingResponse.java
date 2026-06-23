package com.company.sales_management.dto.response;

import java.time.LocalDateTime;

public class SettingResponse {
    private Integer id;
    private Integer shopId;
    private String tenantShopName;
    private String shopName;
    private String address;
    private String phone;
    private String email;
    private String currency;
    private String logoUrl;
    private String taxRate;
    private String loyaltyPointRate;
    private LocalDateTime updatedAt;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Integer getShopId() { return shopId; }
    public void setShopId(Integer shopId) { this.shopId = shopId; }
    public String getTenantShopName() { return tenantShopName; }
    public void setTenantShopName(String tenantShopName) { this.tenantShopName = tenantShopName; }
    public String getShopName() { return shopName; }
    public void setShopName(String shopName) { this.shopName = shopName; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }
    public String getTaxRate() { return taxRate; }
    public void setTaxRate(String taxRate) { this.taxRate = taxRate; }
    public String getLoyaltyPointRate() { return loyaltyPointRate; }
    public void setLoyaltyPointRate(String loyaltyPointRate) { this.loyaltyPointRate = loyaltyPointRate; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
