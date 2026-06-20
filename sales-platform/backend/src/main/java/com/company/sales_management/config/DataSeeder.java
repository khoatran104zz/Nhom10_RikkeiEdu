package com.company.sales_management.config;

import com.company.sales_management.entity.*;
import com.company.sales_management.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Sinh dữ liệu mẫu để frontend có dữ liệu hiển thị ngay sau khi chạy lần đầu.
 * Vì mặc định dùng H2 in-memory, dữ liệu sẽ mất khi tắt server - chạy lại
 * sẽ tự sinh lại từ đầu. Khi đổi sang MySQL thật, seeder chỉ chạy đúng 1 lần
 * (kiểm tra DB rỗng) nên không lặp dữ liệu ở các lần khởi động sau.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final SupplierRepository supplierRepository;
    private final EmployeeRepository employeeRepository;
    private final OrderRepository orderRepository;
    private final StoreSettingsRepository storeSettingsRepository;

    public DataSeeder(CategoryRepository categoryRepository, BrandRepository brandRepository,
                       ProductRepository productRepository, CustomerRepository customerRepository,
                       SupplierRepository supplierRepository, EmployeeRepository employeeRepository,
                       OrderRepository orderRepository, StoreSettingsRepository storeSettingsRepository) {
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
        this.supplierRepository = supplierRepository;
        this.employeeRepository = employeeRepository;
        this.orderRepository = orderRepository;
        this.storeSettingsRepository = storeSettingsRepository;
    }

    @Override
    public void run(String... args) {
        if (categoryRepository.count() > 0) return; // đã có dữ liệu, không seed lại

        // ── Settings ─────────────────────────────────
        StoreSettings settings = new StoreSettings();
        settings.setStoreName("eManage Store");
        settings.setAddress("123 Nguyễn Huệ, Q.1, TP.HCM");
        settings.setPhone("028 1234 5678");
        settings.setEmail("contact@emanage.vn");
        settings.setTaxCode("0312345678");
        storeSettingsRepository.save(settings);

        // ── Categories ───────────────────────────────
        Category dienThoai = save(categoryRepository, "Điện thoại", "Điện thoại di động các loại");
        Category laptop = save(categoryRepository, "Laptop", "Máy tính xách tay");
        Category phuKien = save(categoryRepository, "Phụ kiện", "Phụ kiện điện tử");

        // ── Brands ───────────────────────────────────
        Brand apple = saveBrand(brandRepository, "Apple", "Thương hiệu công nghệ Mỹ");
        Brand samsung = saveBrand(brandRepository, "Samsung", "Thương hiệu công nghệ Hàn Quốc");
        Brand dell = saveBrand(brandRepository, "Dell", "Thương hiệu máy tính Mỹ");

        // ── Products ─────────────────────────────────
        Product p1 = newProduct("IP15-128GB", "iPhone 15 128GB", dienThoai, apple,
                new BigDecimal("18000000"), new BigDecimal("22990000"), 25);
        Product p2 = newProduct("SS-S24-256GB", "Samsung Galaxy S24 256GB", dienThoai, samsung,
                new BigDecimal("15000000"), new BigDecimal("19990000"), 18);
        Product p3 = newProduct("DELL-XPS13", "Dell XPS 13", laptop, dell,
                new BigDecimal("22000000"), new BigDecimal("27990000"), 8);
        Product p4 = newProduct("AIRPODS-PRO2", "AirPods Pro 2", phuKien, apple,
                new BigDecimal("4500000"), new BigDecimal("5990000"), 40);
        Product p5 = newProduct("SS-CHARGER-25W", "Sạc nhanh Samsung 25W", phuKien, samsung,
                new BigDecimal("250000"), new BigDecimal("390000"), 5);
        productRepository.saveAll(List.of(p1, p2, p3, p4, p5));

        // ── Customers ────────────────────────────────
        Customer c1 = newCustomer("Nguyễn Văn An", "0901111222", "an.nguyen@gmail.com", "Q.1, TP.HCM");
        Customer c2 = newCustomer("Trần Thị Bình", "0902222333", "binh.tran@gmail.com", "Q.3, TP.HCM");
        c1 = customerRepository.save(c1);
        c1.setCode("KH" + String.format("%05d", c1.getId()));
        c2 = customerRepository.save(c2);
        c2.setCode("KH" + String.format("%05d", c2.getId()));
        customerRepository.saveAll(List.of(c1, c2));

        // ── Suppliers ────────────────────────────────
        save(supplierRepository, "Công ty TNHH Phân phối ABC", "028 3333 4444",
                "contact@abc.vn", "Q.5, TP.HCM");
        save(supplierRepository, "Công ty CP Thương mại XYZ", "028 5555 6666",
                "info@xyz.vn", "Q.7, TP.HCM");

        // ── Employees ────────────────────────────────
        Employee emp1 = newEmployee("Lê Văn Quản Lý", "Quản lý", "0911111111", "manager@emanage.vn");
        Employee emp2 = newEmployee("Phạm Thị Bán Hàng", "Nhân viên bán hàng", "0922222222", "sales@emanage.vn");
        employeeRepository.saveAll(List.of(emp1, emp2));

        // ── Sample Order ─────────────────────────────
        Order order = new Order();
        order.setCustomer(c1);
        order.setEmployee(emp2);
        order.setStatus("completed");
        order.setPaymentMethod("cash");
        order.setDiscount(BigDecimal.ZERO);

        OrderItem item = new OrderItem();
        item.setProduct(p1);
        item.setProductName(p1.getName());
        item.setQuantity(1);
        item.setPrice(p1.getSalePrice());
        order.addItem(item);
        order.setTotal(p1.getSalePrice());

        Order savedOrder = orderRepository.save(order);
        savedOrder.setCode("DH" + String.format("%05d", savedOrder.getId()));
        orderRepository.save(savedOrder);
    }

    private Category save(CategoryRepository repo, String name, String desc) {
        Category c = new Category();
        c.setName(name);
        c.setDescription(desc);
        return repo.save(c);
    }

    private Brand saveBrand(BrandRepository repo, String name, String desc) {
        Brand b = new Brand();
        b.setName(name);
        b.setDescription(desc);
        return repo.save(b);
    }

    private void save(SupplierRepository repo, String name, String phone, String email, String address) {
        Supplier s = new Supplier();
        s.setName(name);
        s.setPhone(phone);
        s.setEmail(email);
        s.setAddress(address);
        repo.save(s);
    }

    private Product newProduct(String sku, String name, Category cat, Brand brand,
                                BigDecimal cost, BigDecimal sale, int stock) {
        Product p = new Product();
        p.setSku(sku);
        p.setName(name);
        p.setCategory(cat);
        p.setBrand(brand);
        p.setCostPrice(cost);
        p.setSalePrice(sale);
        p.setStock(stock);
        return p;
    }

    private Customer newCustomer(String name, String phone, String email, String address) {
        Customer c = new Customer();
        c.setName(name);
        c.setPhone(phone);
        c.setEmail(email);
        c.setAddress(address);
        c.setPoints(0);
        return c;
    }

    private Employee newEmployee(String name, String role, String phone, String email) {
        Employee e = new Employee();
        e.setName(name);
        e.setRole(role);
        e.setPhone(phone);
        e.setEmail(email);
        return e;
    }
}
