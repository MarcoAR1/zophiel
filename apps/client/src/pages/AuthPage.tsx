import { useState, useEffect, useCallback, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../i18n/index';
import ZophielLogo from '../components/ZophielLogo';

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
  const isNative = Capacitor.isNativePlatform();

  useEffect(() => {
    if (isNative) {
      GoogleAuth.initialize({
        clientId: '399934829057-ion4sr02mpnftbd3kssju2e63jg4c4s4.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
        grantOfflineAccess: false,
      });
    }
  }, [isNative]);

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
    if (isNative) return;
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
    return () => { document.head.removeChild(script); };
  }, [handleGoogleResponse, isNative]);

  const handleGoogleNative = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await GoogleAuth.signIn();
      if (result.authentication?.idToken) {
        await loginWithGoogle(result.authentication.idToken);
      } else {
        setError('No se pudo obtener el token de Google');
      }
    } catch (err: any) {
      if (err.message !== 'The user canceled the sign-in flow.') {
        setError(err.message || 'Error al iniciar sesión con Google');
      }
    } finally {
      setLoading(false);
    }
  };

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
    <div className="dark">
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <div className="bg-background-dark font-display antialiased text-slate-100 min-h-screen flex flex-col justify-between overflow-x-hidden">
        {/* ══ Main Content (Stitch) ══ */}
        <div className="flex-1 flex flex-col w-full max-w-md mx-auto relative px-6 py-8">

          {/* ══ Header (Stitch) ══ */}
          <header className="flex flex-col items-center justify-center pt-8 pb-6 space-y-4">
            <div className="relative flex items-center justify-center size-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-inner shadow-primary/20 ring-1 ring-white/10 backdrop-blur-sm">
              <ZophielLogo size={40} />
              <div className="absolute -bottom-1 -right-1 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-background-dark">Z</div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
              Zophiel
            </h1>
            <p className="text-slate-400 text-center text-sm font-medium max-w-[280px] leading-relaxed">
              {t('auth_tagline')}
            </p>
          </header>

          {/* ══ Tabs (Stitch) ══ */}
          <div className="mt-4 mb-8">
            <div className="flex border-b border-white/10 w-full">
              <button
                className={`flex-1 pb-3 text-center text-sm font-semibold transition-colors duration-200 ${
                  isLogin
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-slate-500 hover:text-slate-300 border-b-2 border-transparent hover:border-slate-700'
                }`}
                onClick={() => { setIsLogin(true); setError(''); }}
              >
                {t('auth_signin')}
              </button>
              <button
                className={`flex-1 pb-3 text-center text-sm font-semibold transition-colors duration-200 ${
                  !isLogin
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-slate-500 hover:text-slate-300 border-b-2 border-transparent hover:border-slate-700'
                }`}
                onClick={() => { setIsLogin(false); setError(''); }}
              >
                {t('auth_signup')}
              </button>
            </div>
          </div>

          {/* ══ Error ══ */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* ══ Form (Stitch) ══ */}
          <form className="space-y-5 w-full" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 ml-1" htmlFor="name">{t('auth_name')}</label>
                <div className="relative group">
                  <input
                    className="w-full h-14 pl-4 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                    id="name"
                    placeholder={t('auth_name_placeholder')}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[20px]">person</span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 ml-1" htmlFor="email">{t('auth_email')}</label>
              <div className="relative group">
                <input
                  className="w-full h-14 pl-4 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                  id="email"
                  placeholder={t('auth_email_placeholder')}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 ml-1" htmlFor="password">{t('auth_password')}</label>
              <div className="relative group">
                <input
                  className="w-full h-14 pl-4 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary cursor-pointer hover:text-slate-300 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">visibility_off</span>
                </div>
              </div>
            </div>

            {/* ══ Submit Button (Stitch) ══ */}
            <button
              className="w-full h-14 mt-4 bg-gradient-to-r from-primary to-[#6d1cc5] text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              <span>{loading ? t('auth_loading') : isLogin ? t('auth_login') : t('auth_register')}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </form>

          {/* ══ Divider (Stitch) ══ */}
          <div className="relative flex py-8 items-center">
            <div className="flex-grow border-t border-white/10" />
            <span className="flex-shrink-0 mx-4 text-slate-500 text-xs font-medium">{t('auth_or')}</span>
            <div className="flex-grow border-t border-white/10" />
          </div>

          {/* ══ Google Auth (Stitch) ══ */}
          {isNative ? (
            <button
              type="button"
              className="w-full h-14 bg-white text-slate-900 font-semibold rounded-xl flex items-center justify-center gap-3 hover:bg-slate-100 transition-colors duration-200"
              onClick={handleGoogleNative}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continuar con Google
            </button>
          ) : (
            import.meta.env.VITE_GOOGLE_CLIENT_ID && (
              <div ref={googleBtnRef} className="w-full" />
            )
          )}
        </div>

        {/* ══ Footer (Stitch) ══ */}
        <div className="w-full py-6 text-center border-t border-white/5 bg-[#140d1c]">
          <p className="text-sm text-slate-400">
            {isLogin ? t('auth_no_account') : t('auth_has_account')}{' '}
            <button
              className="text-primary font-bold hover:underline bg-transparent border-none cursor-pointer font-[inherit]"
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
            >
              {isLogin ? t('auth_signup') : t('auth_signin')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
