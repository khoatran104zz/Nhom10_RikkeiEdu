package com.company.sales_management.controller;

import com.company.sales_management.dto.CustomerDto;
import com.company.sales_management.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public List<CustomerDto.Response> getAll(@RequestParam(required = false) String search) {
        return customerService.getAll(search);
    }

    @PostMapping
    public CustomerDto.Response create(@Valid @RequestBody CustomerDto.Request req) {
        return customerService.create(req);
    }

    @PutMapping("/{id}")
    public CustomerDto.Response update(@PathVariable Long id, @Valid @RequestBody CustomerDto.Request req) {
        return customerService.update(id, req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        customerService.delete(id);
    }
}
