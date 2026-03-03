import React from 'react';

/* ─── Stitch Design System Components ─── */
/* Exact styles extracted from Stitch Pro HTML */
/* Primary: #8c25f4 | Font: Inter | Mode: Dark */
/* background-dark: #191022 | surface-dark: #231830 */

/* ════════════════════════════════════════════════════ */
/*  StitchButton — CTA button from Stitch Pro HTML     */
/* ════════════════════════════════════════════════════ */
interface StitchButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  icon?: string;
}

export function StitchButton({
  children,
  onClick,
  type = 'button',
  disabled = false,
  variant = 'primary',
  className = '',
  icon,
}: StitchButtonProps) {
  if (variant === 'ghost') {
    return (
      <button
        className={`w-full text-slate-500 text-sm font-medium hover:text-slate-300 bg-transparent py-3 transition-colors ${className}`}
        onClick={onClick}
        type={type}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }

  if (variant === 'secondary') {
    return (
      <button
        className={`w-full flex items-center justify-center gap-3 py-3.5 px-6 border border-white/20 rounded-xl bg-transparent hover:bg-white/5 transition-colors group ${className}`}
        onClick={onClick}
        type={type}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-[#6e1bc4] hover:from-[#7a1fd6] hover:to-[#5c16a6] text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-50 group ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
      {icon && (
        <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">
          {icon}
        </span>
      )}
    </button>
  );
}

/* ════════════════════════════════════════════════════ */
/*  StitchInput — Exact Stitch Pro input (icon LEFT)   */
/* ════════════════════════════════════════════════════ */
interface StitchInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  type?: string;
  icon?: string;
  label?: string;
  required?: boolean;
  autoFocus?: boolean;
  id?: string;
  minLength?: number;
}

export function StitchInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  icon,
  label,
  required,
  autoFocus,
  id,
  minLength,
}: StitchInputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-300" htmlFor={id}>
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <span className="material-symbols-outlined">{icon}</span>
          </div>
        )}
        <input
          className={`block w-full ${icon ? 'pl-12' : 'pl-4'} pr-4 py-4 bg-[#1f1627] border border-[#473b54] rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors`}
          id={id}
          placeholder={placeholder}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          autoFocus={autoFocus}
          minLength={minLength}
        />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════ */
/*  StitchProgressDots — Pill-style from Stitch Pro    */
/* ════════════════════════════════════════════════════ */
interface StitchProgressDotsProps {
  total: number;
  current: number;
}

