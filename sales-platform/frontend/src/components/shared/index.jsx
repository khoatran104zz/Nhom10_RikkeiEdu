// components/shared/index.jsx — eManage redesign
import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Loader2, AlertCircle, Search, CheckCircle2 } from 'lucide-react';

/* ── Modal ──────────────────────────────────────────── */
export function Modal({ open, onClose, title, children, size = 'md' }) {
  if (!open) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full ${sizes[size]} max-h-[92vh] flex flex-col animate-fadeIn`}>
        {/* Header stripe */}
        <div className="h-1 header-gradient rounded-t-2xl shrink-0" />
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-surface-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-700">
            <X size={17} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

/* ── Page Header ─────────────────────────────────────── */
export function PageHeader({ title, subtitle, actions, breadcrumb }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        {breadcrumb && (
          <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
            {breadcrumb.map((b, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight size={11} />}
                <span>{b}</span>
              </span>
            ))}
          </p>
        )}
        <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}

/* ── Search Bar ──────────────────────────────────────── */
export function SearchBar({ value, onChange, placeholder = 'Tìm kiếm...' }) {
  return (
    <div className="relative">
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        className="input pl-9 w-60 py-2 text-sm"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

/* ── Stat Card ───────────────────────────────────────── */
export function StatCard({ title, value, icon: Icon, gradient, change, suffix = '' }) {
  const gradients = {
    green:  'from-primary-500 to-primary-400',
    blue:   'from-blue-500 to-blue-400',
    purple: 'from-purple-500 to-purple-400',
    orange: 'from-orange-500 to-orange-400',
    teal:   'from-teal-500 to-teal-400',
    rose:   'from-rose-500 to-rose-400',
  };
  const g = gradients[gradient] || gradients.green;

  return (
    <div className="card card-hover p-5 relative overflow-hidden">
      {/* Top gradient bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${g}`} />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1.5 tracking-tight">
            {value}{suffix}
          </p>
          {change !== undefined && (
            <p className={`text-xs font-medium mt-1.5 flex items-center gap-1 ${change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              <span>{change >= 0 ? '▲' : '▼'}</span>
              <span>{Math.abs(change)}% so với tháng trước</span>
            </p>
          )}
        </div>
        <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${g} flex items-center justify-center shadow-lg`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
    </div>
  );
}

/* ── Table ───────────────────────────────────────────── */
export function Table({ headers, children }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 dark:border-gray-800 bg-surface-50 dark:bg-gray-800/50">
            {headers.map((h, i) => (
              <th
                key={i}
                className={`px-4 py-3 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider
                  ${i === 0 ? 'text-left rounded-tl-xl' : 'text-right'}
                  ${i === headers.length - 1 ? 'rounded-tr-xl' : ''}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

/* ── Pagination ──────────────────────────────────────── */
export function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    const p = page <= 3 ? i + 1 : page - 2 + i;
    return p >= 1 && p <= totalPages ? p : null;
  }).filter(Boolean);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-800">
      <span className="text-xs text-gray-500">Trang {page}/{totalPages}</span>
      <div className="flex gap-1">
        <button onClick={() => onChange(page - 1)} disabled={page <= 1}
          className="btn btn-secondary px-2 py-1.5 text-xs disabled:opacity-40 disabled:cursor-not-allowed">
          <ChevronLeft size={14} />
        </button>
        {pages.map(p => (
          <button key={p} onClick={() => onChange(p)}
            className={`btn px-3 py-1.5 text-xs font-bold ${p === page ? 'btn-primary' : 'btn-secondary'}`}>
            {p}
          </button>
        ))}
        <button onClick={() => onChange(page + 1)} disabled={page >= totalPages}
          className="btn btn-secondary px-2 py-1.5 text-xs disabled:opacity-40 disabled:cursor-not-allowed">
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

/* ── Loading ─────────────────────────────────────────── */
export function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-10 h-10 rounded-2xl header-gradient flex items-center justify-center animate-pulse">
        <Loader2 size={20} className="animate-spin text-white" />
      </div>
      <p className="text-xs text-gray-400 font-medium">Đang tải dữ liệu...</p>
    </div>
  );
}

/* ── Empty State ─────────────────────────────────────── */
export function EmptyState({ message = 'Không có dữ liệu', icon: Icon = AlertCircle }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
        <Icon size={24} className="opacity-50" />
      </div>
      <p className="text-sm font-medium">{message}</p>
      <p className="text-xs mt-1 opacity-60">Thêm dữ liệu để bắt đầu</p>
    </div>
  );
}

/* ── Form Field ──────────────────────────────────────── */
export function FormField({ label, required, error, children, hint }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="label">
          {label} {required && <span className="text-red-500 normal-case font-bold">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
      {error && <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={11} />{error}</p>}
    </div>
  );
}

/* ── Confirm Dialog ──────────────────────────────────── */
export function ConfirmDialog({ open, onClose, onConfirm, title = 'Xác nhận', message }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-fadeIn">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center shrink-0">
            <AlertCircle size={20} className="text-red-500" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">{title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">Hành động này không thể hoàn tác</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 bg-surface-50 dark:bg-gray-800 rounded-xl p-3">{message}</p>
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="btn btn-secondary text-sm">Hủy</button>
          <button onClick={() => { onConfirm(); onClose(); }} className="btn btn-danger text-sm">
            Xác nhận xóa
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Toast ───────────────────────────────────────────── */
let _toastCb = null;
export function setToastCallback(cb) { _toastCb = cb; }
export function toast(message, type = 'success') { if (_toastCb) _toastCb(message, type); }

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  setToastCallback((message, type) => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  });

  const icons = { success: CheckCircle2, error: AlertCircle };

  return (
    <div className="fixed bottom-5 right-5 z-[100] space-y-2 pointer-events-none">
      {toasts.map(t => {
        const TIcon = icons[t.type] || CheckCircle2;
        return (
          <div key={t.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold animate-fadeIn pointer-events-auto
              ${t.type === 'success'
                ? 'bg-white dark:bg-gray-900 text-gray-800 dark:text-white border border-gray-100 dark:border-gray-800'
                : 'bg-red-500 text-white'}`}
          >
            <TIcon size={16} className={t.type === 'success' ? 'text-primary-500' : 'text-white'} />
            {t.message}
          </div>
        );
      })}
    </div>
  );
}
