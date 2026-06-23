package com.company.sales_management.service.impl;

import com.company.sales_management.dto.request.CustomerRequest;
import com.company.sales_management.dto.response.CustomerResponse;
import com.company.sales_management.entity.Customer;
import com.company.sales_management.entity.Shop;
import com.company.sales_management.exception.BadRequestException;
import com.company.sales_management.exception.ResourceNotFoundException;
import com.company.sales_management.repository.CustomerRepository;
import com.company.sales_management.service.CustomerService;
import com.company.sales_management.service.TenantScopeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private TenantScopeService tenantScopeService;

    @Override
    public Page<CustomerResponse> findAll(String search, Pageable pageable) {
        return customerRepository.findBySearchTerm(tenantScopeService.requiredShopId(), search, pageable).map(this::toResponse);
    }

    @Override
    public CustomerResponse findById(Integer id) {
        Customer customer = customerRepository.findByIdAndShopId(id, tenantScopeService.requiredShopId())
                .orElseThrow(() -> new ResourceNotFoundException("Khách hàng", "id", id));
        return toResponse(customer);
    }

    @Override
    public CustomerResponse create(CustomerRequest request) {
        Shop shop = tenantScopeService.currentShop();
        if (customerRepository.existsByShopIdAndPhone(shop.getId(), request.getPhone())) {
            throw new BadRequestException("Số điện thoại khách hàng đã tồn tại trong shop: " + request.getPhone());
        }
        Customer customer = new Customer();
        customer.setCode("KH" + System.currentTimeMillis());
        customer.setShop(shop);
        customer.setName(request.getName());
        customer.setPhone(request.getPhone());
        customer.setEmail(request.getEmail());
        customer.setAddress(request.getAddress());
        customer.setPoints(0);
        return toResponse(customerRepository.save(customer));
    }

    @Override
    public CustomerResponse update(Integer id, CustomerRequest request) {
        Integer shopId = tenantScopeService.requiredShopId();
        Customer customer = customerRepository.findByIdAndShopId(id, shopId)
                .orElseThrow(() -> new ResourceNotFoundException("Khách hàng", "id", id));
        if (!customer.getPhone().equals(request.getPhone()) && customerRepository.existsByShopIdAndPhoneAndIdNot(shopId, request.getPhone(), id)) {
            throw new BadRequestException("Số điện thoại khách hàng đã tồn tại trong shop: " + request.getPhone());
        }
        customer.setName(request.getName());
        customer.setPhone(request.getPhone());
        customer.setEmail(request.getEmail());
        customer.setAddress(request.getAddress());
        return toResponse(customerRepository.save(customer));
    }

    @Override
    public void delete(Integer id) {
        Customer customer = customerRepository.findByIdAndShopId(id, tenantScopeService.requiredShopId())
                .orElseThrow(() -> new ResourceNotFoundException("Khách hàng", "id", id));
        customerRepository.delete(customer);
    }

    private CustomerResponse toResponse(Customer customer) {
        CustomerResponse response = new CustomerResponse();
        response.setId(customer.getId());
        response.setCode(customer.getCode());
        response.setName(customer.getName());
        response.setPhone(customer.getPhone());
        response.setEmail(customer.getEmail());
        response.setAddress(customer.getAddress());
        response.setPoints(customer.getPoints());
        if (customer.getShop() != null) {
            response.setShopId(customer.getShop().getId());
            response.setShopName(customer.getShop().getName());
        }
        response.setCreatedAt(customer.getCreatedAt());
        response.setUpdatedAt(customer.getUpdatedAt());
        return response;
    }
}
