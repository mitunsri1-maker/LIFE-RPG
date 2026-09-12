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
    cyan: 'bg-cyber-cyan text-white border-cyber-cyan hover:bg-cyber-blue shadow-holo-cyan',
    magenta: 'bg-cyber-magenta text-white border-cyber-magenta hover:opacity-90 shadow-holo-purple',
    green: 'bg-cyber-green text-white border-cyber-green hover:opacity-90 shadow-holo-green',
    gold: 'bg-cyber-amber text-white border-cyber-amber hover:opacity-90 shadow-holo-gold',
    red: 'bg-cyber-red text-white border-cyber-red hover:opacity-90 shadow-holo-red',
    ghost: 'city-glass text-cyber-text border-slate-200 hover:border-cyber-cyan hover:text-cyber-cyan shadow-sm',
    elevated: 'bg-white text-cyber-cyan border-cyber-cyan/50 hover:bg-cyber-cyan hover:text-white shadow-md',
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
