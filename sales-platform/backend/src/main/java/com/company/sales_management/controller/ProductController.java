package com.company.sales_management.controller;

import com.company.sales_management.dto.PageResponse;
import com.company.sales_management.dto.ProductDto;
import com.company.sales_management.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public PageResponse<ProductDto.Response> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        return productService.getAll(search, page, limit);
    }

    @GetMapping("/{id}")
    public ProductDto.Response getById(@PathVariable Long id) {
        return productService.getById(id);
    }

    @PostMapping
    public ProductDto.Response create(@Valid @RequestBody ProductDto.Request req) {
        return productService.create(req);
    }

    @PutMapping("/{id}")
    public ProductDto.Response update(@PathVariable Long id, @Valid @RequestBody ProductDto.Request req) {
        return productService.update(id, req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        productService.delete(id);
    }
}
