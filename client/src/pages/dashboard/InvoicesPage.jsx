import { useState } from 'react';
import { Search, FileText } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/forms/Input';
import Select from '../../components/forms/Select';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import PageHeader from '../../components/dashboard/PageHeader';
import StatusBadge from '../../components/dashboard/StatusBadge';
import ApiState from '../../components/dashboard/ApiState';
import { useApi } from '../../hooks/useApi';
import paymentsService from '../../services/paymentsService';

const STATUS_OPTIONS = [
  { value: 'completed', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
  { value: 'refunded', label: 'Refunded' },
  { value: 'failed', label: 'Failed' },
];

// NOTE: Zen-G Wear doesn't have a dedicated Invoice API yet — each
// completed payment already carries everything an invoice needs (amount,
// date, related order, status), so this page presents payments as your
// billing history rather than duplicating that data in a separate model.
const InvoicesPage = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const { data, loading, error, refetch } = useApi(
    () => paymentsService.getMyPayments({ search: search || undefined, status: status || undefined, page, limit: 10 }),
    [search, status, page]
  );

  return (
    <div>
      <PageHeader title="Invoices" description="Your billing history, generated from completed payments." />

      <Card padded={false}>
        <div className="flex flex-col gap-3 border-b border-mist p-4 sm:flex-row sm:items-center">
          <Input
            leftIcon={<Search size={16} />}
            placeholder="Search by transaction ID…"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            containerClassName="flex-1"
          />
          <Select
            options={STATUS_OPTIONS}
            placeholder="All statuses"
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
            className="sm:w-48"
          />
        </div>

        <div className="p-4">
          <ApiState
            loading={loading}
            error={error}
            onRetry={refetch}
            isEmpty={!data?.payments?.length}
            emptyProps={{
              icon: <FileText size={22} />,
              title: 'No invoices yet',
              description: 'Once you complete a payment for an order, it will appear here.',
            }}
          >
            <Table>
              <Table.Head>
                <Table.HeaderCell>Invoice</Table.HeaderCell>
                <Table.HeaderCell>Order</Table.HeaderCell>
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.HeaderCell>Method</Table.HeaderCell>
                <Table.HeaderCell>Amount</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
              </Table.Head>
              <Table.Body>
                {data?.payments?.map((payment) => (
                  <Table.Row key={payment._id}>
                    <Table.Cell className="font-mono text-xs font-medium text-ink">
                      {payment.transactionId}
                    </Table.Cell>
                    <Table.Cell>{payment.order?.orderNumber ?? '—'}</Table.Cell>
                    <Table.Cell>{new Date(payment.createdAt).toLocaleDateString()}</Table.Cell>
                    <Table.Cell className="capitalize">{payment.method?.replace('_', ' ')}</Table.Cell>
                    <Table.Cell className="font-medium text-ink">
                      ${payment.amount.toLocaleString()} {payment.currency}
                    </Table.Cell>
                    <Table.Cell>
                      <StatusBadge status={payment.status === 'completed' ? 'paid' : payment.status} />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>

            {data?.pages > 1 && (
              <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                <span>
                  Page {data.page} of {data.pages} · {data.total} invoices
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)}>
                    Next
                  </Button>
                </div>
              </div>
            )}
          </ApiState>
        </div>
      </Card>
    </div>
  );
};

export default InvoicesPage;
