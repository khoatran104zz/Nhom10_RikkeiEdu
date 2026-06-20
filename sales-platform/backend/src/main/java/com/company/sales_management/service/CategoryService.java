package com.company.sales_management.service;

import com.company.sales_management.dto.CategoryDto;
import com.company.sales_management.entity.Category;
import com.company.sales_management.exception.NotFoundException;
import com.company.sales_management.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryDto.Response> getAll(String search) {
        List<Category> categories = (search == null || search.isBlank())
                ? categoryRepository.findAll()
                : categoryRepository.findByNameContainingIgnoreCaseOrderByIdDesc(search);
        return categories.stream().map(CategoryDto.Response::from).collect(Collectors.toList());
    }

    @Transactional
    public CategoryDto.Response create(CategoryDto.Request req) {
        Category c = new Category();
        c.setName(req.name);
        c.setDescription(req.description);
        return CategoryDto.Response.from(categoryRepository.save(c));
    }

    @Transactional
    public CategoryDto.Response update(Long id, CategoryDto.Request req) {
        Category c = categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy danh mục"));
        c.setName(req.name);
        c.setDescription(req.description);
        return CategoryDto.Response.from(categoryRepository.save(c));
    }

    @Transactional
    public void delete(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new NotFoundException("Không tìm thấy danh mục");
        }
        categoryRepository.deleteById(id);
    }
}
