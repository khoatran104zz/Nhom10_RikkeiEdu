import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, Mail, Loader2, AlertCircle } from 'lucide-react';
import { AuthLayout, AuthCard, PasswordInput, toast } from '../components/shared';
import { useAuth } from '../auth/AuthContext';
import { getRedirectPath } from '../auth/ProtectedRoute';
import { authApi } from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const mapUser = (serverUser) => ({
    ...serverUser,
    name: serverUser.fullName || serverUser.username || serverUser.email,
    role: serverUser.roleName,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError('Vui long nhap username hoac email');
      return;
    }
    if (!password) {
      setError('Vui long nhap mat khau');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.login({
        username: identifier.trim(),
        password,
      });

      const user = mapUser(response.user);
      login({
        token: response.token,
        user,
      });
      toast('Dang nhap he thong thanh cong');
      navigate(getRedirectPath(user.role), { replace: true });
    } catch (err) {
      setError(err.message || 'Dang nhap that bai. Vui long thu lai.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col items-center mb-6">
        <div className="w-12 h-12 rounded-2xl header-gradient flex items-center justify-center shadow-lg shadow-primary-500/20 mb-3">
          <Zap size={24} className="text-white" fill="white" />
        </div>
        <div className="leading-tight text-center">
          <span className="font-extrabold text-gray-900 dark:text-white text-2xl tracking-tight">
            e<span className="text-primary-500">Manage</span>
          </span>
          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-1">He thong quan ly ban hang chuyen nghiep</p>
        </div>
      </div>

      <AuthCard>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Dang nhap he thong</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Su dung tai khoan trong database PostgreSQL</p>
        </div>

        {error && (
          <div className="mb-4 p-3.5 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Username hoac email</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                <Mail size={16} />
              </span>
              <input
                type="text"
                className={`input pl-10 focus:ring-primary-500/40 focus:border-primary-500 ${
                  error && !identifier ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                }`}
                placeholder="admin hoac admin@emanage.vn"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                disabled={isLoading}
                autoComplete="username"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="label mb-0">Mat khau</label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-primary-500 hover:text-primary-600 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  toast('Chuc nang khoi phuc mat khau dang duoc phat trien', 'error');
                }}
              >
                Quen mat khau?
              </Link>
            </div>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhap mat khau"
              disabled={isLoading}
              error={error && !password}
              autoComplete="current-password"
            />
          </div>

          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 dark:border-gray-700 text-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-800 transition-colors cursor-pointer"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-xs font-semibold text-gray-600 dark:text-gray-400 cursor-pointer select-none"
            >
              Ghi nho dang nhap
            </label>
          </div>

          <button
            type="submit"
            className="w-full btn btn-primary py-3 rounded-xl justify-center font-bold text-sm select-none"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Dang kiem tra...
              </>
            ) : (
              'Dang nhap'
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
            Chua co tai khoan?{' '}
            <Link
              to="/register"
              className="text-primary-500 hover:text-primary-600 transition-colors font-bold"
            >
              Dang ky ngay
            </Link>
          </p>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
