package com.company.sales_management.controller;

import com.company.sales_management.dto.SupplierDto;
import com.company.sales_management.service.SupplierService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @GetMapping
    public List<SupplierDto.Response> getAll(@RequestParam(required = false) String search) {
        return supplierService.getAll(search);
    }

    @PostMapping
    public SupplierDto.Response create(@Valid @RequestBody SupplierDto.Request req) {
        return supplierService.create(req);
    }

    @PutMapping("/{id}")
    public SupplierDto.Response update(@PathVariable Long id, @Valid @RequestBody SupplierDto.Request req) {
        return supplierService.update(id, req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        supplierService.delete(id);
    }
}
