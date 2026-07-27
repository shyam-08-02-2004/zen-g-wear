import Badge from '../ui/Badge';

const TONE_BY_STATUS = {
  // Orders
  pending: 'warning',
  processing: 'primary',
  active: 'success',
  completed: 'success',
  cancelled: 'neutral',
  failed: 'danger',
  // Payments
  refunded: 'neutral',
  // Tickets
  open: 'primary',
  in_progress: 'warning',
  resolved: 'success',
  closed: 'neutral',
  // Contact / generic
  new: 'primary',
  read: 'neutral',
  responded: 'success',
  archived: 'neutral',
  // Payment status on orders
  paid: 'success',
};

const LABEL_OVERRIDES = {
  in_progress: 'In progress',
};

const formatLabel = (status) =>
  LABEL_OVERRIDES[status] ??
  status
    .split('_')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');

/**
 * @param {{ status: string, className?: string }} props
 */
const StatusBadge = ({ status, className }) => (
  <Badge tone={TONE_BY_STATUS[status] ?? 'neutral'} className={className}>
    {formatLabel(status)}
  </Badge>
);

export default StatusBadge;
