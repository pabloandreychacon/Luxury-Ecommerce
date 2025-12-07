import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-luxury text-luxury-gold mb-2">{t('auth.login')}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t('auth.alreadyHaveAccount')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {(error || localError) && (
            <div className="bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded text-sm">
              {error || localError}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-2">{t('auth.email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded focus:outline-none focus:border-luxury-gold"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">{t('auth.password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded focus:outline-none focus:border-luxury-gold"
              placeholder="••••••••"
            />
          </div>

          <div className="text-right">
            <Link to="#" className="text-sm text-luxury-gold hover:text-opacity-80 transition">
              {t('auth.forgotPassword')}
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('common.loading') : t('auth.signIn')}
          </button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            {t('auth.noAccount')}{' '}
            <Link to="/signup" className="text-luxury-gold hover:text-opacity-80 transition font-semibold">
              {t('auth.createAccount')}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
