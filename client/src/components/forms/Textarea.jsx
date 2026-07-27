import { forwardRef, useId } from 'react';
import { cn } from '../../utils/cn';
import FormField from './FormField';

const Textarea = forwardRef(
  ({ label, error, helperText, required, rows = 4, className, containerClassName, id, ...rest }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;

    return (
      <FormField
        label={label}
        htmlFor={textareaId}
        required={required}
        error={error}
        helperText={helperText}
        className={containerClassName}
      >
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          aria-invalid={!!error}
          className={cn(
            'w-full resize-y rounded-lg border bg-white px-3 py-2 text-sm text-ink placeholder:text-slate-400',
            'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1',
            error ? 'border-red-400' : 'border-mist-dark focus:border-primary-500',
            'disabled:cursor-not-allowed disabled:bg-mist disabled:text-slate-400',
            className
          )}
          {...rest}
        />
      </FormField>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
