import { cn } from '../../utils/cn';

/**
 * @param {{ icon?: React.ReactNode, title: string, description?: string, action?: React.ReactNode, className?: string }} props
 */
const EmptyState = ({ icon, title, description, action, className }) => (
  <div className={cn('flex flex-col items-center justify-center gap-2 py-12 text-center', className)}>
    {icon && (
      <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-mist text-slate-500">
        {icon}
      </div>
    )}
    <p className="font-display text-base font-semibold text-ink">{title}</p>
    {description && <p className="max-w-sm text-sm text-slate-500">{description}</p>}
    {action && <div className="mt-3">{action}</div>}
  </div>
);

export default EmptyState;
