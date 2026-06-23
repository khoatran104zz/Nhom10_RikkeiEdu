package com.company.sales_management.controller;

import com.company.sales_management.dto.request.ShopRequest;
import com.company.sales_management.dto.response.ShopResponse;
import com.company.sales_management.entity.Shop;
import com.company.sales_management.exception.BadRequestException;
import com.company.sales_management.exception.ResourceNotFoundException;
import com.company.sales_management.repository.ShopRepository;
import com.company.sales_management.service.TenantScopeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shops")
@CrossOrigin
public class ShopController {

    @Autowired
    private ShopRepository shopRepository;

    @Autowired
    private TenantScopeService tenantScopeService;

    @GetMapping
    public ResponseEntity<List<ShopResponse>> getAll() {
        tenantScopeService.requireSystemAdmin();
        return ResponseEntity.ok(shopRepository.findAll().stream().map(this::toResponse).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShopResponse> getById(@PathVariable Integer id) {
        tenantScopeService.requireSystemAdmin();
        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shop", "id", id));
        return ResponseEntity.ok(toResponse(shop));
    }

    @PostMapping
    public ResponseEntity<ShopResponse> create(@Valid @RequestBody ShopRequest request) {
        tenantScopeService.requireSystemAdmin();
        if (shopRepository.existsByCode(request.getCode())) {
            throw new BadRequestException("Mã shop đã tồn tại: " + request.getCode());
        }
        Shop shop = new Shop();
        mapRequest(request, shop);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(shopRepository.save(shop)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ShopResponse> update(@PathVariable Integer id, @Valid @RequestBody ShopRequest request) {
        tenantScopeService.requireSystemAdmin();
        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shop", "id", id));
        if (!shop.getCode().equals(request.getCode()) && shopRepository.existsByCodeAndIdNot(request.getCode(), id)) {
            throw new BadRequestException("Mã shop đã tồn tại: " + request.getCode());
        }
        mapRequest(request, shop);
        return ResponseEntity.ok(toResponse(shopRepository.save(shop)));
    }

    private void mapRequest(ShopRequest request, Shop shop) {
        shop.setCode(request.getCode());
        shop.setName(request.getName());
        shop.setAddress(request.getAddress());
        shop.setPhone(request.getPhone());
        shop.setEmail(request.getEmail());
        shop.setActive(request.getActive() != null ? request.getActive() : true);
    }

    private ShopResponse toResponse(Shop shop) {
        ShopResponse response = new ShopResponse();
        response.setId(shop.getId());
        response.setCode(shop.getCode());
        response.setName(shop.getName());
        response.setAddress(shop.getAddress());
        response.setPhone(shop.getPhone());
        response.setEmail(shop.getEmail());
        response.setActive(shop.getActive());
        response.setCreatedAt(shop.getCreatedAt());
        response.setUpdatedAt(shop.getUpdatedAt());
        return response;
    }
}
