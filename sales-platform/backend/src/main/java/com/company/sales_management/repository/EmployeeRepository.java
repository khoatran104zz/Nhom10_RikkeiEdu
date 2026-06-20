package com.company.sales_management.repository;

import com.company.sales_management.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    @Query("SELECT e FROM Employee e WHERE " +
           "(:search IS NULL OR :search = '' OR " +
           "LOWER(e.name) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY e.id DESC")
    List<Employee> search(@Param("search") String search);
}
