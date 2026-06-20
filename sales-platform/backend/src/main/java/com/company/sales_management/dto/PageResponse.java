package com.company.sales_management.dto;

import java.util.List;

/** Khớp với contract mà frontend mong đợi: { data, total, totalPages } */
public class PageResponse<T> {
    public List<T> data;
    public long total;
    public int totalPages;

    public PageResponse(List<T> data, long total, int totalPages) {
        this.data = data;
        this.total = total;
        this.totalPages = totalPages;
    }
}
