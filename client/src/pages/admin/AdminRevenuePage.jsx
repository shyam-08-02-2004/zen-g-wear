import { useMemo } from 'react';
import { DollarSign, Receipt, TrendingUp } from 'lucide-react';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import Card, { StatCard } from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import PageHeader from '../../components/dashboard/PageHeader';
import ApiState from '../../components/dashboard/ApiState';
import { useApi } from '../../hooks/useApi';
import { bucketByMonth } from '../../utils/chartData';
import paymentsService from '../../services/paymentsService';

const PIE_COLORS = ['#2454FF', '#F5A623', '#10B981', '#8FB0FF', '#EF4444', '#64748B'];

const METHOD_LABELS = {
  card: 'Card',
  paypal: 'PayPal',
  bank_transfer: 'Bank transfer',
  wallet: 'Wallet',
  stripe: 'Stripe',
  razorpay: 'Razorpay',
};

const AdminRevenuePage = () => {
  const { data, loading, error, refetch } = useApi(() => paymentsService.getAllPayments({ limit: 200 }), []);

  const completed = useMemo(() => (data?.payments ?? []).filter((p) => p.status !== 'failed' && p.status !== 'refunded'), [data]);
  const totalRevenue = useMemo(() => completed.reduce((s, p) => s + p.amount, 0), [completed]);
  const avgOrderValue = completed.length ? totalRevenue / completed.length : 0;
  const revenueSeries = useMemo(() => bucketByMonth(completed, 'createdAt', (p) => p.amount, 6), [completed]);

  const revenueByMethod = useMemo(() => {
    const totals = {};
    completed.forEach((p) => {
      totals[p.method] = (totals[p.method] ?? 0) + p.amount;
    });
    return Object.entries(totals).map(([method, value]) => ({ name: METHOD_LABELS[method] ?? method, value }));
  }, [completed]);

  const topTransactions = useMemo(
    () => [...completed].sort((a, b) => b.amount - a.amount).slice(0, 8),
    [completed]
  );

  return (
    <div>
      <PageHeader title="Revenue" description="Money moving through Zen-G Wear." />

      <ApiState loading={loading} error={error} onRetry={refetch}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Total revenue (recent)" value={`Rs ${totalRevenue.toLocaleString()}`} icon={<DollarSign size={20} />} />
          <StatCard label="Total valid payments" value={completed.length} icon={<Receipt size={20} />} />
          <StatCard label="Average payment" value={`Rs ${avgOrderValue.toFixed(2)}`} icon={<TrendingUp size={20} />} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <Card.Header>
              <h2 className="font-display text-base font-semibold text-ink">Revenue trend</h2>
            </Card.Header>
            <Card.Body>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueSeries} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revenuePageGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2454FF" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#2454FF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#DCE3EE" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} width={48} />
                    <Tooltip
                      formatter={(value) => [`Rs ${value.toLocaleString()}`, 'Revenue']}
                      contentStyle={{ borderRadius: 12, borderColor: '#DCE3EE', fontSize: 13 }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#2454FF" strokeWidth={2} fill="url(#revenuePageGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h2 className="font-display text-base font-semibold text-ink">By payment method</h2>
            </Card.Header>
            <Card.Body>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={revenueByMethod} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                      {revenueByMethod.map((entry, i) => (
                        <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`Rs ${value.toLocaleString()}`, 'Revenue']}
                      contentStyle={{ borderRadius: 12, borderColor: '#DCE3EE', fontSize: 13 }}
                    />
                    <Legend formatter={(value) => <span className="text-xs text-slate-600">{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </div>

        <Card className="mt-6" padded={false}>
          <Card.Header className="p-5">
            <h2 className="font-display text-base font-semibold text-ink">Top transactions</h2>
          </Card.Header>
          <div className="px-5 pb-5">
            <Table>
              <Table.Head>
                <Table.HeaderCell>Transaction</Table.HeaderCell>
                <Table.HeaderCell>Method</Table.HeaderCell>
                <Table.HeaderCell>Amount</Table.HeaderCell>
                <Table.HeaderCell>Date</Table.HeaderCell>
              </Table.Head>
              <Table.Body>
                {topTransactions.map((p) => (
                  <Table.Row key={p._id}>
                    <Table.Cell className="font-mono text-xs font-medium text-ink">{p.transactionId}</Table.Cell>
                    <Table.Cell className="capitalize">{METHOD_LABELS[p.method] ?? p.method}</Table.Cell>
                    <Table.Cell className="font-medium text-ink">Rs {p.amount.toLocaleString()}</Table.Cell>
                    <Table.Cell>{new Date(p.createdAt).toLocaleDateString()}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </Card>
      </ApiState>
    </div>
  );
};

export default AdminRevenuePage;
