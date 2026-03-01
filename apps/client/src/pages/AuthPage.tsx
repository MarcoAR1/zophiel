import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../i18n/index';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
        };
      };
    };
  }
}

export default function AuthPage() {
  const { login, register, loginWithGoogle } = useAuth();
  const { t } = useI18n();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const googleBtnRef = useRef<HTMLDivElement>(null);

  const handleGoogleResponse = useCallback(
    async (response: any) => {
      setError('');
      setLoading(true);
      try {
        await loginWithGoogle(response.credential);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [loginWithGoogle]
  );

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google && googleBtnRef.current) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleResponse,
        });
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'continue_with',
          shape: 'pill',
        });
      }
    };
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [handleGoogleResponse]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card card-glow animate-in">
        <div className="auth-logo">🩺 Zophiel</div>
        <p className="auth-tagline">{t('auth_tagline')}</p>

        {error && (
          <div className="toast toast-error" style={{ position: 'relative', top: 0, marginBottom: 'var(--space-md)' }}>
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <label htmlFor="name">{t('auth_name')}</label>
              <input
                id="name"
                className="input"
                type="text"
                placeholder={t('auth_name_placeholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="input-group">
            <label htmlFor="email">{t('auth_email')}</label>
            <input
              id="email"
              className="input"
              type="email"
              placeholder={t('auth_email_placeholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">{t('auth_password')}</label>
            <input
              id="password"
              className="input"
              type="password"
              placeholder={t('auth_password_placeholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button className="btn btn-primary btn-lg btn-block" type="submit" disabled={loading}>
            {loading ? t('auth_loading') : isLogin ? t('auth_login') : t('auth_register')}
          </button>
        </form>

        {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
          <>
            <div className="auth-divider">
              <span>{t('auth_or')}</span>
            </div>
            <div ref={googleBtnRef} className="google-btn-container" />
          </>
        )}

        <div className="auth-toggle">
          {isLogin ? t('auth_no_account') : t('auth_has_account')}{' '}
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }}>
            {isLogin ? t('auth_signup') : t('auth_signin')}
          </button>
        </div>
      </div>
    </div>
  );
}
