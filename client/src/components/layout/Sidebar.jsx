import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/cn';
import Badge from '../ui/Badge';

/**
 * @param {{
 *   items: { label: string, to: string, icon?: React.ReactNode, badge?: React.ReactNode }[],
 *   isOpen?: boolean,     // mobile drawer visibility
 *   onClose?: () => void, // mobile drawer close (backdrop / nav click)
 *   className?: string,
 * }} props
 */
const Sidebar = ({ items = [], isOpen = false, onClose, className }) => {
  const navContent = (
    <nav className="flex flex-col gap-1 p-3">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onClose}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary-50 text-primary-700'
                : 'text-slate-600 hover:bg-mist hover:text-ink'
            )
          }
        >
          {item.icon && <span className="shrink-0">{item.icon}</span>}
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge !== undefined && item.badge !== null && (
            <Badge tone="primary">{item.badge}</Badge>
          )}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop: persistent column */}
      <aside
        className={cn(
          'hidden w-64 shrink-0 border-r border-mist bg-white lg:block',
          className
        )}
      >
        {navContent}
      </aside>

      {/* Mobile: off-canvas drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 animate-fade-in bg-ink/40" onClick={onClose} aria-hidden="true" />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[80vw] animate-slide-in-right bg-white shadow-soft-lg">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
