package com.company.sales_management.service;

import com.company.sales_management.dto.SupplierDto;
import com.company.sales_management.entity.Supplier;
import com.company.sales_management.exception.NotFoundException;
import com.company.sales_management.repository.SupplierRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    @Transactional(readOnly = true)
    public List<SupplierDto.Response> getAll(String search) {
        return supplierRepository.search(search).stream()
                .map(SupplierDto.Response::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public SupplierDto.Response create(SupplierDto.Request req) {
        Supplier s = new Supplier();
        s.setName(req.name);
        s.setPhone(req.phone);
        s.setEmail(req.email);
        s.setAddress(req.address);
        return SupplierDto.Response.from(supplierRepository.save(s));
    }

    @Transactional
    public SupplierDto.Response update(Long id, SupplierDto.Request req) {
        Supplier s = supplierRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy nhà cung cấp"));
        s.setName(req.name);
        s.setPhone(req.phone);
        s.setEmail(req.email);
        s.setAddress(req.address);
        return SupplierDto.Response.from(supplierRepository.save(s));
    }

    @Transactional
    public void delete(Long id) {
        if (!supplierRepository.existsById(id)) {
            throw new NotFoundException("Không tìm thấy nhà cung cấp");
        }
        supplierRepository.deleteById(id);
    }
}
