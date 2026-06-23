package com.company.sales_management.repository;

import com.company.sales_management.entity.Branch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BranchRepository extends JpaRepository<Branch, Integer> {
    List<Branch> findByShopId(Integer shopId);
    Optional<Branch> findByIdAndShopId(Integer id, Integer shopId);
    boolean existsByIdAndShopId(Integer id, Integer shopId);
}
