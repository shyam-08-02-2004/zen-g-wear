import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

const SIZE_CLASSES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

/**
 * @param {{
 *   isOpen: boolean,
 *   onClose: () => void,
 *   title?: React.ReactNode,
 *   description?: React.ReactNode,
 *   footer?: React.ReactNode,
 *   size?: 'sm'|'md'|'lg'|'xl',
 *   closeOnBackdrop?: boolean,
 *   showCloseButton?: boolean,
 * }} props
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  footer,
  size = 'md',
  closeOnBackdrop = true,
  showCloseButton = true,
  children,
}) => {
  const dialogRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKeyDown);

    // Lock body scroll while the modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Move focus into the dialog for keyboard/screen-reader users
    dialogRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 animate-fade-in bg-ink/40 backdrop-blur-sm"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        tabIndex={-1}
        className={cn(
          'relative z-10 w-full animate-scale-in rounded-2xl bg-white p-6 shadow-soft-lg focus:outline-none',
          SIZE_CLASSES[size]
        )}
      >
        {(title || showCloseButton) && (
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              {title && (
                <h2 id="modal-title" className="font-display text-lg font-semibold text-ink">
                  {title}
                </h2>
              )}
              {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
            </div>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-mist hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}

        <div className="text-sm text-slate-600">{children}</div>

        {footer && <div className="mt-6 flex items-center justify-end gap-3">{footer}</div>}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
