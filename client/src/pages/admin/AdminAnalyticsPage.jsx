import { useMemo } from 'react';
import { Users, ShoppingCart, LifeBuoy } from 'lucide-react';
import {
  BarChart,
  Bar,
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
import Card from '../../components/ui/Card';
import PageHeader from '../../components/dashboard/PageHeader';
import ApiState from '../../components/dashboard/ApiState';
import { useApi } from '../../hooks/useApi';
import { bucketByMonth, countBy } from '../../utils/chartData';
import usersAdminService from '../../services/usersAdminService';
import ordersService from '../../services/ordersService';
import ticketsService from '../../services/ticketsService';

const PIE_COLORS = ['#2454FF', '#F5A623', '#10B981', '#8FB0FF', '#EF4444', '#64748B'];

const AdminAnalyticsPage = () => {
  const users = useApi(() => usersAdminService.getUsers({ limit: 200, sortBy: 'createdAt', order: 'asc' }), []);
  const orders = useApi(() => ordersService.getAllOrders({ limit: 200 }), []);
  const tickets = useApi(() => ticketsService.getAllTickets({ limit: 200 }), []);

  const signupSeries = useMemo(() => bucketByMonth(users.data?.users, 'createdAt', () => 1, 6), [users.data]);
  const ordersByStatus = useMemo(() => countBy(orders.data?.orders ?? [], (o) => o.status), [orders.data]);
  const ticketsByCategory = useMemo(() => countBy(tickets.data?.tickets ?? [], (t) => t.category), [tickets.data]);

  const loading = users.loading || orders.loading || tickets.loading;

  return (
    <div>
      <PageHeader title="Analytics" description="Growth and activity patterns across the platform." />

      <ApiState loading={loading} error={users.error || orders.error || tickets.error}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <Card.Header>
              <h2 className="flex items-center gap-2 font-display text-base font-semibold text-ink">
                <Users size={17} /> New signups, last 6 months
              </h2>
            </Card.Header>
            <Card.Body>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={signupSeries} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#DCE3EE" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} width={36} allowDecimals={false} />
                    <Tooltip contentStyle={{ borderRadius: 12, borderColor: '#DCE3EE', fontSize: 13 }} />
                    <Bar dataKey="value" name="New users" fill="#2454FF" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h2 className="flex items-center gap-2 font-display text-base font-semibold text-ink">
                <ShoppingCart size={17} /> Orders by status
              </h2>
            </Card.Header>
            <Card.Body>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ordersByStatus}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={2}
                    >
                      {ordersByStatus.map((entry, i) => (
                        <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, borderColor: '#DCE3EE', fontSize: 13 }} />
                    <Legend
                      formatter={(value) => <span className="text-xs capitalize text-slate-600">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </div>

        <Card className="mt-6">
          <Card.Header>
            <h2 className="flex items-center gap-2 font-display text-base font-semibold text-ink">
              <LifeBuoy size={17} /> Support tickets by category
            </h2>
          </Card.Header>
          <Card.Body>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ticketsByCategory} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DCE3EE" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 12, fill: '#64748B' }}
                    axisLine={false}
                    tickLine={false}
                    width={90}
                    tickFormatter={(v) => v[0].toUpperCase() + v.slice(1)}
                  />
                  <Tooltip contentStyle={{ borderRadius: 12, borderColor: '#DCE3EE', fontSize: 13 }} />
                  <Bar dataKey="value" name="Tickets" fill="#F5A623" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card.Body>
        </Card>
      </ApiState>
    </div>
  );
};

export default AdminAnalyticsPage;