export function StitchProgressDots({ total, current }: StitchProgressDotsProps) {
  return (
    <div className="flex w-full flex-row items-center justify-center gap-3 py-4">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-300 ${
            current === i
              ? 'h-2 w-8 bg-primary shadow-[0_0_10px_rgba(140,37,244,0.5)]'
              : 'h-1.5 w-1.5 bg-slate-700'
          }`}
        />
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════ */
/*  StitchTopBar — Header from Stitch Pro HTML         */
/* ════════════════════════════════════════════════════ */
interface StitchTopBarProps {
  title: string;
  onBack?: () => void;
  showBack?: boolean;
}

export function StitchTopBar({ title, onBack, showBack = true }: StitchTopBarProps) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-background-dark/80 backdrop-blur-md">
      {showBack && onBack ? (
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors text-slate-100 bg-transparent border-none cursor-pointer"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
      ) : (
        <div className="w-10" />
      )}
      <h2 className="text-base font-semibold text-slate-100 tracking-wide">{title}</h2>
      <div className="w-10" />
    </header>
  );
}

/* ════════════════════════════════════════════════════ */
/*  StitchConditionCard — Exact Stitch Pro tile         */
/* ════════════════════════════════════════════════════ */
interface StitchConditionCardProps {
  icon: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function StitchConditionCard({ icon, label, selected, onClick }: StitchConditionCardProps) {
  return (
    <button
      className={`group relative flex flex-col items-center justify-center gap-4 p-6 rounded-2xl transition-all duration-300 active:scale-[0.97] ${
        selected
          ? 'border-2 border-primary bg-primary/10 hover:bg-primary/20'
          : 'border border-slate-700 bg-[#231830]/40 backdrop-blur-sm hover:border-primary/50 hover:bg-[#231830]/80'
      }`}
      onClick={onClick}
    >
      {/* Check badge */}
      <div className={`absolute top-3 right-3 transition-opacity ${selected ? 'opacity-100' : 'opacity-0'}`}>
        <span className="material-symbols-outlined text-primary text-[20px] font-bold">check_circle</span>
      </div>
      {/* Icon circle */}
      <div className={`flex items-center justify-center w-14 h-14 rounded-full transition-colors ${
        selected
          ? 'bg-primary/20 text-primary'
          : 'bg-slate-800 text-slate-400 group-hover:text-primary group-hover:bg-primary/10'
      }`}>
        <span className="material-symbols-outlined text-[32px]">{icon}</span>
      </div>
      <p className={`text-base font-medium leading-tight text-center ${
        selected ? 'font-semibold text-white' : 'text-slate-200'
      }`}>
        {label}
      </p>
    </button>
  );
}

/* ════════════════════════════════════════════════════ */
/*  StitchCard — Generic glassmorphism container        */
/* ════════════════════════════════════════════════════ */
interface StitchCardProps {
  children: React.ReactNode;
  className?: string;
  selected?: boolean;
  onClick?: () => void;
}

export function StitchCard({ children, className = '', selected, onClick }: StitchCardProps) {
  const base = 'rounded-2xl backdrop-blur-md border transition-all duration-200';
  const style = selected
    ? 'bg-primary/10 border-primary/30'
    : 'bg-[#231830]/40 border-slate-700/50';

  return onClick ? (
    <button
      className={`${base} ${style} ${className} active:scale-[0.97] cursor-pointer text-left`}
      onClick={onClick}
    >
      {children}
    </button>
  ) : (
    <div className={`${base} ${style} ${className}`}>{children}</div>
  );
}

/* ════════════════════════════════════════════════════ */
/*  StitchToggle — Toggle switch                        */
/* ════════════════════════════════════════════════════ */
interface StitchToggleProps {
  active: boolean;
  onClick: () => void;
}

export function StitchToggle({ active, onClick }: StitchToggleProps) {
  return (
    <div
      className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer flex-shrink-0 ${
        active ? 'bg-primary' : 'bg-slate-700'
      }`}
      onClick={onClick}
    >
      <div
        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
          active ? 'right-1' : 'left-1'
        }`}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════ */
/*  StitchChip — Selection chip/tag                     */
/* ════════════════════════════════════════════════════ */
interface StitchChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function StitchChip({ label, selected, onClick }: StitchChipProps) {
  return (
    <button
      className={`px-4 py-2.5 rounded-full text-sm flex items-center gap-2 transition-all active:scale-[0.97] ${
        selected
          ? 'bg-primary/15 border border-primary/40 text-white font-medium'
          : 'bg-[#231830]/60 border border-slate-700 text-slate-300 hover:border-primary/30'
      }`}
      onClick={onClick}
    >
      <span className="material-symbols-outlined text-[16px]">
        {selected ? 'check_circle' : 'add'}
      </span>
      {label}
    </button>
  );
}

/* ════════════════════════════════════════════════════ */
/*  StitchPill — Rounded pill button                    */
/* ════════════════════════════════════════════════════ */
interface StitchPillProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  icon?: string;
}

export function StitchPill({ label, selected, onClick, icon }: StitchPillProps) {
  return (
    <button
      className={`w-full px-5 py-4 rounded-xl text-base transition-all active:scale-[0.98] flex items-center gap-3 ${
        selected
          ? 'border-2 border-primary bg-primary/10 font-semibold text-white'
          : 'border border-slate-700 bg-[#231830]/40 text-slate-300 hover:border-primary/30'
      }`}
      onClick={onClick}
    >
      {icon && (
        <span className={`material-symbols-outlined text-[20px] ${selected ? 'text-primary' : 'text-slate-500'}`}>
          {icon}
        </span>
      )}
      <span className="flex-1 text-left">{label}</span>
      {selected && <span className="material-symbols-outlined text-primary text-[18px]">check</span>}
    </button>
  );
}

/* ════════════════════════════════════════════════════ */
/*  StitchDivider — "o continuar con" divider           */
/* ════════════════════════════════════════════════════ */
export function StitchDivider({ text = 'o continuar con' }: { text?: string }) {
  return (
    <div className="relative flex py-8 items-center">
      <div className="flex-grow border-t border-white/10" />
      <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">{text}</span>
      <div className="flex-grow border-t border-white/10" />
    </div>
  );
}

/* ════════════════════════════════════════════════════ */
/*  StitchGlassCard — Form wrapper from login.html     */
/* ════════════════════════════════════════════════════ */
export function StitchGlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`w-full bg-[#251b2e]/80 backdrop-blur-xl border border-white/10 p-6 sm:p-8 rounded-[2rem] shadow-xl ${className}`}>
      {children}
    </div>
  );
}
