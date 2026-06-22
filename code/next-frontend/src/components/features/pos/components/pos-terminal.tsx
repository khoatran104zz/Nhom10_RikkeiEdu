'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Minus, Trash2, ShoppingCart, User, CreditCard, Printer, Package } from 'lucide-react';
import { productService, customerService, orderService } from '@/services';
import { formatCurrency } from '@/utils/format';
import { toast } from '@/components/base';
import { Product, Customer, Order, OrderItem } from '@/types';

// Invoice Modal for Printing
interface InvoiceModalProps {
  order: Order & { customerName?: string };
  onClose: () => void;
}

function InvoiceModal({ order, onClose }: InvoiceModalProps) {
  const now = new Date().toLocaleString('vi-VN');
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 font-mono text-sm text-gray-800">
        <div className="text-center mb-4">
          <h2 className="text-lg font-bold">eManage Store</h2>
          <p className="text-xs text-gray-500">123 Nguyễn Huệ, Q.1, TP.HCM</p>
          <p className="text-xs text-gray-500">ĐT: 028 1234 5678</p>
          <div className="border-t border-dashed border-gray-300 my-3" />
          <h3 className="font-bold">HÓA ĐƠN BÁN HÀNG</h3>
          <p className="text-xs">{order.code} | {now}</p>
        </div>
        {order.customerName && order.customerName !== 'Khách lẻ' && (
          <p className="text-xs mb-2">KH: {order.customerName}</p>
        )}
        <div className="border-t border-dashed border-gray-300 my-2" />
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between text-xs mb-1">
            <div>
              <p className="font-medium">{item.productName}</p>
              <p className="text-gray-500">{item.quantity} x {formatCurrency(item.price)}</p>
            </div>
            <span>{formatCurrency(item.price * item.quantity)}</span>
          </div>
        ))}
        <div className="border-t border-dashed border-gray-300 my-2" />
        {order.discount > 0 && (
          <div className="flex justify-between text-xs">
            <span>Giảm giá:</span>
            <span className="text-green-600">-{formatCurrency(order.discount)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold mt-1">
          <span>TỔNG CỘNG:</span>
          <span>{formatCurrency(order.total)}</span>
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span>Thanh toán:</span>
          <span>{order.paymentMethod === 'cash' ? 'Tiền mặt' : 'Chuyển khoản'}</span>
        </div>
        <div className="border-t border-dashed border-gray-300 my-3" />
        <p className="text-center text-xs text-gray-500">Cảm ơn quý khách! Hẹn gặp lại.</p>
        <div className="mt-4 flex gap-2">
          <button onClick={() => typeof window !== 'undefined' && window.print()} className="btn btn-secondary flex-1 text-xs">
            <Printer size={14} /> In hóa đơn
          </button>
          <button onClick={onClose} className="btn btn-primary flex-1 text-xs">Đóng</button>
        </div>
      </div>
    </div>
  );
}

export default function POSTerminal() {
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomers, setShowCustomers] = useState(false);
  const [discount, setDiscount] = useState<string | number>(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [processing, setProcessing] = useState(false);
  const [successOrder, setSuccessOrder] = useState<(Order & { customerName?: string }) | null>(null);

  const loadProducts = useCallback(async () => {
    try {
      const res = await productService.getAll({ search, limit: 20, page: 1 });
      setProducts(res.data);
    } catch (e: unknown) {
      toast((e as Error).message, 'error');
    }
  }, [search]);

  const loadCustomers = useCallback(async () => {
    try {
      const data = await customerService.getAll(customerSearch);
      setCustomers(data);
    } catch (e: unknown) {
      toast((e as Error).message, 'error');
    }
  }, [customerSearch]);

  useEffect(() => { 
    loadProducts(); 
  }, [loadProducts]);
  
  useEffect(() => { 
    if (showCustomers) loadCustomers(); 
  }, [loadCustomers, showCustomers]);

  // Add product to cart
  const addToCart = (product: Product) => {
    if (product.stock <= 0) return toast('Sản phẩm đã hết hàng', 'error');
    setCart(prev => {
      const existing = prev.find(i => i.productId === product.id);
      if (existing) {
        const currentStock = existing.maxStock || product.stock;
        if (existing.quantity >= currentStock) {
          toast('Không đủ tồn kho', 'error');
          return prev;
        }
        return prev.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, {
        productId: product.id, 
        productName: product.name,
        price: product.salePrice, 
        quantity: 1, 
        maxStock: product.stock
      }];
    });
  };

  const updateQty = (productId: number, delta: number) => {
    setCart(prev => prev
      .map(i => {
        if (i.productId === productId) {
          const limit = i.maxStock || 9999;
          const nextQty = Math.max(1, Math.min(i.quantity + delta, limit));
          if (delta > 0 && i.quantity >= limit) {
            toast('Không đủ tồn kho', 'error');
          }
          return { ...i, quantity: nextQty };
        }
        return i;
      })
    );
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(i => i.productId !== productId));
  };

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const total = Math.max(0, subtotal - Number(discount));

  const handleCheckout = async () => {
    if (!cart.length) return toast('Giỏ hàng trống', 'error');
    setProcessing(true);
    try {
      const order = await orderService.create({
        customerId: selectedCustomer?.id || null,
        employeeId: 'emp2', // Default mapped employee in Vite
        items: cart, 
        discount: Number(discount),
        paymentMethod, 
        note: ''
      });
      setSuccessOrder({ ...order, customerName: selectedCustomer?.name || 'Khách lẻ' });
      setCart([]);
      setSelectedCustomer(null);
      setDiscount(0);
      loadProducts();
      toast('Thanh toán thành công!');
    } catch (e: unknown) { 
      toast((e as Error).message, 'error'); 
    } finally { 
      setProcessing(false); 
    }
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) || c.phone.includes(customerSearch)
  );

  return (
    <div className="flex h-[calc(100vh-120px)] gap-4">
      {/* Left: Products */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="mb-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="input pl-9 w-full"
              placeholder="Tìm sản phẩm theo tên hoặc SKU..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 content-start">
          {products.map(p => (
            <button
              key={p.id}
              onClick={() => addToCart(p)}
              disabled={p.stock <= 0}
              className={`card p-3 text-left transition-all hover:border-primary-400 hover:shadow-card-hover active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 mb-2 relative">
                {p.image ? (
                  <img 
                    src={p.image} 
                    alt={p.name} 
                    className="w-full h-full object-cover" 
                    onError={e => { (e.target as HTMLElement).style.display = 'none'; }} 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={24} className="text-gray-400" />
                  </div>
                )}
              </div>
              <p className="text-xs font-medium text-gray-900 dark:text-white leading-tight line-clamp-2">{p.name}</p>
              <p className="text-xs font-bold text-primary-600 mt-1">{formatCurrency(p.salePrice)}</p>
              <p className={`text-xs mt-0.5 ${p.stock <= 0 ? 'text-red-500' : 'text-gray-500'}`}>
                {p.stock <= 0 ? 'Hết hàng' : `Còn: ${p.stock}`}
              </p>
            </button>
          ))}
          {products.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-400">
              <Package size={40} className="mb-2 opacity-40" />
              <p className="text-sm">Không tìm thấy sản phẩm</p>
            </div>
          )}
        </div>
      </div>

      {/* Right: Cart */}
      <div className="w-80 flex flex-col gap-3 shrink-0">
        {/* Customer selection */}
        <div className="card p-3 relative">
          <div className="flex items-center gap-2 mb-2">
            <User size={14} className="text-gray-500" />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Khách hàng</span>
          </div>
          {selectedCustomer ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedCustomer.name}</p>
                <p className="text-xs text-gray-500">{selectedCustomer.phone}</p>
              </div>
              <button 
                onClick={() => setSelectedCustomer(null)} 
                className="text-xs text-red-500 hover:underline"
              >
                Xóa
              </button>
            </div>
          ) : (
            <div>
              <input
                className="input text-sm"
                placeholder="Tìm khách hàng..."
                value={customerSearch}
                onChange={e => { setCustomerSearch(e.target.value); setShowCustomers(true); }}
                onFocus={() => setShowCustomers(true)}
              />
              {showCustomers && filteredCustomers.length > 0 && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowCustomers(false)} />
                  <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-20 max-h-40 overflow-y-auto mt-1">
                    {filteredCustomers.slice(0, 5).map(c => (
                      <button 
                        key={c.id}
                        onClick={() => { setSelectedCustomer(c); setShowCustomers(false); setCustomerSearch(''); }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-800 flex justify-between cursor-pointer"
                      >
                        <span className="text-gray-900 dark:text-white">{c.name}</span>
                        <span className="text-gray-500 text-xs">{c.phone}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Cart Items */}
        <div className="card flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 dark:border-gray-800">
            <ShoppingCart size={14} className="text-gray-500" />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Giỏ hàng ({cart.length})</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                <ShoppingCart size={28} className="mb-2 opacity-40" />
                <p className="text-xs">Chưa có sản phẩm</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.productId} className="px-3 py-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-medium text-gray-900 dark:text-white flex-1 leading-tight">{item.productName}</p>
                    <button 
                      onClick={() => removeFromCart(item.productId)} 
                      className="text-red-400 hover:text-red-600 shrink-0"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => updateQty(item.productId, -1)}
                        className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="text-xs font-bold w-6 text-center text-gray-900 dark:text-white">{item.quantity}</span>
                      <button 
                        onClick={() => updateQty(item.productId, 1)}
                        className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                    <span className="text-xs font-bold text-primary-600">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Payment and checkout */}
        <div className="card p-3 space-y-3">
          {/* Discount */}
          <div>
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">Giảm giá (VND)</label>
            <input
              type="number" 
              className="input text-sm" 
              min="0"
              value={discount} 
              onChange={e => setDiscount(e.target.value)}
              placeholder="0"
            />
          </div>

          {/* Payment method */}
          <div>
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">Phương thức thanh toán</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                ['cash', 'Tiền mặt'], 
                ['transfer', 'Chuyển khoản']
              ].map(([v, l]) => (
                <button 
                  key={v}
                  onClick={() => setPaymentMethod(v)}
                  className={`text-xs py-2 rounded-lg border font-medium transition-all cursor-pointer ${
                    paymentMethod === v 
                      ? 'bg-primary-500 text-white border-primary-500' 
                      : 'border-gray-300 dark:border-gray-700 hover:border-primary-400 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="border-t border-gray-100 dark:border-gray-800 pt-2 space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Tạm tính</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {Number(discount) > 0 && (
              <div className="flex justify-between text-xs text-green-600">
                <span>Giảm giá</span>
                <span>-{formatCurrency(Number(discount))}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-sm pt-1">
              <span className="text-gray-950 dark:text-white">Tổng cộng</span>
              <span className="text-primary-600">{formatCurrency(total)}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={!cart.length || processing}
            className="btn btn-primary w-full justify-center py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CreditCard size={16} />
            {processing ? 'Đang xử lý...' : 'Thanh toán'}
          </button>
        </div>
      </div>

      {/* Invoice modal */}
      {successOrder && (
        <InvoiceModal order={successOrder} onClose={() => setSuccessOrder(null)} />
      )}
    </div>
  );
}
