import { useState } from 'react';
import { Search, CreditCard } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/forms/Input';
import Select from '../../components/forms/Select';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import PageHeader from '../../components/dashboard/PageHeader';
import StatusBadge from '../../components/dashboard/StatusBadge';
import ApiState from '../../components/dashboard/ApiState';
import { useApi, getErrorMessage } from '../../hooks/useApi';
import paymentsService from '../../services/paymentsService';
import { notify } from '../../components/ui/Toast';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' },
];

const AdminPaymentsPage = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [draftStatus, setDraftStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const { data, loading, error, refetch, setData } = useApi(
    () => paymentsService.getAllPayments({ search: search || undefined, status: status || undefined, page, limit: 10 }),
    [search, status, page]
  );

  const openPayment = (payment) => {
    setSelected(payment);
    setDraftStatus(payment.status);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await paymentsService.updatePaymentStatus(selected._id, { status: draftStatus });
      const updated = res.data.data.payment;
      setData((prev) => ({
        ...prev,
        payments: prev.payments.map((p) => (p._id === updated._id ? { ...p, ...updated } : p)),
      }));
      notify.success(`Payment ${selected.transactionId} updated`);
      setSelected(null);
    } catch (err) {
      notify.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title="Payments" description="Every payment processed across the platform." />

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
            emptyProps={{ icon: <CreditCard size={22} />, title: 'No payments found' }}
          >
            <div className="overflow-x-auto custom-scrollbar">
              <Table className="min-w-[600px] hidden sm:table">
                <Table.Head>
                  <Table.HeaderCell>UTR / Txn ID</Table.HeaderCell>
                  <Table.HeaderCell>Customer</Table.HeaderCell>
                  <Table.HeaderCell>Method</Table.HeaderCell>
                  <Table.HeaderCell>Amount</Table.HeaderCell>
                  <Table.HeaderCell>Status</Table.HeaderCell>
                  <Table.HeaderCell>Date</Table.HeaderCell>
                </Table.Head>
                <Table.Body>
                  {data?.payments?.map((payment) => (
                    <Table.Row key={payment._id} className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => openPayment(payment)}>
                      <Table.Cell className="font-mono text-xs font-bold text-[#2874f0] uppercase">
                        {payment.transactionId || 'N/A'}
                      </Table.Cell>
                      <Table.Cell className="font-medium text-gray-900">{payment.user?.name || payment.order?.shippingAddress?.fullName || '—'}</Table.Cell>
                      <Table.Cell className="capitalize text-gray-600">{payment.method?.replace('_', ' ')}</Table.Cell>
                      <Table.Cell className="font-bold text-gray-900">₹{payment.amount.toLocaleString()}</Table.Cell>
                      <Table.Cell>
                        <StatusBadge status={payment.status} />
                      </Table.Cell>
                      <Table.Cell className="text-gray-500 text-xs">{new Date(payment.createdAt).toLocaleDateString()}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
              
              {/* Mobile View */}
              <div className="sm:hidden flex flex-col divide-y divide-gray-100">
                {data?.payments?.map((payment) => (
                  <div key={`mobile-${payment._id}`} className="p-4 flex flex-col gap-2 cursor-pointer hover:bg-gray-50" onClick={() => openPayment(payment)}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-sm text-gray-900">{payment.user?.name || payment.order?.shippingAddress?.fullName || 'Guest User'}</p>
                        <p className="font-mono text-[10px] text-[#2874f0] uppercase mt-0.5">{payment.transactionId || 'N/A'}</p>
                      </div>
                      <StatusBadge status={payment.status} />
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="font-bold text-sm text-gray-900">₹{payment.amount.toLocaleString()}</span>
                      <span className="capitalize text-xs text-gray-600 font-medium">
                        {payment.method?.replace('_', ' ')} • {new Date(payment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {payment.order?.orderItems?.length > 0 && (
                      <div className="mt-2 text-xs text-gray-500 bg-gray-100 p-2 rounded-sm border border-gray-200">
                        <span className="font-bold text-gray-700">Products:</span> {payment.order.orderItems.map(item => item.name).join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {data?.pages > 1 && (
              <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                <span>
                  Page {data.page} of {data.pages} · {data.total} payments
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

      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.transactionId}
        description={selected?.user?.email || selected?.order?.shippingAddress?.fullName || 'Guest User'}
        footer={
          <>
            <Button variant="outline" onClick={() => setSelected(null)}>
              Close
            </Button>
            <Button isLoading={saving} onClick={handleSave}>
              Save changes
            </Button>
          </>
        }
      >
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Amount</span>
              <span className="font-medium text-ink">
                ${selected.amount.toLocaleString()} {selected.currency}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Method</span>
              <span className="capitalize text-ink font-medium">{selected.method?.replace('_', ' ')}</span>
            </div>
            <div className="flex items-center justify-between text-sm bg-blue-50 p-3 rounded-md border border-blue-100">
              <span className="text-blue-800 font-bold">UTR / Txn ID</span>
              <span className="font-mono font-bold text-blue-900">{selected.transactionId}</span>
            </div>
            
            {selected.order?.orderItems?.length > 0 && (
              <div className="text-sm bg-gray-50 p-3 rounded-md border border-gray-200">
                <span className="block text-gray-700 font-bold mb-2">Product Details</span>
                <ul className="space-y-2">
                  {selected.order.orderItems.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-center text-xs text-gray-600 border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                      <span>{item.quantity}x {item.name}</span>
                      <span className="font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Select
              label="Payment status"
              options={STATUS_OPTIONS}
              value={draftStatus}
              onChange={(e) => setDraftStatus(e.target.value)}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminPaymentsPage;
