package com.company.sales_management.repository;

import com.company.sales_management.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    
    @Query("SELECT o FROM Order o LEFT JOIN o.customer c WHERE o.shop.id = :shopId " +
           "AND (:branchId IS NULL OR o.branch.id = :branchId) " +
           "AND " +
           "(:search IS NULL OR LOWER(o.code) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:status IS NULL OR o.status = :status) " +
           "AND (:startDate IS NULL OR o.createdAt >= :startDate) " +
           "AND (:endDate IS NULL OR o.createdAt <= :endDate)")
    Page<Order> searchOrders(@Param("shopId") Integer shopId,
                             @Param("branchId") Integer branchId,
                             @Param("search") String search,
                             @Param("status") String status, 
                             @Param("startDate") LocalDateTime startDate, 
                             @Param("endDate") LocalDateTime endDate, 
                             Pageable pageable);

    @Query("SELECT o FROM Order o WHERE o.shop.id = :shopId AND (:branchId IS NULL OR o.branch.id = :branchId) ORDER BY o.createdAt DESC")
    List<Order> findRecentOrders(@Param("shopId") Integer shopId, @Param("branchId") Integer branchId, Pageable pageable);

    @Query("SELECT COALESCE(SUM(o.total - o.discount), 0.0) FROM Order o WHERE o.shop.id = :shopId AND (:branchId IS NULL OR o.branch.id = :branchId) AND o.status = 'completed'")
    Double calculateTotalRevenue(@Param("shopId") Integer shopId, @Param("branchId") Integer branchId);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.shop.id = :shopId AND (:branchId IS NULL OR o.branch.id = :branchId) AND o.status = :status")
    long countByStatus(@Param("shopId") Integer shopId, @Param("branchId") Integer branchId, @Param("status") String status);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.shop.id = :shopId AND (:branchId IS NULL OR o.branch.id = :branchId) AND o.createdAt BETWEEN :start AND :end")
    long countByCreatedAtBetween(@Param("shopId") Integer shopId, @Param("branchId") Integer branchId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COALESCE(SUM(o.total - o.discount), 0.0) FROM Order o WHERE o.shop.id = :shopId AND (:branchId IS NULL OR o.branch.id = :branchId) AND o.createdAt BETWEEN :start AND :end AND o.status = 'completed'")
    Double sumFinalAmountByCreatedAtBetween(@Param("shopId") Integer shopId, @Param("branchId") Integer branchId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT CAST(o.createdAt AS date), SUM(o.total - o.discount), COUNT(o) FROM Order o WHERE o.shop.id = :shopId AND (:branchId IS NULL OR o.branch.id = :branchId) AND o.createdAt BETWEEN :start AND :end AND o.status = 'completed' GROUP BY CAST(o.createdAt AS date) ORDER BY CAST(o.createdAt AS date) ASC")
    List<Object[]> getRevenueByDay(@Param("shopId") Integer shopId, @Param("branchId") Integer branchId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT oi.product.id, oi.productName, SUM(oi.quantity), SUM(oi.price * oi.quantity) FROM OrderItem oi WHERE oi.order.shop.id = :shopId AND (:branchId IS NULL OR oi.order.branch.id = :branchId) AND oi.order.createdAt BETWEEN :start AND :end AND oi.order.status = 'completed' GROUP BY oi.product.id, oi.productName ORDER BY SUM(oi.quantity) DESC")
    List<Object[]> getTopProducts(@Param("shopId") Integer shopId, @Param("branchId") Integer branchId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    java.util.Optional<Order> findByIdAndShopId(Integer id, Integer shopId);
}
