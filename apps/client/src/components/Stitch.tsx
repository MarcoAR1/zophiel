import React from 'react';

/* ─── Stitch Design System Components ─── */
/* Reusable components based on Stitch-generated designs */
/* Primary: #8c25f4 | Font: Inter | Mode: Dark */

/* ════════════════════════════════════════════════════ */
/*  StitchButton — Primary CTA button                  */
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
  const base = 'w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-all duration-200 disabled:opacity-50';
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-[#a855f7] shadow-lg shadow-primary/25',
    secondary: 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10',
    ghost: 'text-slate-500 text-sm font-medium hover:text-slate-300 bg-transparent',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {icon && <span className="material-symbols-outlined text-[18px]">{icon}</span>}
      {children}
    </button>
  );
}

/* ════════════════════════════════════════════════════ */
/*  StitchInput — Glass input field with icon           */
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
    <div className="space-y-1.5">
      {label && (
        <label className="text-xs font-semibold text-slate-400 ml-1" htmlFor={id}>
          {label}
        </label>
      )}
      <div className="relative group">
        <input
          className="w-full h-14 pl-4 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
          id={id}
          placeholder={placeholder}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          autoFocus={autoFocus}
          minLength={minLength}
        />
        {icon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">
            <span className="material-symbols-outlined text-[20px]">{icon}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════ */
/*  StitchProgressDots — Step indicator                 */
/* ════════════════════════════════════════════════════ */
interface StitchProgressDotsProps {
  total: number;
  current: number;
}

export function StitchProgressDots({ total, current }: StitchProgressDotsProps) {
  return (
    <div className="flex w-full flex-row items-center justify-center gap-3 py-5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-2 w-2 rounded-full transition-all duration-300 ${
            current === i
              ? 'bg-primary scale-125'
              : current > i
              ? 'bg-primary/60'
              : 'bg-primary/20'
          }`}
        />
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════ */
/*  StitchTopBar — Header with back arrow + title       */
/* ════════════════════════════════════════════════════ */
interface StitchTopBarProps {
  title: string;
  onBack?: () => void;
  showBack?: boolean;
}

export function StitchTopBar({ title, onBack, showBack = true }: StitchTopBarProps) {
  return (
    <div className="flex items-center p-4 pb-2 justify-between">
      {showBack && onBack ? (
        <button onClick={onBack} className="p-1 bg-transparent border-none cursor-pointer">
          <span className="material-symbols-outlined text-slate-400">arrow_back_ios</span>
        </button>
      ) : (
        <div className="w-8" />
      )}
      <h2 className="text-lg font-bold text-white flex-1 text-center">{title}</h2>
      <div className="w-8" />
    </div>
  );
}

/* ════════════════════════════════════════════════════ */
/*  StitchCard — Glassmorphism container                */
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
    : 'bg-slate-800/40 border-slate-700/50';

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
      className={`px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-all active:scale-[0.97] ${
        selected
          ? 'bg-primary/20 border border-primary/30'
          : 'bg-slate-800/50 border border-slate-700 hover:bg-slate-800/70'
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
      className={`px-4 py-3 rounded-full text-sm transition-all active:scale-[0.97] flex items-center gap-2 ${
        selected
          ? 'border border-primary bg-primary/20 font-medium text-white'
          : 'border border-slate-700 bg-slate-800/30 text-slate-300 hover:bg-slate-800/60'
      }`}
      onClick={onClick}
    >
      {icon && (
        <span className={`material-symbols-outlined text-[18px] ${selected ? 'text-primary' : 'text-slate-500'}`}>
          {icon}
        </span>
      )}
      {label}
      {selected && <span className="material-symbols-outlined text-[16px] text-primary">check</span>}
    </button>
  );
}

/* ════════════════════════════════════════════════════ */
/*  StitchDivider — "o continuar con" divider           */
/* ════════════════════════════════════════════════════ */
export function StitchDivider({ text = 'o continuar con' }: { text?: string }) {
  return (
    <div className="relative flex py-6 items-center">
      <div className="flex-grow border-t border-white/10" />
      <span className="flex-shrink-0 mx-4 text-slate-500 text-xs font-medium">{text}</span>
      <div className="flex-grow border-t border-white/10" />
    </div>
  );
}
