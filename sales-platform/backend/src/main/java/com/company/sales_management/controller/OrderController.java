package com.company.sales_management.controller;

import com.company.sales_management.dto.OrderDto;
import com.company.sales_management.dto.PageResponse;
import com.company.sales_management.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public PageResponse<OrderDto.SummaryResponse> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        return orderService.getAll(search, status, page, limit);
    }

    @GetMapping("/{id}")
    public OrderDto.Response getById(@PathVariable Long id) {
        return orderService.getById(id);
    }

    @PostMapping
    public OrderDto.Response create(@Valid @RequestBody OrderDto.CreateRequest req) {
        return orderService.create(req);
    }

    /** FE gọi PUT /orders/{id} với body {status} để cập nhật trạng thái đơn hàng */
    @PutMapping("/{id}")
    public OrderDto.Response updateStatus(@PathVariable Long id, @RequestBody OrderDto.UpdateStatusRequest req) {
        return orderService.updateStatus(id, req.status);
    }
}
