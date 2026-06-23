package com.company.sales_management.repository;

import com.company.sales_management.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Integer> {
    
    @Query("SELECT b FROM Brand b WHERE b.shop.id = :shopId AND (:search IS NULL OR LOWER(b.name) LIKE LOWER(CONCAT('%', :search, '%'))) ORDER BY b.createdAt DESC")
    List<Brand> searchBrands(@Param("shopId") Integer shopId, @Param("search") String search);

    List<Brand> findByShopIdAndNameContainingIgnoreCase(Integer shopId, String name);

    List<Brand> findByShopId(Integer shopId);

    java.util.Optional<Brand> findByIdAndShopId(Integer id, Integer shopId);

    boolean existsByShopIdAndName(Integer shopId, String name);

    boolean existsByShopIdAndNameAndIdNot(Integer shopId, String name, Integer id);
}
