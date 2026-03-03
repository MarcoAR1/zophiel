import { useState, useEffect, useCallback, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../i18n/index';
import ZophielLogo from '../components/ZophielLogo';
import { StitchButton, StitchInput, StitchDivider } from '../components/Stitch';

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
  const [confirmPassword, setConfirmPassword] = useState('');
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

    if (!isLogin && password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

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
    <div className="bg-background-dark font-display antialiased text-slate-100 min-h-screen flex flex-col">

      {/* ═══ Main Content ═══ */}
      <div className="flex-1 flex flex-col w-full max-w-md mx-auto px-6 py-8">

        {/* ═══ Header — Stitch Pro: logo + title ═══ */}
        <header className="flex flex-col items-center pt-8 pb-6 space-y-3">
          <div className="relative flex items-center justify-center size-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-inner shadow-primary/20 ring-1 ring-white/10 backdrop-blur-sm">
            <ZophielLogo size={40} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Zophiel
          </h1>
        </header>

        {/* ═══ Title — changes per mode ═══ */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            {isLogin ? 'Bienvenido de vuelta' : 'Creá tu cuenta'}
          </h2>
          <p className="text-slate-400 text-sm">
            {isLogin
              ? 'Ingresá para continuar registrando tu dolor'
              : 'Empezá a registrar y entender tu dolor'}
          </p>
        </div>

        {/* ═══ Error ═══ */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* ═══ Form — Stitch Pro style ═══ */}
        <form className="space-y-4 w-full" onSubmit={handleSubmit}>
          {!isLogin && (
            <StitchInput
              id="name"
              label={t('auth_name')}
              placeholder="Nombre completo"
              icon="person"
              value={name}
              onChange={setName}
              required
            />
          )}

          <StitchInput
            id="email"
            label={isLogin ? 'Email' : undefined}
            placeholder="Correo electrónico"
            type="email"
            icon="mail"
            value={email}
            onChange={setEmail}
            required
          />

          <StitchInput
            id="password"
            label={isLogin ? 'Contraseña' : undefined}
            placeholder="Contraseña"
            type="password"
            icon="lock"
            value={password}
            onChange={setPassword}
            required
            minLength={6}
          />

          {!isLogin && (
            <StitchInput
              id="confirm-password"
              placeholder="Confirmar contraseña"
              type="password"
              icon="lock"
              value={confirmPassword}
              onChange={setConfirmPassword}
              required
              minLength={6}
            />
          )}

          {isLogin && (
            <div className="text-right">
              <button
                type="button"
                className="text-primary text-xs font-medium hover:underline bg-transparent border-none cursor-pointer"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          )}

          <StitchButton
            type="submit"
            disabled={loading}
            icon="arrow_forward"
          >
            {loading ? t('auth_loading') : isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
          </StitchButton>
        </form>

        {/* ═══ Divider + Google ═══ */}
        <StitchDivider text={isLogin ? 'o continuar con' : 'o registrarse con'} />

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
            {isLogin ? 'Continuar con Google' : 'Continuar con Google'}
          </button>
        ) : (
          import.meta.env.VITE_GOOGLE_CLIENT_ID && (
            <div ref={googleBtnRef} className="w-full" />
          )
        )}
      </div>

      {/* ═══ Footer — "¿No tenés cuenta? Registrate" ═══ */}
      <div className="w-full py-6 text-center border-t border-white/5">
        <p className="text-sm text-slate-400 m-0">
          {isLogin ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}{' '}
          <button
            className="text-primary font-bold hover:underline bg-transparent border-none cursor-pointer font-[inherit]"
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
          >
            {isLogin ? 'Registrate' : 'Iniciar sesión'}
          </button>
        </p>
      </div>
    </div>
  );
}
