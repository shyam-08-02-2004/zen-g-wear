import { cn } from '../../utils/cn';

/**
 * Wraps a field with a consistent label, required-indicator, helper text,
 * and error message. Used internally by Input/Textarea/Select/Checkbox,
 * and exported for building custom fields with the same look.
 *
 * @param {{ label?: string, htmlFor?: string, required?: boolean, error?: string, helperText?: string, className?: string }} props
 */
const FormField = ({ label, htmlFor, required, error, helperText, className, children }) => (
  <div className={cn('flex flex-col gap-1.5', className)}>
    {label && (
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
    )}
    {children}
    {error ? (
      <p className="text-xs font-medium text-red-600">{error}</p>
    ) : (
      helperText && <p className="text-xs text-slate-500">{helperText}</p>
    )}
  </div>
);

export default FormField;
