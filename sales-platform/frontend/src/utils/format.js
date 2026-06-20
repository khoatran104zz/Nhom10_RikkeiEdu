// utils/format.js - Tiện ích định dạng
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
};

export const formatNumber = (num) => {
  return new Intl.NumberFormat('vi-VN').format(num || 0);
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const getStatusLabel = (status) => {
  const map = {
    completed: 'Hoàn thành',
    pending: 'Chờ xử lý',
    cancelled: 'Đã hủy',
    processing: 'Đang xử lý',
  };
  return map[status] || status;
};

export const getStatusClass = (status) => {
  const map = {
    completed: 'badge-green',
    pending: 'badge-yellow',
    cancelled: 'badge-red',
    processing: 'badge-blue',
  };
  return map[status] || 'badge-blue';
};
