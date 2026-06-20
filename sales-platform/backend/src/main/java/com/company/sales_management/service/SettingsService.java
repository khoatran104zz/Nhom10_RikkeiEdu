package com.company.sales_management.service;

import com.company.sales_management.dto.SettingsDto;
import com.company.sales_management.entity.StoreSettings;
import com.company.sales_management.repository.StoreSettingsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SettingsService {

    private final StoreSettingsRepository storeSettingsRepository;

    public SettingsService(StoreSettingsRepository storeSettingsRepository) {
        this.storeSettingsRepository = storeSettingsRepository;
    }

    @Transactional
    public SettingsDto.Response get() {
        StoreSettings settings = storeSettingsRepository.findById(1L)
                .orElseGet(() -> storeSettingsRepository.save(new StoreSettings()));
        return SettingsDto.Response.from(settings);
    }

    @Transactional
    public SettingsDto.Response update(SettingsDto.Request req) {
        StoreSettings settings = storeSettingsRepository.findById(1L)
                .orElseGet(() -> {
                    StoreSettings s = new StoreSettings();
                    s.setId(1L);
                    return s;
                });
        settings.setStoreName(req.storeName);
        settings.setAddress(req.address);
        settings.setPhone(req.phone);
        settings.setEmail(req.email);
        settings.setTaxCode(req.taxCode);
        return SettingsDto.Response.from(storeSettingsRepository.save(settings));
    }
}
