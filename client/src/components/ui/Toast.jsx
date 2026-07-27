import toast from 'react-hot-toast';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '../../utils/cn';

const TONE_CONFIG = {
  success: { icon: CheckCircle2, bar: 'bg-emerald-500', iconColor: 'text-emerald-500' },
  error: { icon: XCircle, bar: 'bg-red-500', iconColor: 'text-red-500' },
  info: { icon: Info, bar: 'bg-primary-500', iconColor: 'text-primary-500' },
  warning: { icon: AlertTriangle, bar: 'bg-accent-500', iconColor: 'text-accent-600' },
};

/** The actual card rendered for every toast — a colored accent bar + icon + message + dismiss. */
const ToastCard = ({ t, tone = 'info', message }) => {
  const { icon: Icon, bar, iconColor } = TONE_CONFIG[tone] ?? TONE_CONFIG.info;

  return (
    <div
      className={cn(
        'pointer-events-auto flex w-80 max-w-[90vw] items-start gap-3 overflow-hidden rounded-xl bg-white p-4 shadow-soft-lg',
        t.visible ? 'animate-slide-in-right' : 'opacity-0'
      )}
    >
      <span className={cn('absolute inset-y-0 left-0 w-1', bar)} aria-hidden="true" />
      <Icon size={20} className={cn('mt-0.5 shrink-0', iconColor)} aria-hidden="true" />
      <p className="flex-1 text-sm text-ink">{message}</p>
      <button
        type="button"
        onClick={() => toast.dismiss(t.id)}
        aria-label="Dismiss notification"
        className="shrink-0 rounded p-0.5 text-slate-400 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      >
        <X size={16} />
      </button>
    </div>
  );
};

const show = (tone, message, options) =>
  toast.custom((t) => <ToastCard t={t} tone={tone} message={message} />, {
    duration: 4000,
    ...options,
  });

/**
 * Imperative notification API — call from anywhere, no provider needed
 * beyond the <Toaster /> already mounted in main.jsx.
 *
 *   notify.success('Order placed successfully')
 *   notify.error('Could not save changes')
 */
export const notify = {
  success: (message, options) => show('success', message, options),
  error: (message, options) => show('error', message, options),
  info: (message, options) => show('info', message, options),
  warning: (message, options) => show('warning', message, options),
  dismiss: (id) => toast.dismiss(id),
};

export default ToastCard;
