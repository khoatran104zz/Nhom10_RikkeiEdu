package com.company.sales_management.service;

import com.company.sales_management.dto.CustomerDto;
import com.company.sales_management.entity.Customer;
import com.company.sales_management.exception.NotFoundException;
import com.company.sales_management.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Transactional(readOnly = true)
    public List<CustomerDto.Response> getAll(String search) {
        return customerRepository.search(search).stream()
                .map(CustomerDto.Response::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public CustomerDto.Response create(CustomerDto.Request req) {
        Customer c = new Customer();
        c.setName(req.name);
        c.setPhone(req.phone);
        c.setEmail(req.email);
        c.setAddress(req.address);
        c.setPoints(0);
        Customer saved = customerRepository.save(c);
        saved.setCode(generateCode(saved.getId()));
        return CustomerDto.Response.from(customerRepository.save(saved));
    }

    @Transactional
    public CustomerDto.Response update(Long id, CustomerDto.Request req) {
        Customer c = customerRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy khách hàng"));
        c.setName(req.name);
        c.setPhone(req.phone);
        c.setEmail(req.email);
        c.setAddress(req.address);
        return CustomerDto.Response.from(customerRepository.save(c));
    }

    @Transactional
    public void delete(Long id) {
        if (!customerRepository.existsById(id)) {
            throw new NotFoundException("Không tìm thấy khách hàng");
        }
        customerRepository.deleteById(id);
    }

    private String generateCode(Long id) {
        return "KH" + String.format("%05d", id);
    }
}
