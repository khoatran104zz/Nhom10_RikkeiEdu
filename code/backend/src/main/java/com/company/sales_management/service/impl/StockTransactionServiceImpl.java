package com.company.sales_management.service.impl;

import com.company.sales_management.dto.request.StockTransactionRequest;
import com.company.sales_management.dto.response.StockTransactionResponse;
import com.company.sales_management.entity.*;
import com.company.sales_management.exception.ResourceNotFoundException;
import com.company.sales_management.repository.*;
import com.company.sales_management.service.StockTransactionService;
import com.company.sales_management.service.TenantScopeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class StockTransactionServiceImpl implements StockTransactionService {

    @Autowired
    private StockTransactionRepository stockTransactionRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private TenantScopeService tenantScopeService;

    @Override
    public Page<StockTransactionResponse> findAll(String type, Integer productId, String startDate, String endDate, Pageable pageable) {
        LocalDateTime start = startDate != null ? LocalDate.parse(startDate).atStartOfDay() : null;
        LocalDateTime end = endDate != null ? LocalDate.parse(endDate).atTime(23, 59, 59) : null;
        return stockTransactionRepository.findAllWithFilters(tenantScopeService.requiredShopId(), tenantScopeService.branchScopeId(), type, productId, start, end, pageable)
                .map(this::toResponse);
    }

    @Override
    @Transactional
    public StockTransactionResponse create(StockTransactionRequest request) {
        Shop shop = tenantScopeService.currentShop();
        Product product = productRepository.findByIdAndShopId(request.getProductId(), shop.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm", "id", request.getProductId()));

        StockTransaction transaction = new StockTransaction();
        transaction.setShop(shop);
        transaction.setProduct(product);
        transaction.setType(request.getType());
        transaction.setQuantity(request.getQuantity());
        transaction.setUnitPrice(request.getUnitPrice());
        transaction.setNote(request.getNote());

        if (request.getSupplierId() != null) {
            Supplier supplier = supplierRepository.findByIdAndShopId(request.getSupplierId(), shop.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Nhà cung cấp", "id", request.getSupplierId()));
            transaction.setSupplier(supplier);
        }
        Branch branch = tenantScopeService.resolveBranchForWrite(request.getBranchId());
        transaction.setBranch(branch);

        // Update stock quantity
        switch (request.getType()) {
            case "IMPORT" -> product.setStock(product.getStock() + request.getQuantity());
            case "EXPORT" -> {
                if (product.getStock() < request.getQuantity()) {
                    throw new com.company.sales_management.exception.BadRequestException("Sản phẩm không đủ tồn kho");
                }
                product.setStock(product.getStock() - request.getQuantity());
            }
            case "ADJUST" -> product.setStock(request.getQuantity());
        }
        productRepository.save(product);
        return toResponse(stockTransactionRepository.save(transaction));
    }

    private StockTransactionResponse toResponse(StockTransaction t) {
        StockTransactionResponse response = new StockTransactionResponse();
        response.setId(t.getId());
        if (t.getShop() != null) {
            response.setShopId(t.getShop().getId());
            response.setShopName(t.getShop().getName());
        }
        response.setType(t.getType());
        response.setQuantity(t.getQuantity());
        response.setUnitPrice(t.getUnitPrice());
        response.setNote(t.getNote());
        response.setCreatedAt(t.getCreatedAt());
        if (t.getProduct() != null) {
            response.setProductId(t.getProduct().getId());
            response.setProductName(t.getProduct().getName());
        }
        if (t.getSupplier() != null) {
            response.setSupplierId(t.getSupplier().getId());
            response.setSupplierName(t.getSupplier().getName());
        }
        if (t.getBranch() != null) {
            response.setBranchId(t.getBranch().getId());
            response.setBranchName(t.getBranch().getName());
        }
        return response;
    }
}
