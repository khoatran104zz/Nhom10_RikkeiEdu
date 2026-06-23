package com.company.sales_management.service.impl;

import com.company.sales_management.dto.request.ProductRequest;
import com.company.sales_management.dto.response.ProductResponse;
import com.company.sales_management.entity.Brand;
import com.company.sales_management.entity.Category;
import com.company.sales_management.entity.Product;
import com.company.sales_management.entity.Shop;
import com.company.sales_management.exception.BadRequestException;
import com.company.sales_management.exception.ResourceNotFoundException;
import com.company.sales_management.repository.BrandRepository;
import com.company.sales_management.repository.CategoryRepository;
import com.company.sales_management.repository.ProductRepository;
import com.company.sales_management.service.ProductService;
import com.company.sales_management.service.TenantScopeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private TenantScopeService tenantScopeService;

    @Override
    public Page<ProductResponse> findAll(String search, Integer categoryId, Integer brandId, Boolean active, Pageable pageable) {
        return productRepository.findAllWithFilters(tenantScopeService.requiredShopId(), search, categoryId, brandId, active, pageable)
                .map(this::toResponse);
    }

    @Override
    public List<ProductResponse> findLowStock() {
        return productRepository.findLowStockProducts(tenantScopeService.requiredShopId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public ProductResponse findById(Integer id) {
        Product product = productRepository.findByIdAndShopId(id, tenantScopeService.requiredShopId())
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm", "id", id));
        return toResponse(product);
    }

    @Override
    public ProductResponse create(ProductRequest request) {
        Product product = new Product();
        mapRequestToEntity(request, product);
        return toResponse(productRepository.save(product));
    }

    @Override
    public ProductResponse update(Integer id, ProductRequest request) {
        Product product = productRepository.findByIdAndShopId(id, tenantScopeService.requiredShopId())
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm", "id", id));
        mapRequestToEntity(request, product);
        return toResponse(productRepository.save(product));
    }

    @Override
    public void delete(Integer id) {
        Product product = productRepository.findByIdAndShopId(id, tenantScopeService.requiredShopId())
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm", "id", id));
        product.setActive(false);
        productRepository.save(product);
    }

    private void mapRequestToEntity(ProductRequest request, Product product) {
        Shop shop = tenantScopeService.currentShop();
        if (product.getId() == null && productRepository.existsByShopIdAndSku(shop.getId(), request.getSku())) {
            throw new BadRequestException("SKU đã tồn tại trong shop: " + request.getSku());
        }
        if (product.getId() != null && productRepository.existsByShopIdAndSkuAndIdNot(shop.getId(), request.getSku(), product.getId())) {
            throw new BadRequestException("SKU đã tồn tại trong shop: " + request.getSku());
        }
        product.setShop(shop);
        product.setSku(request.getSku());
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setCostPrice(request.getCostPrice());
        product.setSalePrice(request.getSalePrice());
        product.setStock(request.getStock());
        product.setImage(request.getImage());
        if (product.getActive() == null) product.setActive(true);

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findByIdAndShopId(request.getCategoryId(), shop.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Danh mục", "id", request.getCategoryId()));
            product.setCategory(category);
        } else {
            product.setCategory(null);
        }

        if (request.getBrandId() != null) {
            Brand brand = brandRepository.findByIdAndShopId(request.getBrandId(), shop.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Thương hiệu", "id", request.getBrandId()));
            product.setBrand(brand);
        } else {
            product.setBrand(null);
        }
    }

    private ProductResponse toResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setSku(product.getSku());
        response.setName(product.getName());
        if (product.getShop() != null) {
            response.setShopId(product.getShop().getId());
            response.setShopName(product.getShop().getName());
        }
        response.setDescription(product.getDescription());
        response.setCostPrice(product.getCostPrice());
        response.setSalePrice(product.getSalePrice());
        response.setStock(product.getStock());
        response.setImage(product.getImage());
        response.setActive(product.getActive());
        if (product.getCategory() != null) {
            response.setCategoryId(product.getCategory().getId());
            response.setCategoryName(product.getCategory().getName());
        }
        if (product.getBrand() != null) {
            response.setBrandId(product.getBrand().getId());
            response.setBrandName(product.getBrand().getName());
        }
        response.setCreatedAt(product.getCreatedAt());
        response.setUpdatedAt(product.getUpdatedAt());
        return response;
    }
}
