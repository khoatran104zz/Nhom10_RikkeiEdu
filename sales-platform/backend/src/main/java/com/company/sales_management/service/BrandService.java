package com.company.sales_management.service;

import com.company.sales_management.dto.BrandDto;
import com.company.sales_management.entity.Brand;
import com.company.sales_management.exception.NotFoundException;
import com.company.sales_management.repository.BrandRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BrandService {

    private final BrandRepository brandRepository;

    public BrandService(BrandRepository brandRepository) {
        this.brandRepository = brandRepository;
    }

    @Transactional(readOnly = true)
    public List<BrandDto.Response> getAll(String search) {
        List<Brand> brands = (search == null || search.isBlank())
                ? brandRepository.findAll()
                : brandRepository.findByNameContainingIgnoreCaseOrderByIdDesc(search);
        return brands.stream().map(BrandDto.Response::from).collect(Collectors.toList());
    }

    @Transactional
    public BrandDto.Response create(BrandDto.Request req) {
        Brand b = new Brand();
        b.setName(req.name);
        b.setDescription(req.description);
        return BrandDto.Response.from(brandRepository.save(b));
    }

    @Transactional
    public BrandDto.Response update(Long id, BrandDto.Request req) {
        Brand b = brandRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy thương hiệu"));
        b.setName(req.name);
        b.setDescription(req.description);
        return BrandDto.Response.from(brandRepository.save(b));
    }

    @Transactional
    public void delete(Long id) {
        if (!brandRepository.existsById(id)) {
            throw new NotFoundException("Không tìm thấy thương hiệu");
        }
        brandRepository.deleteById(id);
    }
}
