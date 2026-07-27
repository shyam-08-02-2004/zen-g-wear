import { Link } from 'react-router-dom';
import { HardDrive, ArrowUpRight } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import PageHeader from '../../components/dashboard/PageHeader';
import StatusBadge from '../../components/dashboard/StatusBadge';
import ApiState from '../../components/dashboard/ApiState';
import { useApi } from '../../hooks/useApi';
import filesService from '../../services/filesService';
import paymentsService from '../../services/paymentsService';

const formatBytes = (bytes = 0) => {
  if (bytes === 0) return '0 GB';
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
};

const RESOURCE_LABELS = { image: 'Images', video: 'Video', raw: 'Documents & other', auto: 'Other' };

const BillingPage = () => {
  const storage = useApi(() => filesService.getStorageStats(), []);
  const payments = useApi(() => paymentsService.getMyPayments({ limit: 5, sortBy: 'createdAt', order: 'desc' }), []);

  return (
    <div>
      <PageHeader title="Billing" description="Your plan, storage usage, and recent payments." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <Card.Header>
            <h2 className="font-display text-base font-semibold text-ink">Current plan</h2>
          </Card.Header>
          <Card.Body>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl font-semibold text-ink">Business</span>
              <Badge tone="primary">Active</Badge>
            </div>
            <p className="mt-1 text-sm text-slate-500">Rs 79/month, billed monthly</p>
            <Button to="/#pricing" variant="outline" size="sm" fullWidth className="mt-5">
              Compare plans
            </Button>
          </Card.Body>
        </Card>

        <Card className="lg:col-span-2">
          <Card.Header>
            <h2 className="flex items-center gap-2 font-display text-base font-semibold text-ink">
              <HardDrive size={17} /> Storage usage
            </h2>
          </Card.Header>
          <Card.Body>
            <ApiState loading={storage.loading} error={storage.error} onRetry={storage.refetch}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">
                  {formatBytes(storage.data?.storage?.used)} of {formatBytes(storage.data?.storage?.limit)} used
                </span>
                <span className="font-medium text-ink">{storage.data?.storage?.percentUsed ?? 0}%</span>
              </div>
              <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-mist">
                <div
                  className="h-full rounded-full bg-primary-600 transition-all"
                  style={{ width: `${Math.min(storage.data?.storage?.percentUsed ?? 0, 100)}%` }}
                />
              </div>

              {storage.data?.storage?.breakdown?.length > 0 && (
                <ul className="mt-5 space-y-2">
                  {storage.data.storage.breakdown.map((item) => (
                    <li key={item._id} className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">{RESOURCE_LABELS[item._id] ?? item._id}</span>
                      <span className="text-ink">
                        {formatBytes(item.totalBytes)} · {item.count} file(s)
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </ApiState>
          </Card.Body>
        </Card>
      </div>

      <Card className="mt-6">
        <Card.Header>
          <h2 className="font-display text-base font-semibold text-ink">Recent payments</h2>
          <Link
            to="/dashboard/invoices"
            className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            View all invoices <ArrowUpRight size={14} />
          </Link>
        </Card.Header>
        <Card.Body>
          <ApiState
            loading={payments.loading}
            error={payments.error}
            onRetry={payments.refetch}
            isEmpty={!payments.data?.payments?.length}
            emptyProps={{ title: 'No payments yet', description: 'Completed payments will show up here.' }}
          >
            <ul className="divide-y divide-mist">
              {payments.data?.payments?.map((payment) => (
                <li key={payment._id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-ink">{payment.transactionId}</p>
                    <p className="text-xs text-slate-500">{new Date(payment.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-ink">Rs {payment.amount.toLocaleString()}</span>
                    <StatusBadge status={payment.status === 'completed' ? 'paid' : payment.status} />
                  </div>
                </li>
              ))}
            </ul>
          </ApiState>
        </Card.Body>
      </Card>
    </div>
  );
};

export default BillingPage;
