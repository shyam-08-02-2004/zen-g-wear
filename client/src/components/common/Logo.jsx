import { cn } from '../../utils/cn';

const SIZE_MAP = {
  sm: { mark: 32, text: 'text-base' },
  md: { mark: 48, text: 'text-lg' },
  lg: { mark: 64, text: 'text-2xl' },
};

const Logo = ({ size = 'md', withText = false, className, textClassName }) => {
  const { mark, text } = SIZE_MAP[size] ?? SIZE_MAP.md;

  return (
    <div className={cn('inline-flex items-center gap-2 select-none', className)}>
      <img src="/logo.png" alt="Zen-G Wear Logo" height={mark} className="object-contain" style={{ height: mark }} />
    </div>
  );
};

export default Logo;
