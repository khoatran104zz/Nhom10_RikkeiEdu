package com.company.sales_management.service;

import com.company.sales_management.dto.StockDto;
import com.company.sales_management.entity.Product;
import com.company.sales_management.entity.StockMovement;
import com.company.sales_management.entity.Supplier;
import com.company.sales_management.exception.BusinessException;
import com.company.sales_management.exception.NotFoundException;
import com.company.sales_management.repository.ProductRepository;
import com.company.sales_management.repository.StockMovementRepository;
import com.company.sales_management.repository.SupplierRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StockService {

    private final ProductRepository productRepository;
    private final StockMovementRepository stockMovementRepository;
    private final SupplierRepository supplierRepository;

    public StockService(ProductRepository productRepository,
                         StockMovementRepository stockMovementRepository,
                         SupplierRepository supplierRepository) {
        this.productRepository = productRepository;
        this.stockMovementRepository = stockMovementRepository;
        this.supplierRepository = supplierRepository;
    }

    @Transactional(readOnly = true)
    public List<StockDto.StockItemResponse> getAll() {
        return productRepository.findAllByOrderByIdDesc().stream()
                .map(StockDto.StockItemResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StockDto.MovementResponse> getHistory(String type) {
        List<StockMovement> movements = (type == null || type.isBlank())
                ? stockMovementRepository.findAllByOrderByIdDesc()
                : stockMovementRepository.findByTypeOrderByIdDesc(type);
        return movements.stream().map(StockDto.MovementResponse::from).collect(Collectors.toList());
    }

    @Transactional
    public StockDto.MovementResult importStock(StockDto.ImportRequest req) {
        Product product = productRepository.findById(req.productId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy sản phẩm"));

        product.setStock(product.getStock() + req.quantity);
        productRepository.save(product);

        StockMovement movement = new StockMovement();
        movement.setProduct(product);
        movement.setType("import");
        movement.setQuantity(req.quantity);
        movement.setNote(req.note);
        if (req.supplierId != null) {
            Supplier supplier = supplierRepository.findById(req.supplierId)
                    .orElseThrow(() -> new NotFoundException("Không tìm thấy nhà cung cấp"));
            movement.setSupplier(supplier);
        }
        StockMovement saved = stockMovementRepository.save(movement);

        return new StockDto.MovementResult(saved.getId(), product.getStock());
    }

    @Transactional
    public StockDto.MovementResult exportStock(StockDto.ExportRequest req) {
        Product product = productRepository.findById(req.productId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy sản phẩm"));

        if (product.getStock() < req.quantity) {
            throw new BusinessException("Không đủ tồn kho để xuất");
        }

        product.setStock(product.getStock() - req.quantity);
        productRepository.save(product);

        StockMovement movement = new StockMovement();
        movement.setProduct(product);
        movement.setType("export");
        movement.setQuantity(req.quantity);
        movement.setNote(req.note);
        StockMovement saved = stockMovementRepository.save(movement);

        return new StockDto.MovementResult(saved.getId(), product.getStock());
    }
}
