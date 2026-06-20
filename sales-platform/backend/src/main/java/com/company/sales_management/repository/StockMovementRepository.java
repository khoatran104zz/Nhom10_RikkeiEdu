package com.company.sales_management.repository;

import com.company.sales_management.entity.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {
    List<StockMovement> findByTypeOrderByIdDesc(String type);
    List<StockMovement> findAllByOrderByIdDesc();
}
