package com.company.sales_management.service;

import com.company.sales_management.entity.Branch;
import com.company.sales_management.entity.Shop;
import com.company.sales_management.entity.User;
import com.company.sales_management.exception.ForbiddenException;
import com.company.sales_management.exception.ResourceNotFoundException;
import com.company.sales_management.repository.BranchRepository;
import com.company.sales_management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class TenantScopeService {

    private static final Set<String> BRANCH_SCOPED_ROLES = Set.of("BRANCH_MANAGER", "CASHIER", "INVENTORY_STAFF", "STAFF");

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BranchRepository branchRepository;

    public User currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getName() == null) {
            throw new ForbiddenException("Bạn cần đăng nhập để truy cập dữ liệu này");
        }
        return userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new ForbiddenException("Không tìm thấy người dùng hiện tại"));
    }

    public boolean isSystemAdmin(User user) {
        return hasRole(user, "SYSTEM_ADMIN");
    }

    public void requireSystemAdmin() {
        if (!isSystemAdmin(currentUser())) {
            throw new ForbiddenException("Chỉ SYSTEM_ADMIN được phép thực hiện thao tác này");
        }
    }

    public Integer requiredShopId() {
        return currentShop().getId();
    }

    public Shop currentShop() {
        User user = currentUser();
        if (isSystemAdmin(user)) {
            throw new ForbiddenException("SYSTEM_ADMIN cần chọn shop cụ thể trước khi truy cập dữ liệu nghiệp vụ");
        }
        if (user.getShop() == null) {
            throw new ForbiddenException("Tài khoản chưa được gán shop");
        }
        return user.getShop();
    }

    public Integer branchScopeId() {
        User user = currentUser();
        if (user.getBranch() != null && BRANCH_SCOPED_ROLES.contains(roleName(user))) {
            return user.getBranch().getId();
        }
        return null;
    }

    public Branch resolveBranchForWrite(Integer requestedBranchId) {
        Integer shopId = requiredShopId();
        Integer scopedBranchId = branchScopeId();
        Integer branchId = scopedBranchId != null ? scopedBranchId : requestedBranchId;

        if (branchId == null) {
            return null;
        }

        Branch branch = branchRepository.findByIdAndShopId(branchId, shopId)
                .orElseThrow(() -> new ResourceNotFoundException("Chi nhánh", "id", branchId));

        if (scopedBranchId != null && !scopedBranchId.equals(branch.getId())) {
            throw new ForbiddenException("Bạn không được thao tác dữ liệu ngoài chi nhánh được gán");
        }

        return branch;
    }

    public void assertCanAccessBranch(Integer branchId) {
        Integer scopedBranchId = branchScopeId();
        if (scopedBranchId != null && (branchId == null || !scopedBranchId.equals(branchId))) {
            throw new ForbiddenException("Bạn không được truy cập dữ liệu ngoài chi nhánh được gán");
        }
    }

    public String roleName(User user) {
        return user.getRole() != null ? user.getRole().getName() : null;
    }

    private boolean hasRole(User user, String roleName) {
        return roleName.equals(roleName(user));
    }
}
