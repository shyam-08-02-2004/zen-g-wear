import clsx from 'clsx';

/**
 * Combines conditional className fragments into a single string.
 * Thin wrapper around clsx so the whole component library shares
 * one consistent way to build class strings.
 */
export const cn = (...inputs) => clsx(...inputs);
