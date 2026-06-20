package com.company.sales_management.repository;

import com.company.sales_management.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BrandRepository extends JpaRepository<Brand, Long> {
    List<Brand> findByNameContainingIgnoreCaseOrderByIdDesc(String name);
}
