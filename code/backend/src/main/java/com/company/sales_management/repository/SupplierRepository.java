package com.company.sales_management.repository;

import com.company.sales_management.entity.Supplier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Integer> {
    
    @Query("SELECT s FROM Supplier s WHERE s.shop.id = :shopId AND (:search IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%', :search, '%')) OR s.phone LIKE CONCAT('%', :search, '%')) ORDER BY s.createdAt DESC")
    List<Supplier> searchSuppliers(@Param("shopId") Integer shopId, @Param("search") String search);

    @Query("SELECT s FROM Supplier s WHERE s.shop.id = :shopId AND (:search IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%', :search, '%')) OR s.phone LIKE CONCAT('%', :search, '%'))")
    Page<Supplier> findBySearchTerm(@Param("shopId") Integer shopId, @Param("search") String search, Pageable pageable);

    Page<Supplier> findByShopId(Integer shopId, Pageable pageable);

    java.util.Optional<Supplier> findByIdAndShopId(Integer id, Integer shopId);
}
