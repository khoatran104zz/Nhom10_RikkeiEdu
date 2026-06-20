package com.company.sales_management.controller;

import com.company.sales_management.dto.StockDto;
import com.company.sales_management.service.StockService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock")
public class StockController {

    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @GetMapping
    public List<StockDto.StockItemResponse> getAll() {
        return stockService.getAll();
    }

    @GetMapping("/history")
    public List<StockDto.MovementResponse> getHistory(@RequestParam(required = false) String type) {
        return stockService.getHistory(type);
    }

    @PostMapping("/import")
    public StockDto.MovementResult importStock(@Valid @RequestBody StockDto.ImportRequest req) {
        return stockService.importStock(req);
    }

    @PostMapping("/export")
    public StockDto.MovementResult exportStock(@Valid @RequestBody StockDto.ExportRequest req) {
        return stockService.exportStock(req);
    }
}
