package com.company.sales_management.repository;

import com.company.sales_management.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    
    @Query("SELECT c FROM Customer c WHERE c.shop.id = :shopId AND (:search IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')) OR c.phone LIKE CONCAT('%', :search, '%')) ORDER BY c.createdAt DESC")
    List<Customer> searchCustomers(@Param("shopId") Integer shopId, @Param("search") String search);

    @Query("SELECT c FROM Customer c WHERE c.shop.id = :shopId AND (:search IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')) OR c.phone LIKE CONCAT('%', :search, '%'))")
    Page<Customer> findBySearchTerm(@Param("shopId") Integer shopId, @Param("search") String search, Pageable pageable);

    Optional<Customer> findByIdAndShopId(Integer id, Integer shopId);

    Optional<Customer> findByShopIdAndPhone(Integer shopId, String phone);

    boolean existsByShopIdAndPhone(Integer shopId, String phone);

    boolean existsByShopIdAndPhoneAndIdNot(Integer shopId, String phone, Integer id);

    long countByShopId(Integer shopId);
}
