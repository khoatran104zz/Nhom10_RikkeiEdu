package com.company.sales_management.service;

import com.company.sales_management.dto.EmployeeDto;
import com.company.sales_management.entity.Employee;
import com.company.sales_management.exception.NotFoundException;
import com.company.sales_management.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Transactional(readOnly = true)
    public List<EmployeeDto.Response> getAll(String search) {
        return employeeRepository.search(search).stream()
                .map(EmployeeDto.Response::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public EmployeeDto.Response create(EmployeeDto.Request req) {
        Employee e = new Employee();
        e.setName(req.name);
        e.setRole(req.role != null && !req.role.isBlank() ? req.role : "Nhân viên bán hàng");
        e.setPhone(req.phone);
        e.setEmail(req.email);
        return EmployeeDto.Response.from(employeeRepository.save(e));
    }

    @Transactional
    public EmployeeDto.Response update(Long id, EmployeeDto.Request req) {
        Employee e = employeeRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy nhân viên"));
        e.setName(req.name);
        e.setRole(req.role != null && !req.role.isBlank() ? req.role : e.getRole());
        e.setPhone(req.phone);
        e.setEmail(req.email);
        return EmployeeDto.Response.from(employeeRepository.save(e));
    }

    @Transactional
    public void delete(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new NotFoundException("Không tìm thấy nhân viên");
        }
        employeeRepository.deleteById(id);
    }
}
