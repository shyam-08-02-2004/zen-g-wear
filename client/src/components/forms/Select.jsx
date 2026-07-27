import { forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';
import FormField from './FormField';

/**
 * @param {{ label?: string, error?: string, helperText?: string, required?: boolean, options: { value: string, label: string }[], placeholder?: string }} props
 */
const Select = forwardRef(
  (
    { label, error, helperText, required, options = [], placeholder, className, containerClassName, id, ...rest },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id || generatedId;

    return (
      <FormField
        label={label}
        htmlFor={selectId}
        required={required}
        error={error}
        helperText={helperText}
        className={containerClassName}
      >
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={!!error}
            defaultValue=""
            className={cn(
              'h-10 w-full appearance-none rounded-lg border bg-white pl-3 pr-9 text-sm text-ink',
              'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1',
              error ? 'border-red-400' : 'border-mist-dark focus:border-primary-500',
              'disabled:cursor-not-allowed disabled:bg-mist disabled:text-slate-400',
              className
            )}
            {...rest}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>
      </FormField>
    );
  }
);

Select.displayName = 'Select';

export default Select;
