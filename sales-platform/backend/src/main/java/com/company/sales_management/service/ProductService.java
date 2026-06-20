package com.company.sales_management.service;

import com.company.sales_management.dto.PageResponse;
import com.company.sales_management.dto.ProductDto;
import com.company.sales_management.entity.Brand;
import com.company.sales_management.entity.Category;
import com.company.sales_management.entity.Product;
import com.company.sales_management.exception.NotFoundException;
import com.company.sales_management.repository.BrandRepository;
import com.company.sales_management.repository.CategoryRepository;
import com.company.sales_management.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;

    public ProductService(ProductRepository productRepository,
                           CategoryRepository categoryRepository,
                           BrandRepository brandRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<ProductDto.Response> getAll(String search, int page, int limit) {
        int safePage = Math.max(page, 1);
        int safeLimit = limit <= 0 ? 10 : limit;
        Page<Product> result = productRepository.search(
                search, PageRequest.of(safePage - 1, safeLimit, Sort.by(Sort.Direction.DESC, "id")));

        List<ProductDto.Response> data = result.getContent().stream()
                .map(ProductDto.Response::from)
                .collect(Collectors.toList());

        return new PageResponse<>(data, result.getTotalElements(), result.getTotalPages() == 0 ? 1 : result.getTotalPages());
    }

    @Transactional(readOnly = true)
    public ProductDto.Response getById(Long id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy sản phẩm"));
        return ProductDto.Response.from(p);
    }

    @Transactional
    public ProductDto.Response create(ProductDto.Request req) {
        Product p = new Product();
        applyRequest(p, req);
        return ProductDto.Response.from(productRepository.save(p));
    }

    @Transactional
    public ProductDto.Response update(Long id, ProductDto.Request req) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy sản phẩm"));
        applyRequest(p, req);
        return ProductDto.Response.from(productRepository.save(p));
    }

    @Transactional
    public void delete(Long id) {
        if (!productRepository.existsById(id)) {
            throw new NotFoundException("Không tìm thấy sản phẩm");
        }
        productRepository.deleteById(id);
    }

    private void applyRequest(Product p, ProductDto.Request req) {
        p.setSku(req.sku);
        p.setName(req.name);
        p.setCostPrice(req.costPrice != null ? req.costPrice : BigDecimal.ZERO);
        p.setSalePrice(req.salePrice != null ? req.salePrice : BigDecimal.ZERO);
        p.setStock(req.stock != null ? req.stock : 0);
        p.setImage(req.image);
        p.setDescription(req.description);

        p.setCategory(parseRef(req.categoryId, categoryRepository::findById));
        p.setBrand(parseRef(req.brandId, brandRepository::findById));
    }

    /** Select của FE gửi categoryId/brandId dạng String, có thể null hoặc "" khi chưa chọn */
    private <T> T parseRef(String rawId, java.util.function.Function<Long, java.util.Optional<T>> finder) {
        if (rawId == null || rawId.isBlank()) return null;
        try {
            Long id = Long.parseLong(rawId.trim());
            return finder.apply(id).orElse(null);
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
