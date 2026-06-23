package com.company.sales_management.service.impl;

import com.company.sales_management.dto.request.SettingRequest;
import com.company.sales_management.dto.response.SettingResponse;
import com.company.sales_management.entity.Setting;
import com.company.sales_management.entity.Shop;
import com.company.sales_management.repository.SettingRepository;
import com.company.sales_management.service.SettingService;
import com.company.sales_management.service.TenantScopeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class SettingServiceImpl implements SettingService {

    @Autowired
    private SettingRepository settingRepository;

    @Autowired
    private TenantScopeService tenantScopeService;

    @Override
    public SettingResponse findSettings() {
        Setting setting = settingRepository.findByShopId(tenantScopeService.requiredShopId()).orElseGet(this::createDefaultSettings);
        return toResponse(setting);
    }

    @Override
    public SettingResponse updateSettings(SettingRequest request) {
        Setting setting = settingRepository.findByShopId(tenantScopeService.requiredShopId()).orElseGet(this::createDefaultSettings);
        if (request.getShopName() != null) setting.setShopName(request.getShopName());
        if (request.getAddress() != null) setting.setAddress(request.getAddress());
        if (request.getPhone() != null) setting.setPhone(request.getPhone());
        if (request.getEmail() != null) setting.setEmail(request.getEmail());
        if (request.getCurrency() != null) setting.setCurrency(request.getCurrency());
        if (request.getLogoUrl() != null) setting.setLogoUrl(request.getLogoUrl());
        if (request.getTaxRate() != null) {
            try {
                setting.setTaxRate(new BigDecimal(request.getTaxRate()));
            } catch (NumberFormatException ignored) {}
        }
        if (request.getLoyaltyPointRate() != null) {
            try {
                setting.setLoyaltyPointRate(new BigDecimal(request.getLoyaltyPointRate()));
            } catch (NumberFormatException ignored) {}
        }
        return toResponse(settingRepository.save(setting));
    }

    private Setting createDefaultSettings() {
        Shop shop = tenantScopeService.currentShop();
        Setting setting = new Setting();
        setting.setId(shop.getId());
        setting.setShop(shop);
        setting.setShopName(shop.getName());
        setting.setCurrency("VND");
        return settingRepository.save(setting);
    }

    private SettingResponse toResponse(Setting setting) {
        SettingResponse response = new SettingResponse();
        response.setId(setting.getId());
        if (setting.getShop() != null) {
            response.setShopId(setting.getShop().getId());
            response.setTenantShopName(setting.getShop().getName());
        }
        response.setShopName(setting.getShopName());
        response.setAddress(setting.getAddress());
        response.setPhone(setting.getPhone());
        response.setEmail(setting.getEmail());
        response.setCurrency(setting.getCurrency());
        response.setLogoUrl(setting.getLogoUrl());
        response.setTaxRate(setting.getTaxRate() != null ? setting.getTaxRate().toPlainString() : null);
        response.setLoyaltyPointRate(setting.getLoyaltyPointRate() != null ? setting.getLoyaltyPointRate().toPlainString() : null);
        response.setUpdatedAt(setting.getUpdatedAt());
        return response;
    }
}
