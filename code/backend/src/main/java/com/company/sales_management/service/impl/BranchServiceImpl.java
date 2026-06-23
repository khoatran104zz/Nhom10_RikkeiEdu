package com.company.sales_management.service.impl;

import com.company.sales_management.dto.request.BranchRequest;
import com.company.sales_management.dto.response.BranchResponse;
import com.company.sales_management.entity.Branch;
import com.company.sales_management.entity.Shop;
import com.company.sales_management.entity.User;
import com.company.sales_management.exception.ResourceNotFoundException;
import com.company.sales_management.repository.BranchRepository;
import com.company.sales_management.repository.ShopRepository;
import com.company.sales_management.service.BranchService;
import com.company.sales_management.service.TenantScopeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BranchServiceImpl implements BranchService {

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private ShopRepository shopRepository;

    @Autowired
    private TenantScopeService tenantScopeService;

    @Override
    public List<BranchResponse> findAll() {
        User current = tenantScopeService.currentUser();
        List<Branch> branches = tenantScopeService.isSystemAdmin(current)
                ? branchRepository.findAll()
                : branchRepository.findByShopId(tenantScopeService.requiredShopId());
        return branches.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public BranchResponse findById(Integer id) {
        User current = tenantScopeService.currentUser();
        Branch branch = tenantScopeService.isSystemAdmin(current)
                ? branchRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Chi nhánh", "id", id))
                : branchRepository.findByIdAndShopId(id, tenantScopeService.requiredShopId())
                        .orElseThrow(() -> new ResourceNotFoundException("Chi nhánh", "id", id));
        return toResponse(branch);
    }

    @Override
    public BranchResponse create(BranchRequest request) {
        Branch branch = new Branch();
        branch.setName(request.getName());
        branch.setAddress(request.getAddress());
        branch.setPhone(request.getPhone());
        branch.setShop(resolveShop(request));
        return toResponse(branchRepository.save(branch));
    }

    @Override
    public BranchResponse update(Integer id, BranchRequest request) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chi nhánh", "id", id));
        if (!tenantScopeService.isSystemAdmin(tenantScopeService.currentUser())
                && (branch.getShop() == null || !tenantScopeService.requiredShopId().equals(branch.getShop().getId()))) {
            throw new ResourceNotFoundException("Chi nhánh", "id", id);
        }
        branch.setName(request.getName());
        branch.setAddress(request.getAddress());
        branch.setPhone(request.getPhone());
        branch.setShop(resolveShop(request));
        return toResponse(branchRepository.save(branch));
    }

    @Override
    public void delete(Integer id) {
        User current = tenantScopeService.currentUser();
        if (tenantScopeService.isSystemAdmin(current)) {
            if (!branchRepository.existsById(id)) {
                throw new ResourceNotFoundException("Chi nhánh", "id", id);
            }
            branchRepository.deleteById(id);
            return;
        }
        Branch branch = branchRepository.findByIdAndShopId(id, tenantScopeService.requiredShopId())
                .orElseThrow(() -> new ResourceNotFoundException("Chi nhánh", "id", id));
        branchRepository.delete(branch);
    }

    private Shop resolveShop(BranchRequest request) {
        User current = tenantScopeService.currentUser();
        if (tenantScopeService.isSystemAdmin(current)) {
            if (request.getShopId() == null) {
                throw new com.company.sales_management.exception.BadRequestException("Chi nhánh phải được gán shop");
            }
            return shopRepository.findById(request.getShopId())
                    .orElseThrow(() -> new ResourceNotFoundException("Shop", "id", request.getShopId()));
        }
        return tenantScopeService.currentShop();
    }

    private BranchResponse toResponse(Branch branch) {
        BranchResponse response = new BranchResponse();
        response.setId(branch.getId());
        response.setName(branch.getName());
        response.setAddress(branch.getAddress());
        response.setPhone(branch.getPhone());
        if (branch.getShop() != null) {
            response.setShopId(branch.getShop().getId());
            response.setShopName(branch.getShop().getName());
        }
        response.setCreatedAt(branch.getCreatedAt());
        response.setUpdatedAt(branch.getUpdatedAt());
        return response;
    }
}
