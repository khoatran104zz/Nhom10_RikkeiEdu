package com.company.sales_management.service.impl;

import com.company.sales_management.dto.request.BrandRequest;
import com.company.sales_management.dto.response.BrandResponse;
import com.company.sales_management.entity.Brand;
import com.company.sales_management.entity.Shop;
import com.company.sales_management.exception.BadRequestException;
import com.company.sales_management.exception.ResourceNotFoundException;
import com.company.sales_management.repository.BrandRepository;
import com.company.sales_management.service.BrandService;
import com.company.sales_management.service.TenantScopeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BrandServiceImpl implements BrandService {

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private TenantScopeService tenantScopeService;

    @Override
    public List<BrandResponse> findAll(String search) {
        Integer shopId = tenantScopeService.requiredShopId();
        List<Brand> brands;
        if (search != null && !search.isBlank()) {
            brands = brandRepository.findByShopIdAndNameContainingIgnoreCase(shopId, search);
        } else {
            brands = brandRepository.findByShopId(shopId);
        }
        return brands.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public BrandResponse findById(Integer id) {
        Brand brand = brandRepository.findByIdAndShopId(id, tenantScopeService.requiredShopId())
                .orElseThrow(() -> new ResourceNotFoundException("Thương hiệu", "id", id));
        return toResponse(brand);
    }

    @Override
    public BrandResponse create(BrandRequest request) {
        Shop shop = tenantScopeService.currentShop();
        if (brandRepository.existsByShopIdAndName(shop.getId(), request.getName())) {
            throw new BadRequestException("Tên thương hiệu đã tồn tại: " + request.getName());
        }
        Brand brand = new Brand();
        brand.setName(request.getName());
        brand.setDescription(request.getDescription());
        brand.setShop(shop);
        return toResponse(brandRepository.save(brand));
    }

    @Override
    public BrandResponse update(Integer id, BrandRequest request) {
        Integer shopId = tenantScopeService.requiredShopId();
        Brand brand = brandRepository.findByIdAndShopId(id, shopId)
                .orElseThrow(() -> new ResourceNotFoundException("Thương hiệu", "id", id));
        if (!brand.getName().equals(request.getName()) && brandRepository.existsByShopIdAndNameAndIdNot(shopId, request.getName(), id)) {
            throw new BadRequestException("Tên thương hiệu đã tồn tại: " + request.getName());
        }
        brand.setName(request.getName());
        brand.setDescription(request.getDescription());
        return toResponse(brandRepository.save(brand));
    }

    @Override
    public void delete(Integer id) {
        Brand brand = brandRepository.findByIdAndShopId(id, tenantScopeService.requiredShopId())
                .orElseThrow(() -> new ResourceNotFoundException("Thương hiệu", "id", id));
        brandRepository.delete(brand);
    }

    private BrandResponse toResponse(Brand brand) {
        BrandResponse response = new BrandResponse();
        response.setId(brand.getId());
        response.setName(brand.getName());
        response.setDescription(brand.getDescription());
        if (brand.getShop() != null) {
            response.setShopId(brand.getShop().getId());
            response.setShopName(brand.getShop().getName());
        }
        response.setCreatedAt(brand.getCreatedAt());
        response.setUpdatedAt(brand.getUpdatedAt());
        return response;
    }
}
