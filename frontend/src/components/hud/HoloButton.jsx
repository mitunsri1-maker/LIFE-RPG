import React from 'react';
import { clsx } from 'clsx';
import { soundFX } from '../../utils/soundFX';

export function HoloButton({
  children,
  onClick,
  disabled = false,
  variant = 'cyan', // cyan, magenta, green, gold, red, ghost
  size = 'md',
  className = '',
  icon: Icon = null,
  type = 'button',
}) {
  const styles = {
    cyan: 'bg-cyber-cyan/15 text-cyber-cyan border-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-bg shadow-holo-cyan',
    magenta: 'bg-cyber-magenta/15 text-cyber-magenta border-cyber-magenta hover:bg-cyber-magenta hover:text-cyber-bg shadow-holo-purple',
    green: 'bg-cyber-green/15 text-cyber-green border-cyber-green hover:bg-cyber-green hover:text-cyber-bg shadow-holo-green',
    gold: 'bg-cyber-gold/15 text-cyber-gold border-cyber-gold hover:bg-cyber-gold hover:text-cyber-bg shadow-holo-gold',
    red: 'bg-cyber-red/15 text-cyber-red border-cyber-red hover:bg-cyber-red hover:text-cyber-bg shadow-holo-red',
    ghost: 'bg-cyber-panel/60 text-cyber-text border-cyber-border hover:border-cyber-cyan hover:text-cyber-cyan',
  }[variant] || styles.cyan;

  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-semibold',
    md: 'px-5 py-2.5 text-sm font-bold',
    lg: 'px-7 py-3.5 text-base font-black',
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
        'relative inline-flex items-center justify-center gap-2 font-orbitron uppercase tracking-wider rounded border-2 transition-all duration-150 select-none cursor-pointer',
        'active:scale-95 disabled:opacity-40 disabled:pointer-events-none disabled:cursor-not-allowed',
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
