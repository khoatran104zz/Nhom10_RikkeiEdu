package com.company.sales_management.controller;

import com.company.sales_management.dto.BrandDto;
import com.company.sales_management.service.BrandService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/brands")
public class BrandController {

    private final BrandService brandService;

    public BrandController(BrandService brandService) {
        this.brandService = brandService;
    }

    @GetMapping
    public List<BrandDto.Response> getAll(@RequestParam(required = false) String search) {
        return brandService.getAll(search);
    }

    @PostMapping
    public BrandDto.Response create(@Valid @RequestBody BrandDto.Request req) {
        return brandService.create(req);
    }

    @PutMapping("/{id}")
    public BrandDto.Response update(@PathVariable Long id, @Valid @RequestBody BrandDto.Request req) {
        return brandService.update(id, req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        brandService.delete(id);
    }
}
