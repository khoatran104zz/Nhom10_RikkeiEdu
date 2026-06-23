package com.company.sales_management.service.impl;

import com.company.sales_management.dto.request.EmployeeRequest;
import com.company.sales_management.dto.response.EmployeeResponse;
import com.company.sales_management.entity.Branch;
import com.company.sales_management.entity.Employee;
import com.company.sales_management.entity.Shop;
import com.company.sales_management.exception.ResourceNotFoundException;
import com.company.sales_management.repository.BranchRepository;
import com.company.sales_management.repository.EmployeeRepository;
import com.company.sales_management.service.EmployeeService;
import com.company.sales_management.service.TenantScopeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private TenantScopeService tenantScopeService;

    @Override
    public Page<EmployeeResponse> findAll(String search, Integer branchId, Pageable pageable) {
        Integer scopedBranchId = tenantScopeService.branchScopeId();
        Integer effectiveBranchId = scopedBranchId != null ? scopedBranchId : branchId;
        return employeeRepository.findAllWithFilters(tenantScopeService.requiredShopId(), search, effectiveBranchId, pageable).map(this::toResponse);
    }

    @Override
    public EmployeeResponse findById(Integer id) {
        Employee employee = employeeRepository.findByIdAndShopId(id, tenantScopeService.requiredShopId())
                .orElseThrow(() -> new ResourceNotFoundException("Nhân viên", "id", id));
        if (employee.getBranch() != null) {
            tenantScopeService.assertCanAccessBranch(employee.getBranch().getId());
        }
        return toResponse(employee);
    }

    @Override
    public EmployeeResponse create(EmployeeRequest request) {
        Employee employee = new Employee();
        mapRequestToEntity(request, employee);
        return toResponse(employeeRepository.save(employee));
    }

    @Override
    public EmployeeResponse update(Integer id, EmployeeRequest request) {
        Employee employee = employeeRepository.findByIdAndShopId(id, tenantScopeService.requiredShopId())
                .orElseThrow(() -> new ResourceNotFoundException("Nhân viên", "id", id));
        if (employee.getBranch() != null) {
            tenantScopeService.assertCanAccessBranch(employee.getBranch().getId());
        }
        mapRequestToEntity(request, employee);
        return toResponse(employeeRepository.save(employee));
    }

    @Override
    public void delete(Integer id) {
        Employee employee = employeeRepository.findByIdAndShopId(id, tenantScopeService.requiredShopId())
                .orElseThrow(() -> new ResourceNotFoundException("Nhân viên", "id", id));
        if (employee.getBranch() != null) {
            tenantScopeService.assertCanAccessBranch(employee.getBranch().getId());
        }
        employeeRepository.delete(employee);
    }

    private void mapRequestToEntity(EmployeeRequest request, Employee employee) {
        Shop shop = tenantScopeService.currentShop();
        employee.setShop(shop);
        employee.setName(request.getName());
        employee.setPhone(request.getPhone());
        employee.setEmail(request.getEmail());
        employee.setPosition(request.getPosition());
        Branch branch = tenantScopeService.resolveBranchForWrite(request.getBranchId());
        if (branch != null) {
            branch = branchRepository.findByIdAndShopId(branch.getId(), shop.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Chi nhánh", "id", request.getBranchId()));
            employee.setBranch(branch);
        } else {
            employee.setBranch(null);
        }
    }

    private EmployeeResponse toResponse(Employee employee) {
        EmployeeResponse response = new EmployeeResponse();
        response.setId(employee.getId());
        response.setName(employee.getName());
        response.setPhone(employee.getPhone());
        response.setEmail(employee.getEmail());
        response.setPosition(employee.getPosition());
        if (employee.getShop() != null) {
            response.setShopId(employee.getShop().getId());
            response.setShopName(employee.getShop().getName());
        }
        if (employee.getBranch() != null) {
            response.setBranchId(employee.getBranch().getId());
            response.setBranchName(employee.getBranch().getName());
        }
        response.setCreatedAt(employee.getCreatedAt());
        response.setUpdatedAt(employee.getUpdatedAt());
        return response;
    }
}
