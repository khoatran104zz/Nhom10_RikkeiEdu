package com.company.sales_management.dto;

import com.company.sales_management.entity.StoreSettings;

public class SettingsDto {

    public static class Request {
        public String storeName;
        public String address;
        public String phone;
        public String email;
        public String taxCode;
    }

    public static class Response {
        public String storeName;
        public String address;
        public String phone;
        public String email;
        public String taxCode;

        public static Response from(StoreSettings s) {
            Response r = new Response();
            r.storeName = s.getStoreName();
            r.address = s.getAddress();
            r.phone = s.getPhone();
            r.email = s.getEmail();
            r.taxCode = s.getTaxCode();
            return r;
        }
    }
}
