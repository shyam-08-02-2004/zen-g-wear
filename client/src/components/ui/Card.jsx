import { cn } from '../../utils/cn';

/**
 * Base container. Use the attached subcomponents for consistent internal
 * spacing: <Card.Header/>, <Card.Body/>, <Card.Footer/>.
 *
 * @param {{ hoverable?: boolean, padded?: boolean, className?: string }} props
 */
const Card = ({ hoverable = false, padded = true, className, children, ...rest }) => (
  <div
    className={cn(
      'rounded-2xl border border-mist bg-white shadow-soft',
      hoverable && 'transition-shadow duration-150 hover:shadow-soft-lg',
      padded && 'p-5',
      className
    )}
    {...rest}
  >
    {children}
  </div>
);

const CardHeader = ({ className, children, ...rest }) => (
  <div className={cn('mb-4 flex items-start justify-between gap-3', className)} {...rest}>
    {children}
  </div>
);

const CardBody = ({ className, children, ...rest }) => (
  <div className={cn('text-sm text-slate-600', className)} {...rest}>
    {children}
  </div>
);

const CardFooter = ({ className, children, ...rest }) => (
  <div
    className={cn('mt-4 flex items-center justify-between gap-3 border-t border-mist pt-4', className)}
    {...rest}
  >
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

/**
 * Compact metric card for dashboards (e.g. "Active Orders", "Storage Used").
 * @param {{
 *   label: string,
 *   value: React.ReactNode,
 *   icon?: React.ReactNode,
 *   trend?: { direction: 'up'|'down', value: string },
 *   className?: string,
 * }} props
 */
export const StatCard = ({ label, value, icon, trend, className }) => (
  <Card className={cn('flex items-start justify-between', className)}>
    <div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1.5 font-display text-2xl font-semibold text-ink">{value}</p>
      {trend && (
        <p
          className={cn(
            'mt-1.5 text-xs font-medium',
            trend.direction === 'up' ? 'text-emerald-600' : 'text-red-600'
          )}
        >
          {trend.direction === 'up' ? '▲' : '▼'} {trend.value}
        </p>
      )}
    </div>
    {icon && (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
        {icon}
      </div>
    )}
  </Card>
);

export default Card;
