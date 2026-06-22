export const formatCurrency = (amount?: number | null): string => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
};

export const formatNumber = (num?: number | null): string => {
  return new Intl.NumberFormat('vi-VN').format(num || 0);
};

export const formatDate = (dateStr?: string | Date | null): string => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export const formatDateTime = (dateStr?: string | Date | null): string => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const getStatusLabel = (status: string): string => {
  const map: Record<string, string> = {
    completed: 'Hoàn thành',
    pending: 'Chờ xử lý',
    cancelled: 'Đã hủy',
    processing: 'Đang xử lý',
  };
  return map[status] || status;
};

export const getStatusClass = (status: string): string => {
  const map: Record<string, string> = {
    completed: 'badge-green',
    pending: 'badge-yellow',
    cancelled: 'badge-red',
    processing: 'badge-blue',
  };
  return map[status] || 'badge-blue';
};
