// pages/Orders.jsx - Quản lý đơn bán hàng
import { useState, useEffect, useCallback } from 'react';
import { ShoppingCart, Eye, ChevronDown } from 'lucide-react';
import { ordersApi } from '../services/api';
import { formatCurrency, formatDateTime, getStatusLabel, getStatusClass } from '../utils/format';
import { PageHeader, SearchBar, Table, Pagination, Modal, Loading, EmptyState, toast } from '../components/shared';

function OrderDetail({ order, onClose, onStatusChange }) {
  const [status, setStatus] = useState(order.status);
  const [saving, setSaving] = useState(false);

  const updateStatus = async (newStatus) => {
    setSaving(true);
    try {
      await ordersApi.updateStatus(order.id, newStatus);
      setStatus(newStatus);
      onStatusChange();
      toast('Đã cập nhật trạng thái đơn hàng');
    } catch (e) { toast(e.message, 'error'); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-5">
      {/* Header info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Mã đơn hàng</p>
          <p className="font-bold text-gray-900 dark:text-white text-lg">{order.code}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Ngày tạo</p>
          <p className="font-medium text-gray-900 dark:text-white">{formatDateTime(order.createdAt)}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Khách hàng</p>
          <p className="font-medium text-gray-900 dark:text-white">{order.customerName}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Nhân viên</p>
          <p className="font-medium text-gray-900 dark:text-white">{order.employeeName || '—'}</p>
        </div>
      </div>

      {/* Products */}
      <div>
        <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">Sản phẩm</h3>
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          {order.items.map((item, i) => (
            <div key={i} className={`flex items-center justify-between px-4 py-3 ${i > 0 ? 'border-t border-gray-100 dark:border-gray-800' : ''}`}>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{item.productName}</p>
                <p className="text-xs text-gray-500">x{item.quantity} × {formatCurrency(item.price)}</p>
              </div>
              <span className="text-sm font-semibold">{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Total */}
      <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Tạm tính</span>
          <span>{formatCurrency(order.items.reduce((s, i) => s + i.price * i.quantity, 0))}</span>
        </div>
        {order.discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Giảm giá</span>
            <span className="text-green-600">-{formatCurrency(order.discount)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-base pt-2 border-t border-primary-200 dark:border-primary-800">
          <span>Tổng cộng</span>
          <span className="text-primary-600">{formatCurrency(order.total)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Phương thức TT</span>
          <span>{order.paymentMethod === 'cash' ? 'Tiền mặt' : 'Chuyển khoản'}</span>
        </div>
      </div>

      {/* Status update */}
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cập nhật trạng thái</p>
        <div className="flex gap-2 flex-wrap">
          {['pending', 'processing', 'completed', 'cancelled'].map(s => (
            <button key={s} onClick={() => updateStatus(s)} disabled={saving || status === s}
              className={`btn text-xs ${status === s ? 'btn-primary' : 'btn-secondary'}`}>
              {getStatusLabel(s)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button className="btn btn-secondary text-sm" onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await ordersApi.getAll({ search, status: statusFilter, page, limit: 10 });
      setOrders(res.data);
      setTotalPages(res.totalPages);
      setTotal(res.total);
    } finally { setLoading(false); }
  }, [search, statusFilter, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [search, statusFilter]);

  const viewOrder = async (order) => {
    try {
      const detail = await ordersApi.getById(order.id);
      setSelectedOrder(detail);
    } catch (e) { toast(e.message, 'error'); }
  };

  return (
    <div>
      <PageHeader
        title="Đơn bán hàng"
        subtitle={`${total} đơn hàng`}
        actions={
          <div className="flex items-center gap-2">
            <SearchBar value={search} onChange={setSearch} placeholder="Tìm mã đơn, khách hàng..." />
            <div className="relative">
              <select
                className="input pr-8 appearance-none cursor-pointer"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="pending">Chờ xử lý</option>
                <option value="processing">Đang xử lý</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        }
      />

      <div className="card">
        {loading ? <Loading /> : (
          <>
            <Table headers={['Mã đơn', 'Khách hàng', 'Nhân viên', 'Ngày tạo', 'Tổng tiền', 'Trạng thái', 'Chi tiết']}>
              {orders.length === 0 ? (
                <tr><td colSpan={7}><EmptyState message="Không có đơn hàng nào" icon={ShoppingCart} /></td></tr>
              ) : orders.map(order => (
                <tr key={order.id} className="table-row">
                  <td className="px-4 py-3">
                    <span className="font-mono font-semibold text-sm text-primary-600 dark:text-primary-400">{order.code}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm">{order.customerName}</td>
                  <td className="px-4 py-3 text-right text-sm text-gray-500">{order.employeeName || '—'}</td>
                  <td className="px-4 py-3 text-right text-xs text-gray-500">{formatDateTime(order.createdAt)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-sm">{formatCurrency(order.total)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`badge ${getStatusClass(order.status)}`}>{getStatusLabel(order.status)}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => viewOrder(order)}
                      className="p-1.5 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 text-primary-600"
                    >
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </Table>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </div>

      <Modal open={!!selectedOrder} onClose={() => setSelectedOrder(null)} title={`Chi tiết đơn hàng ${selectedOrder?.code}`} size="lg">
        {selectedOrder && (
          <OrderDetail
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onStatusChange={load}
          />
        )}
      </Modal>
    </div>
  );
}
