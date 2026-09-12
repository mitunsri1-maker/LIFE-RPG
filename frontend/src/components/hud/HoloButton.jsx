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
    cyan: 'bg-cyber-cyan/15 text-cyber-cyan border-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-bg shadow-holo-cyan hover:shadow-[0_0_30px_rgba(0,240,255,0.6)]',
    magenta: 'bg-cyber-magenta/15 text-cyber-magenta border-cyber-magenta hover:bg-cyber-magenta hover:text-cyber-bg shadow-holo-purple hover:shadow-[0_0_30px_rgba(255,0,127,0.6)]',
    green: 'bg-cyber-green/15 text-cyber-green border-cyber-green hover:bg-cyber-green hover:text-cyber-bg shadow-holo-green hover:shadow-[0_0_30px_rgba(0,255,157,0.6)]',
    gold: 'bg-cyber-amber/15 text-cyber-amber border-cyber-amber hover:bg-cyber-amber hover:text-cyber-bg shadow-holo-gold hover:shadow-[0_0_30px_rgba(255,184,0,0.6)]',
    red: 'bg-cyber-coral/15 text-cyber-coral border-cyber-coral hover:bg-cyber-coral hover:text-cyber-bg shadow-holo-red hover:shadow-[0_0_30px_rgba(255,51,102,0.6)]',
    ghost: 'city-glass text-cyber-text border-cyber-border hover:border-cyber-cyan hover:text-cyber-cyan hover:shadow-holo-cyan',
    elevated: 'city-glass-elevated text-cyber-cyan border-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-bg shadow-[0_0_25px_rgba(0,240,255,0.4)]',
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
