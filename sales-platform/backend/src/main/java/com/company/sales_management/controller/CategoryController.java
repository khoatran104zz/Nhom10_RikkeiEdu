package com.company.sales_management.controller;

import com.company.sales_management.dto.CategoryDto;
import com.company.sales_management.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<CategoryDto.Response> getAll(@RequestParam(required = false) String search) {
        return categoryService.getAll(search);
    }

    @PostMapping
    public CategoryDto.Response create(@Valid @RequestBody CategoryDto.Request req) {
        return categoryService.create(req);
    }

    @PutMapping("/{id}")
    public CategoryDto.Response update(@PathVariable Long id, @Valid @RequestBody CategoryDto.Request req) {
        return categoryService.update(id, req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        categoryService.delete(id);
    }
}
