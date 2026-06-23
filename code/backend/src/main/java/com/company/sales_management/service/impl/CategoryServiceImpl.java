package com.company.sales_management.service.impl;

import com.company.sales_management.dto.request.CategoryRequest;
import com.company.sales_management.dto.response.CategoryResponse;
import com.company.sales_management.entity.Category;
import com.company.sales_management.entity.Shop;
import com.company.sales_management.exception.BadRequestException;
import com.company.sales_management.exception.ResourceNotFoundException;
import com.company.sales_management.repository.CategoryRepository;
import com.company.sales_management.service.CategoryService;
import com.company.sales_management.service.TenantScopeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private TenantScopeService tenantScopeService;

    @Override
    public List<CategoryResponse> findAll(String search) {
        Integer shopId = tenantScopeService.requiredShopId();
        List<Category> categories;
        if (search != null && !search.isBlank()) {
            categories = categoryRepository.findByShopIdAndNameContainingIgnoreCase(shopId, search);
        } else {
            categories = categoryRepository.findByShopId(shopId);
        }
        return categories.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public CategoryResponse findById(Integer id) {
        Category category = categoryRepository.findByIdAndShopId(id, tenantScopeService.requiredShopId())
                .orElseThrow(() -> new ResourceNotFoundException("Danh mục", "id", id));
        return toResponse(category);
    }

    @Override
    public CategoryResponse create(CategoryRequest request) {
        Shop shop = tenantScopeService.currentShop();
        if (categoryRepository.existsByShopIdAndName(shop.getId(), request.getName())) {
            throw new BadRequestException("Tên danh mục đã tồn tại: " + request.getName());
        }
        Category category = new Category();
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setShop(shop);
        return toResponse(categoryRepository.save(category));
    }

    @Override
    public CategoryResponse update(Integer id, CategoryRequest request) {
        Integer shopId = tenantScopeService.requiredShopId();
        Category category = categoryRepository.findByIdAndShopId(id, shopId)
                .orElseThrow(() -> new ResourceNotFoundException("Danh mục", "id", id));
        if (!category.getName().equals(request.getName()) && categoryRepository.existsByShopIdAndNameAndIdNot(shopId, request.getName(), id)) {
            throw new BadRequestException("Tên danh mục đã tồn tại: " + request.getName());
        }
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        return toResponse(categoryRepository.save(category));
    }

    @Override
    public void delete(Integer id) {
        Category category = categoryRepository.findByIdAndShopId(id, tenantScopeService.requiredShopId())
                .orElseThrow(() -> new ResourceNotFoundException("Danh mục", "id", id));
        categoryRepository.delete(category);
    }

    private CategoryResponse toResponse(Category category) {
        CategoryResponse response = new CategoryResponse();
        response.setId(category.getId());
        response.setName(category.getName());
        response.setDescription(category.getDescription());
        if (category.getShop() != null) {
            response.setShopId(category.getShop().getId());
            response.setShopName(category.getShop().getName());
        }
        response.setCreatedAt(category.getCreatedAt());
        response.setUpdatedAt(category.getUpdatedAt());
        return response;
    }
}
