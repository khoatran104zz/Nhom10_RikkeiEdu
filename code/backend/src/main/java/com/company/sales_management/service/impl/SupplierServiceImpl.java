package com.company.sales_management.service.impl;

import com.company.sales_management.dto.request.SupplierRequest;
import com.company.sales_management.dto.response.SupplierResponse;
import com.company.sales_management.entity.Shop;
import com.company.sales_management.entity.Supplier;
import com.company.sales_management.exception.ResourceNotFoundException;
import com.company.sales_management.repository.SupplierRepository;
import com.company.sales_management.service.SupplierService;
import com.company.sales_management.service.TenantScopeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class SupplierServiceImpl implements SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private TenantScopeService tenantScopeService;

    @Override
    public Page<SupplierResponse> findAll(String search, Pageable pageable) {
        if (search != null && !search.isBlank()) {
            return supplierRepository.findBySearchTerm(tenantScopeService.requiredShopId(), search, pageable).map(this::toResponse);
        }
        return supplierRepository.findByShopId(tenantScopeService.requiredShopId(), pageable).map(this::toResponse);
    }

    @Override
    public SupplierResponse findById(Integer id) {
        Supplier supplier = supplierRepository.findByIdAndShopId(id, tenantScopeService.requiredShopId())
                .orElseThrow(() -> new ResourceNotFoundException("Nhà cung cấp", "id", id));
        return toResponse(supplier);
    }

    @Override
    public SupplierResponse create(SupplierRequest request) {
        Shop shop = tenantScopeService.currentShop();
        Supplier supplier = new Supplier();
        supplier.setShop(shop);
        supplier.setName(request.getName());
        supplier.setPhone(request.getPhone());
        supplier.setEmail(request.getEmail());
        supplier.setAddress(request.getAddress());
        supplier.setContactPerson(request.getContactPerson());
        return toResponse(supplierRepository.save(supplier));
    }

    @Override
    public SupplierResponse update(Integer id, SupplierRequest request) {
        Supplier supplier = supplierRepository.findByIdAndShopId(id, tenantScopeService.requiredShopId())
                .orElseThrow(() -> new ResourceNotFoundException("Nhà cung cấp", "id", id));
        supplier.setName(request.getName());
        supplier.setPhone(request.getPhone());
        supplier.setEmail(request.getEmail());
        supplier.setAddress(request.getAddress());
        supplier.setContactPerson(request.getContactPerson());
        return toResponse(supplierRepository.save(supplier));
    }

    @Override
    public void delete(Integer id) {
        Supplier supplier = supplierRepository.findByIdAndShopId(id, tenantScopeService.requiredShopId())
                .orElseThrow(() -> new ResourceNotFoundException("Nhà cung cấp", "id", id));
        supplierRepository.delete(supplier);
    }

    private SupplierResponse toResponse(Supplier supplier) {
        SupplierResponse response = new SupplierResponse();
        response.setId(supplier.getId());
        response.setName(supplier.getName());
        response.setPhone(supplier.getPhone());
        response.setEmail(supplier.getEmail());
        response.setAddress(supplier.getAddress());
        response.setContactPerson(supplier.getContactPerson());
        if (supplier.getShop() != null) {
            response.setShopId(supplier.getShop().getId());
            response.setShopName(supplier.getShop().getName());
        }
        response.setCreatedAt(supplier.getCreatedAt());
        response.setUpdatedAt(supplier.getUpdatedAt());
        return response;
    }
}
