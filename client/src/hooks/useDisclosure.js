import { useCallback, useState } from 'react';

/**
 * Tiny hook for the open/closed boolean pattern shared by modals, drawers,
 * and dropdown menus.
 * @param {boolean} initialValue
 * @returns {{ isOpen: boolean, open: () => void, close: () => void, toggle: () => void }}
 */
export const useDisclosure = (initialValue = false) => {
  const [isOpen, setIsOpen] = useState(initialValue);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, open, close, toggle };
};
