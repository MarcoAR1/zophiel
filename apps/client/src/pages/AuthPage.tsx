import { useState, useEffect, useCallback, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../i18n/index';
import ZophielLogo from '../components/ZophielLogo';
import { StitchButton, StitchInput, StitchDivider, StitchGlassCard } from '../components/Stitch';

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
  const [gisLoaded, setGisLoaded] = useState(false);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '399934829057-ion4sr02mpnftbd3kssju2e63jg4c4s4.apps.googleusercontent.com';
  const isNative = Capacitor.isNativePlatform();

  const handleGoogleResponse = useCallback(
    async (response: any) => {
      setError('');
      setLoading(true);
      try {
        await loginWithGoogle(response.credential);
      } catch (err: any) {
        setError(`Google: ${err.message}`);
      } finally {
        setLoading(false);
      }
    },
    [loginWithGoogle]
  );

  // ── Initialize SocialLogin on native ──
  useEffect(() => {
    if (!isNative || !googleClientId) return;
    (async () => {
      try {
        const { SocialLogin } = await import('@capgo/capacitor-social-login');
        await SocialLogin.initialize({
          google: { webClientId: googleClientId },
        });
        console.log('[Auth] SocialLogin initialized');
      } catch (err) {
        console.error('[Auth] SocialLogin init error:', err);
      }
    })();
  }, [isNative, googleClientId]);

  // ── Load GIS on web only ──
  useEffect(() => {
    if (!googleClientId || isNative) return;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google && googleBtnRef.current) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleResponse,
        });
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'continue_with',
          shape: 'pill',
        });
        setGisLoaded(true);
      }
    };
    document.head.appendChild(script);
    return () => {
      try { document.head.removeChild(script); } catch {}
    };
  }, [handleGoogleResponse, googleClientId, isNative]);

  /**
   * Native Google Sign-In via @capgo/capacitor-social-login
   * Uses Google Credential Manager (Android) / Sign In with Apple framework (iOS)
   */
  const handleNativeGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const { SocialLogin } = await import('@capgo/capacitor-social-login');
      const result = await SocialLogin.login({
        provider: 'google',
        options: {},
      });

      // Extract the ID token and send to our backend
      const idToken = (result as any)?.result?.idToken;
      if (!idToken) {
        throw new Error('No se recibió token de Google');
      }
      await loginWithGoogle(idToken);
    } catch (err: any) {
      // User cancelled = not an error
      if (err.message?.includes('cancel') || err.code === 'SIGN_IN_CANCELLED') {
        setLoading(false);
        return;
      }
      setError(`Google: ${err.message}`);
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
      setError(`${isLogin ? 'Login' : 'Registro'}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  /* ═══ Google Button — GIS on web, custom button on native ═══ */
  const googleButton = googleClientId ? (
    isNative ? (
      /* Native: custom button that opens system browser */
      <button
        type="button"
        onClick={handleNativeGoogleLogin}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 h-12 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-50"
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continuar con Google
      </button>
    ) : (
      /* Web: GIS rendered button */
      <div ref={googleBtnRef} className="w-full" />
    )
  ) : null;

  return (
    <div className="bg-background-dark font-display antialiased text-slate-100 min-h-screen flex flex-col items-center justify-center p-4">

      <div className="w-full max-w-md mx-auto flex flex-col h-full justify-center">
        {/* ═══ Header — Stitch Pro: round logo ═══ */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 text-primary">
            <ZophielLogo size={36} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Zophiel</h1>
        </div>

        {/* ═══ Glassmorphism Card — exact Stitch Pro wrapper ═══ */}
        <StitchGlassCard>
          {/* Title */}
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

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              <p>{error}</p>
              <p className="text-[10px] text-red-400/50 mt-1">API: {import.meta.env.VITE_API_URL || '/api'}</p>
            </div>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
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
              label="Email"
              placeholder="ejemplo@correo.com"
              type="email"
              icon="mail"
              value={email}
              onChange={setEmail}
              required
            />

            <StitchInput
              id="password"
              label="Contraseña"
              placeholder="********"
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
                label="Confirmar contraseña"
                placeholder="********"
                type="password"
                icon="lock"
                value={confirmPassword}
                onChange={setConfirmPassword}
                required
                minLength={6}
              />
            )}

            {isLogin && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors bg-transparent border-none cursor-pointer"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            <StitchButton type="submit" disabled={loading}>
              {loading ? t('auth_loading') : isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
            </StitchButton>
          </form>

          {/* Divider + Google */}
          <StitchDivider text={isLogin ? 'o continuar con' : 'o registrarse con'} />
          {googleButton}
        </StitchGlassCard>

        {/* ═══ Footer ═══ */}
        <div className="mt-8 text-center">
          <p className="text-slate-400">
            {isLogin ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}{' '}
            <button
              className="text-primary font-bold hover:underline bg-transparent border-none cursor-pointer font-[inherit] ml-1"
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
            >
              {isLogin ? 'Registrate' : 'Iniciar sesión'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
