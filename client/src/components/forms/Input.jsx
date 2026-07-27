import { forwardRef, useId } from 'react';
import { cn } from '../../utils/cn';
import FormField from './FormField';

/**
 * @param {{
 *   label?: string, error?: string, helperText?: string, required?: boolean,
 *   leftIcon?: React.ReactNode, rightIcon?: React.ReactNode, containerClassName?: string,
 * }} props
 */
const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      required,
      leftIcon,
      rightIcon,
      className,
      containerClassName,
      id,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <FormField
        label={label}
        htmlFor={inputId}
        required={required}
        error={error}
        helperText={helperText}
        className={containerClassName}
      >
        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            className={cn(
              'h-10 w-full rounded-lg border bg-white px-3 text-sm text-ink placeholder:text-slate-400',
              'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1',
              error ? 'border-red-400' : 'border-mist-dark focus:border-primary-500',
              leftIcon && 'pl-9',
              rightIcon && 'pr-9',
              'disabled:cursor-not-allowed disabled:bg-mist disabled:text-slate-400',
              className
            )}
            {...rest}
          />
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {rightIcon}
            </span>
          )}
        </div>
      </FormField>
    );
  }
);

Input.displayName = 'Input';

export default Input;
