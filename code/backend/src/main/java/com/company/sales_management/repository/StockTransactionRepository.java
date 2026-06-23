package com.company.sales_management.repository;

import com.company.sales_management.entity.StockTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface StockTransactionRepository extends JpaRepository<StockTransaction, Integer> {
    
    @Query("SELECT st FROM StockTransaction st JOIN FETCH st.product LEFT JOIN FETCH st.supplier WHERE st.shop.id = :shopId AND (:branchId IS NULL OR st.branch.id = :branchId) AND st.type = :type ORDER BY st.createdAt DESC")
    List<StockTransaction> findHistoryByType(@Param("shopId") Integer shopId, @Param("branchId") Integer branchId, @Param("type") String type);

    @Query("SELECT st FROM StockTransaction st WHERE " +
           "st.shop.id = :shopId AND " +
           "(:branchId IS NULL OR st.branch.id = :branchId) AND " +
           "(:type IS NULL OR st.type = :type) AND " +
           "(:productId IS NULL OR st.product.id = :productId) AND " +
           "(:startDate IS NULL OR st.createdAt >= :startDate) AND " +
           "(:endDate IS NULL OR st.createdAt <= :endDate)")
    Page<StockTransaction> findAllWithFilters(@Param("shopId") Integer shopId,
                                              @Param("branchId") Integer branchId,
                                              @Param("type") String type,
                                              @Param("productId") Integer productId,
                                              @Param("startDate") LocalDateTime startDate,
                                              @Param("endDate") LocalDateTime endDate,
                                              Pageable pageable);
}
