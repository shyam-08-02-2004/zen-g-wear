import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { Spinner } from './Loader';

const VARIANT_CLASSES = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-soft disabled:bg-primary-300',
  secondary:
    'bg-ink text-white hover:bg-ink-soft active:bg-ink shadow-soft disabled:bg-slate-400',
  outline:
    'border border-mist-dark bg-white text-ink hover:bg-cloud active:bg-mist disabled:text-slate-400 disabled:border-mist',
  ghost:
    'bg-transparent text-ink hover:bg-mist active:bg-mist-dark disabled:text-slate-400',
  danger:
    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-soft disabled:bg-red-300',
  link:
    'bg-transparent text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline p-0 h-auto disabled:text-slate-400',
};

const SIZE_CLASSES = {
  sm: 'h-8 px-3 text-sm gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm gap-2 rounded-lg',
  lg: 'h-12 px-6 text-base gap-2 rounded-xl',
};

const SPINNER_SIZE_BY_BUTTON_SIZE = { sm: 'xs', md: 'sm', lg: 'sm' };

/**
 * Core action control used everywhere in the app.
 *
 * @param {{
 *   variant?: 'primary'|'secondary'|'outline'|'ghost'|'danger'|'link',
 *   size?: 'sm'|'md'|'lg',
 *   isLoading?: boolean,
 *   loadingText?: string,
 *   leftIcon?: React.ReactNode,
 *   rightIcon?: React.ReactNode,
 *   fullWidth?: boolean,
 *   to?: string,   // renders a react-router <Link> instead of <button>
 *   href?: string, // renders a plain <a> instead of <button>
 * }} props
 */
const Button = forwardRef(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled = false,
      className,
      children,
      to,
      href,
      type = 'button',
      ...rest
    },
    ref
  ) => {
    const classes = cn(
      'inline-flex items-center justify-center font-medium transition-colors duration-150',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed',
      VARIANT_CLASSES[variant],
      variant !== 'link' && SIZE_CLASSES[size],
      fullWidth && 'w-full',
      className
    );

    const content = (
      <>
        {isLoading ? (
          <Spinner size={SPINNER_SIZE_BY_BUTTON_SIZE[size] ?? 'sm'} className="text-current" />
        ) : (
          leftIcon
        )}
        <span>{isLoading && loadingText ? loadingText : children}</span>
        {!isLoading && rightIcon}
      </>
    );

    if (to) {
      return (
        <Link ref={ref} to={to} className={classes} aria-disabled={disabled} {...rest}>
          {content}
        </Link>
      );
    }

    if (href) {
      return (
        <a ref={ref} href={href} className={classes} aria-disabled={disabled} {...rest}>
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={classes}
        {...rest}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
