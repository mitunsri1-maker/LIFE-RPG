import React from 'react';
import { clsx } from 'clsx';
import { soundFX } from '../../utils/soundFX';

export function HoloButton({
  children,
  onClick,
  disabled = false,
  variant = 'cyan', // cyan, magenta, green, gold, red, ghost, elevated
  size = 'md',
  className = '',
  icon: Icon = null,
  type = 'button',
}) {
  const styles = {
    cyan: 'bg-cyber-cyan text-cyber-bg font-bold border-cyber-cyan hover:bg-cyber-cyan/85 shadow-[0_0_15px_rgba(0,229,255,0.4)]',
    magenta: 'bg-cyber-magenta text-white font-bold border-cyber-magenta hover:opacity-90 shadow-[0_0_15px_rgba(255,45,166,0.4)]',
    green: 'bg-cyber-green text-cyber-bg font-bold border-cyber-green hover:opacity-90 shadow-[0_0_15px_rgba(57,255,136,0.4)]',
    gold: 'bg-cyber-amber text-cyber-bg font-bold border-cyber-amber hover:opacity-90 shadow-[0_0_15px_rgba(255,184,77,0.4)]',
    red: 'bg-cyber-red text-white font-bold border-cyber-red hover:opacity-90 shadow-[0_0_15px_rgba(255,51,102,0.4)]',
    ghost: 'city-glass text-cyber-text border-cyber-cyan/30 hover:border-cyber-cyan hover:text-cyber-cyan hover:shadow-[0_0_15px_rgba(0,229,255,0.25)]',
    elevated: 'bg-cyber-navy/90 text-cyber-cyan border-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-bg shadow-[0_0_15px_rgba(0,229,255,0.3)]',
  }[variant] || styles.cyan;

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs font-semibold rounded-md',
    md: 'px-5 py-2.5 text-xs md:text-sm font-bold rounded-lg',
    lg: 'px-7 py-3.5 text-sm md:text-base font-black rounded-lg',
  }[size] || sizes.md;

  const handleClick = (e) => {
    if (!disabled) {
      soundFX.playClick();
      onClick?.(e);
    }
  };

  const handleMouseEnter = () => {
    if (!disabled) soundFX.playHover();
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      className={clsx(
        'relative inline-flex items-center justify-center gap-2 font-orbitron uppercase tracking-wider border transition-all duration-200 select-none cursor-pointer',
        'active:scale-[0.97] hover:-translate-y-0.5 disabled:opacity-40 disabled:pointer-events-none disabled:cursor-not-allowed',
        styles,
        sizes,
        className
      )}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0 stroke-[2.5]" />}
      <span>{children}</span>
    </button>
  );
}

export default HoloButton;
