import { cn } from '../../utils/cn';

const TONE_CLASSES = {
  neutral: 'bg-mist text-slate-700',
  primary: 'bg-primary-50 text-primary-700',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-accent-50 text-accent-700',
  danger: 'bg-red-50 text-red-700',
};

/**
 * @param {{ tone?: 'neutral'|'primary'|'success'|'warning'|'danger', className?: string }} props
 */
const Badge = ({ tone = 'neutral', className, children }) => (
  <span
    className={cn(
      'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
      TONE_CLASSES[tone] ?? TONE_CLASSES.neutral,
      className
    )}
  >
    {children}
  </span>
);

export default Badge;
