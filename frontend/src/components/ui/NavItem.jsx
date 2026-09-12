export function NavItem({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-body font-semibold text-sm
                  border-3 transition-all duration-150 select-none
                  active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
                  ${active
                    ? 'bg-brand-violet text-line border-line shadow-brutal-line'
                    : 'bg-panel/40 text-line/70 border-transparent hover:border-line/40 hover:text-line hover:bg-panel'}`}
    >
      <span className="shrink-0">{typeof Icon === 'function' ? <Icon className="w-5 h-5" /> : Icon}</span>
      <span className="font-display tracking-wide">{label}</span>
    </button>
  );
}

export default NavItem;
