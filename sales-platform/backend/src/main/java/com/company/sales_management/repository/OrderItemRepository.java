package com.company.sales_management.repository;

import com.company.sales_management.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Query("SELECT oi FROM OrderItem oi WHERE oi.order.status = 'completed'")
    List<OrderItem> findAllFromCompletedOrders();
}
