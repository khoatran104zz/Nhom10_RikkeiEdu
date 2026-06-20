package com.company.sales_management.controller;

import com.company.sales_management.dto.EmployeeDto;
import com.company.sales_management.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    public List<EmployeeDto.Response> getAll(@RequestParam(required = false) String search) {
        return employeeService.getAll(search);
    }

    @PostMapping
    public EmployeeDto.Response create(@Valid @RequestBody EmployeeDto.Request req) {
        return employeeService.create(req);
    }

    @PutMapping("/{id}")
    public EmployeeDto.Response update(@PathVariable Long id, @Valid @RequestBody EmployeeDto.Request req) {
        return employeeService.update(id, req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        employeeService.delete(id);
    }
}
