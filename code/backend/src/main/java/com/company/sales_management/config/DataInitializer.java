package com.company.sales_management.config;

import com.company.sales_management.entity.*;
import com.company.sales_management.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private ShopRepository shopRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private StockTransactionRepository stockTransactionRepository;

    @Autowired
    private SettingRepository settingRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. Initial Roles
        initRole("SYSTEM_ADMIN", "Quản trị viên toàn hệ thống");
        initRole("ADMIN", "Quản trị viên shop");
        initRole("BRANCH_MANAGER", "Quản lý chi nhánh");
        initRole("CASHIER", "Nhân viên thu ngân");
        initRole("INVENTORY_STAFF", "Nhân viên kho");
        initRole("ACCOUNTANT", "Nhân viên kế toán");
        initRole("CUSTOMER", "Khách hàng");

        // 2. Initial Shop and Branch
        Shop defaultShop = initShop("EMANAGE", "eManage Store");
        Branch branch = initBranch(defaultShop, "Trung tâm", "Hà Nội");

        // 3. Initial System Admin User
        Role systemAdminRole = roleRepository.findByName("SYSTEM_ADMIN").orElse(null);
        if (systemAdminRole != null && !userRepository.existsByUsername("system_admin")) {
            User systemAdmin = new User();
            systemAdmin.setUsername("system_admin");
            systemAdmin.setPassword(passwordEncoder.encode("system123"));
            systemAdmin.setFullName("System Admin");
            systemAdmin.setEmail("system@emanage.vn");
            systemAdmin.setActive(true);
            systemAdmin.setRole(systemAdminRole);
            userRepository.save(systemAdmin);
        }

        // 4. Initial Shop Admin User
        Role adminRole = roleRepository.findByName("ADMIN").orElse(null);
        if (adminRole != null && !userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFullName("Lê Văn Admin");
            admin.setEmail("admin@emanage.vn");
            admin.setPhone("0123456789");
            admin.setActive(true);
            admin.setRole(adminRole);
            admin.setShop(defaultShop);
            admin.setBranch(branch);
            userRepository.save(admin);
        } else {
            userRepository.findByUsername("admin").ifPresent(admin -> {
                if (admin.getShop() == null) admin.setShop(defaultShop);
                if (admin.getBranch() == null) admin.setBranch(branch);
                userRepository.save(admin);
            });
        }

        backfillExistingTenantData(defaultShop, branch);
    }

    private void initRole(String name, String description) {
        Optional<Role> existing = roleRepository.findByName(name);
        if (existing.isEmpty()) {
            Role role = new Role();
            role.setName(name);
            role.setDescription(description);
            roleRepository.save(role);
        }
    }

    private Shop initShop(String code, String name) {
        return shopRepository.findByCode(code)
                .orElseGet(() -> {
                    Shop shop = new Shop();
                    shop.setCode(code);
                    shop.setName(name);
                    shop.setActive(true);
                    return shopRepository.save(shop);
                });
    }

    private Branch initBranch(Shop shop, String name, String address) {
        return branchRepository.findAll().stream()
                .filter(b -> b.getName().equalsIgnoreCase(name) && (b.getShop() == null || shop.getId().equals(b.getShop().getId())))
                .findFirst()
                .orElseGet(() -> {
                    Branch b = new Branch();
                    b.setName(name);
                    b.setAddress(address);
                    b.setShop(shop);
                    return branchRepository.save(b);
                });
    }

    private void backfillExistingTenantData(Shop shop, Branch branch) {
        branchRepository.findAll().forEach(item -> {
            if (item.getShop() == null) {
                item.setShop(shop);
                branchRepository.save(item);
            }
        });
        userRepository.findAll().forEach(item -> {
            boolean changed = false;
            if (item.getShop() == null && item.getRole() != null && !"SYSTEM_ADMIN".equals(item.getRole().getName())) {
                item.setShop(shop);
                changed = true;
            }
            if (item.getBranch() == null && item.getShop() != null && item.getRole() != null && !"SYSTEM_ADMIN".equals(item.getRole().getName())) {
                item.setBranch(branch);
                changed = true;
            }
            if (changed) userRepository.save(item);
        });
        categoryRepository.findAll().forEach(item -> { if (item.getShop() == null) { item.setShop(shop); categoryRepository.save(item); } });
        brandRepository.findAll().forEach(item -> { if (item.getShop() == null) { item.setShop(shop); brandRepository.save(item); } });
        productRepository.findAll().forEach(item -> { if (item.getShop() == null) { item.setShop(shop); productRepository.save(item); } });
        customerRepository.findAll().forEach(item -> { if (item.getShop() == null) { item.setShop(shop); customerRepository.save(item); } });
        supplierRepository.findAll().forEach(item -> { if (item.getShop() == null) { item.setShop(shop); supplierRepository.save(item); } });
        employeeRepository.findAll().forEach(item -> {
            if (item.getShop() == null) item.setShop(shop);
            if (item.getBranch() == null) item.setBranch(branch);
            employeeRepository.save(item);
        });
        orderRepository.findAll().forEach(item -> {
            if (item.getShop() == null) item.setShop(shop);
            if (item.getBranch() == null) item.setBranch(branch);
            orderRepository.save(item);
        });
        stockTransactionRepository.findAll().forEach(item -> {
            if (item.getShop() == null) item.setShop(shop);
            if (item.getBranch() == null) item.setBranch(branch);
            stockTransactionRepository.save(item);
        });
        settingRepository.findAll().forEach(item -> {
            if (item.getShop() == null) {
                item.setShop(shop);
                settingRepository.save(item);
            }
        });
    }
}
