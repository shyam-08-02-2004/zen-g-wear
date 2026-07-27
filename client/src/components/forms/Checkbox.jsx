import { forwardRef, useId } from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * @param {{ label?: React.ReactNode, error?: string, helperText?: string }} props
 */
const Checkbox = forwardRef(
  ({ label, error, helperText, className, id, ...rest }, ref) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;

    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={checkboxId} className={cn('inline-flex cursor-pointer items-center gap-2', className)}>
          <span className="relative inline-flex h-5 w-5 shrink-0 items-center justify-center">
            <input
              ref={ref}
              id={checkboxId}
              type="checkbox"
              className="peer h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-md border border-mist-dark bg-white transition-colors checked:border-primary-600 checked:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1"
              {...rest}
            />
            <Check
              size={14}
              strokeWidth={3}
              className="pointer-events-none absolute text-white opacity-0 peer-checked:opacity-100"
            />
          </span>
          {label && <span className="text-sm text-ink">{label}</span>}
        </label>
        {error ? (
          <p className="text-xs font-medium text-red-600">{error}</p>
        ) : (
          helperText && <p className="text-xs text-slate-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
