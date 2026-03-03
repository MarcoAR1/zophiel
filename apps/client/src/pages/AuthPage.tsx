import { useState, useEffect, useCallback, useRef } from 'react';
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
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '399934829057-ion4sr02mpnftbd3kssju2e63jg4c4s4.apps.googleusercontent.com';

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

  // Load Google Identity Services (web GIS) on ALL platforms
  // Works on Capacitor WebView too — it's just a browser
  useEffect(() => {
    if (!googleClientId) return;

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
      }
    };
    document.head.appendChild(script);
    return () => {
      try { document.head.removeChild(script); } catch {}
    };
  }, [handleGoogleResponse, googleClientId]);

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

  /* ═══ Google Button — web GIS on all platforms (Capacitor WebView is a browser) ═══ */
  const googleButton = googleClientId ? (
    <div ref={googleBtnRef} className="w-full" />
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
