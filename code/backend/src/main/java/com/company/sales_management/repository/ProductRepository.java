package com.company.sales_management.repository;

import com.company.sales_management.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    
    @Query("SELECT p FROM Product p WHERE p.shop.id = :shopId AND " +
           "(:active IS NULL OR p.active = :active) AND " +
           "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
           "(:brandId IS NULL OR p.brand.id = :brandId) AND " +
           "(:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.sku) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Product> findAllWithFilters(@Param("shopId") Integer shopId,
                                     @Param("search") String search,
                                     @Param("categoryId") Integer categoryId, 
                                     @Param("brandId") Integer brandId, 
                                     @Param("active") Boolean active, 
                                     Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.shop.id = :shopId AND p.active = true AND (:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.sku) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Product> searchActiveProducts(@Param("shopId") Integer shopId, @Param("search") String search, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.shop.id = :shopId AND p.active = true ORDER BY p.createdAt DESC")
    List<Product> findAllActive(@Param("shopId") Integer shopId);

    Optional<Product> findByIdAndShopId(Integer id, Integer shopId);

    Optional<Product> findByIdAndShopIdAndActiveTrue(Integer id, Integer shopId);

    boolean existsByShopIdAndSku(Integer shopId, String sku);

    boolean existsByShopIdAndSkuAndIdNot(Integer shopId, String sku, Integer id);

    long countByShopIdAndActiveTrue(Integer shopId);

    @Query("SELECT p FROM Product p WHERE p.shop.id = :shopId AND p.active = true AND p.stock <= 10")
    List<Product> findLowStockProducts(@Param("shopId") Integer shopId);
}
