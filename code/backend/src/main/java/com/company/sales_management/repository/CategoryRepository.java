package com.company.sales_management.repository;

import com.company.sales_management.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    
    @Query("SELECT c FROM Category c WHERE c.shop.id = :shopId AND (:search IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%'))) ORDER BY c.createdAt DESC")
    List<Category> searchCategories(@Param("shopId") Integer shopId, @Param("search") String search);

    List<Category> findByShopIdAndNameContainingIgnoreCase(Integer shopId, String name);

    List<Category> findByShopId(Integer shopId);

    java.util.Optional<Category> findByIdAndShopId(Integer id, Integer shopId);

    boolean existsByShopIdAndName(Integer shopId, String name);

    boolean existsByShopIdAndNameAndIdNot(Integer shopId, String name, Integer id);
}
