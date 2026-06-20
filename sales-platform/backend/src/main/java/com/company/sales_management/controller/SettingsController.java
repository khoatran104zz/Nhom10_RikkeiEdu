package com.company.sales_management.controller;

import com.company.sales_management.dto.SettingsDto;
import com.company.sales_management.service.SettingsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    private final SettingsService settingsService;

    public SettingsController(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    @GetMapping
    public SettingsDto.Response get() {
        return settingsService.get();
    }

    @PutMapping
    public SettingsDto.Response update(@RequestBody SettingsDto.Request req) {
        return settingsService.update(req);
    }
}
