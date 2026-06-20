package com.company.sales_management.repository;

import com.company.sales_management.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("SELECT o FROM Order o WHERE " +
           "(:search IS NULL OR :search = '' OR " +
           "LOWER(o.code) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(o.customer.name) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:status IS NULL OR :status = '' OR o.status = :status) " +
           "ORDER BY o.id DESC")
    Page<Order> search(@Param("search") String search, @Param("status") String status, Pageable pageable);

    List<Order> findTop5ByOrderByIdDesc();

    List<Order> findByStatusAndCreatedAtBetween(String status, LocalDateTime from, LocalDateTime to);

    List<Order> findByStatus(String status);

    long countByStatus(String status);
}
