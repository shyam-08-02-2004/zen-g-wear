import { cn } from '../../utils/cn';
import Logo from '../common/Logo';

const SPINNER_SIZES = {
  xs: { box: 14, dot: 4, ring: 'border' },
  sm: { box: 20, dot: 5, ring: 'border-2' },
  md: { box: 32, dot: 6, ring: 'border-2' },
  lg: { box: 48, dot: 8, ring: 'border-[3px]' },
};

/**
 * The orbit spinner — a satellite dot circling a quiet ring, echoing the
 * <Logo /> mark. Use `size="xs"|"sm"` inline inside buttons/inputs, and
 * `"md"|"lg"` for standalone loading states.
 */
export const Spinner = ({ size = 'md', className }) => {
  const { box, dot, ring } = SPINNER_SIZES[size] ?? SPINNER_SIZES.md;

  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn('relative inline-block shrink-0', className)}
      style={{ width: box, height: box }}
    >
      <span className={cn('absolute inset-0 rounded-full border-mist', ring)} />
      <span className="absolute inset-0 animate-orbit-spin">
        <span
          className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/4 rounded-full bg-accent-500"
          style={{ width: dot, height: dot }}
        />
      </span>
    </span>
  );
};

/** A single pulsing placeholder block — the base primitive for skeleton UIs. */
export const Skeleton = ({ className }) => (
  <div className={cn('animate-pulse rounded-md bg-mist', className)} />
);

/** A block of skeleton text lines with varying widths, for card/paragraph placeholders. */
export const SkeletonText = ({ lines = 3, className }) => (
  <div className={cn('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={cn('h-3', i === lines - 1 ? 'w-2/3' : 'w-full')}
      />
    ))}
  </div>
);

/**
 * A centered loading state for a whole section or page.
 * @param {{ label?: string, fullScreen?: boolean, className?: string }} props
 */
export const PageLoader = ({ label = 'Loading', fullScreen = false, className }) => (
  <div
    className={cn(
      'flex flex-col items-center justify-center gap-4 py-16 text-center',
      fullScreen && 'fixed inset-0 z-50 bg-cloud/90 backdrop-blur-sm',
      className
    )}
  >
    <Logo size="lg" withText={false} className="opacity-90" />
    <Spinner size="lg" />
    <p className="font-display text-sm font-medium text-slate-500">{label}…</p>
  </div>
);

export default Spinner;
