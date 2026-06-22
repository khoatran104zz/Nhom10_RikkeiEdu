'use client';

import React, { useState } from 'react';
import { Percent, DollarSign, FileText, CheckCircle, Search } from 'lucide-react';
import { PageHeader, Table, StatCard, toast } from '@/components/base';
import { formatCurrency } from '@/utils/format';

interface TaxInvoice {
  id: number;
  code: string;
  date: string;
  customer: string;
  amount: number;
  vatRate: number;
  vatAmount: number;
  status: 'Đã kê khai' | 'Chờ kê khai';
}

export default function TaxDashboard() {
  const [taxRate, setTaxRate] = useState('10');
  const [taxYear, setTaxYear] = useState('2026');
  const [search, setSearch] = useState('');

  const taxInvoices: TaxInvoice[] = [
    { id: 1, code: 'HD00192', date: '2026-06-18', customer: 'Nguyễn Văn A', amount: 15000000, vatRate: 10, vatAmount: 1500000, status: 'Đã kê khai' },
    { id: 2, code: 'HD00193', date: '2026-06-19', customer: 'Công ty TNHH Hoàng Phát', amount: 45000000, vatRate: 10, vatAmount: 4500000, status: 'Đã kê khai' },
    { id: 3, code: 'HD00194', date: '2026-06-20', customer: 'Trần Thị B', amount: 8500000, vatRate: 8, vatAmount: 680000, status: 'Chờ kê khai' },
    { id: 4, code: 'HD00195', date: '2026-06-20', customer: 'Lê Văn C', amount: 12000000, vatRate: 10, vatAmount: 1200000, status: 'Đã kê khai' },
    { id: 5, code: 'HD00196', date: '2026-06-20', customer: 'Cửa hàng Bách Hóa Xanh', amount: 32000000, vatRate: 8, vatAmount: 2560000, status: 'Chờ kê khai' },
  ];

  const filteredInvoices = taxInvoices.filter(
    (inv) =>
      inv.code.toLowerCase().includes(search.toLowerCase()) ||
      inv.customer.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveTaxConfig = (e: React.FormEvent) => {
    e.preventDefault();
    toast(`Đã cập nhật cấu hình thuế suất mặc định thành ${taxRate}%`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Thuế & Kế toán"
        subtitle="Quản lý thuế giá trị gia tăng, hóa đơn VAT và báo cáo tài chính cửa hàng"
        breadcrumb={['Tài chính', 'Thuế & Kế toán']}
      />

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Doanh thu tính thuế"
          value={formatCurrency(112500000)}
          icon={DollarSign}
          gradient="blue"
        />
        <StatCard
          title="Thuế VAT đầu ra (Đã bán)"
          value={formatCurrency(10440000)}
          icon={Percent}
          gradient="green"
        />
        <StatCard
          title="Thuế VAT đầu vào (Khấu trừ)"
          value={formatCurrency(4200000)}
          icon={FileText}
          gradient="purple"
        />
        <StatCard
          title="Thuế VAT phải nộp ròng"
          value={formatCurrency(6240000)}
          icon={CheckCircle}
          gradient="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Invoice table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 border-b border-gray-100 dark:border-gray-800 pb-4">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base">Hóa đơn VAT phát sinh</h3>
                <p className="text-xs text-gray-500">Danh sách các hóa đơn bán hàng chịu thuế trong kỳ</p>
              </div>

              {/* Search Invoice */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  className="input pl-9 py-1.5 text-xs w-48"
                  placeholder="Mã HĐ hoặc khách hàng..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <Table headers={['Mã hóa đơn', 'Ngày', 'Khách hàng', 'Giá trị trước thuế', 'Mức thuế', 'Tiền thuế VAT', 'Trạng thái']}>
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-xs text-gray-400">
                    Không tìm thấy hóa đơn nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="table-row">
                    <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white text-xs">{inv.code}</td>
                    <td className="px-4 py-3 text-right text-xs text-gray-500">{inv.date}</td>
                    <td className="px-4 py-3 text-right text-xs text-gray-700 dark:text-gray-300 font-medium">{inv.customer}</td>
                    <td className="px-4 py-3 text-right text-xs font-semibold text-gray-900 dark:text-white">{formatCurrency(inv.amount)}</td>
                    <td className="px-4 py-3 text-right text-xs text-gray-500 font-mono">{inv.vatRate}%</td>
                    <td className="px-4 py-3 text-right text-xs font-bold text-primary-600 dark:text-primary-400">{formatCurrency(inv.vatAmount)}</td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`badge ${
                          inv.status === 'Đã kê khai' ? 'badge-green' : 'badge-yellow'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </Table>
          </div>
        </div>

        {/* Right Side: Config tax & Reports */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-bold text-gray-900 dark:text-white text-base mb-4 flex items-center gap-2">
              <Percent size={18} className="text-primary-600 dark:text-primary-400" />
              Thiết lập Thuế suất
            </h3>

            <form onSubmit={handleSaveTaxConfig} className="space-y-4">
              <div>
                <label className="label text-xs">Thuế suất VAT mặc định</label>
                <select
                  className="input text-sm"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                >
                  <option value="0">0% (Miễn thuế)</option>
                  <option value="5">5% (Thuế suất ưu đãi)</option>
                  <option value="8">8% (Thuế suất giảm theo NQ)</option>
                  <option value="10">10% (Thuế suất chuẩn)</option>
                </select>
                <p className="text-[10px] text-gray-400 mt-1">
                  Thuế suất này được áp dụng tự động cho các sản phẩm chưa thiết lập mức thuế riêng biệt.
                </p>
              </div>

              <div>
                <label className="label text-xs">Kỳ tính thuế hiện tại</label>
                <select
                  className="input text-sm"
                  value={taxYear}
                  onChange={(e) => setTaxYear(e.target.value)}
                >
                  <option value="2025">Năm 2025</option>
                  <option value="2026">Năm 2026</option>
                </select>
              </div>

              <button type="submit" className="w-full btn btn-primary py-2.5 font-bold text-xs cursor-pointer">
                Cập nhật cấu hình
              </button>
            </form>
          </div>

          <div className="card p-6 bg-gradient-to-br from-primary-50 to-emerald-50 dark:from-gray-900/40 dark:to-emerald-950/10 border border-primary-100 dark:border-primary-900/30">
            <h4 className="font-bold text-primary-800 dark:text-primary-400 text-sm mb-2">Tải Báo cáo Thuế</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
              Kết xuất biểu mẫu báo cáo thuế VAT đầu ra, VAT đầu vào theo Tờ khai 01/GTGT phục vụ quyết toán thuế.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => toast('Đã tải tờ khai thuế VAT')}
                className="btn btn-primary text-xs flex-1 justify-center py-2 cursor-pointer"
              >
                Xuất file Excel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
