import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LifeBuoy } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/forms/Input';
import Select from '../../components/forms/Select';
import Table from '../../components/ui/Table';
import PageHeader from '../../components/dashboard/PageHeader';
import StatusBadge from '../../components/dashboard/StatusBadge';
import ApiState from '../../components/dashboard/ApiState';
import { useApi } from '../../hooks/useApi';
import ticketsService from '../../services/ticketsService';

const STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const AdminSupportPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [page, setPage] = useState(1);

  const { data, loading, error, refetch } = useApi(
    () =>
      ticketsService.getAllTickets({
        search: search || undefined,
        status: status || undefined,
        priority: priority || undefined,
        page,
        limit: 15,
      }),
    [search, status, priority, page]
  );

  return (
    <div>
      <PageHeader title="Support" description="Every ticket raised by a customer, across the platform." />

      <Card padded={false}>
        <div className="flex flex-col gap-3 border-b border-mist p-4 sm:flex-row sm:items-center">
          <Input
            leftIcon={<Search size={16} />}
            placeholder="Search tickets…"
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
            className="sm:w-44"
          />
          <Select
            options={PRIORITY_OPTIONS}
            placeholder="All priorities"
            value={priority}
            onChange={(e) => {
              setPage(1);
              setPriority(e.target.value);
            }}
            className="sm:w-44"
          />
        </div>

        <div className="p-4">
          <ApiState
            loading={loading}
            error={error}
            onRetry={refetch}
            isEmpty={!data?.tickets?.length}
            emptyProps={{ icon: <LifeBuoy size={22} />, title: 'No tickets found' }}
          >
            <Table>
              <Table.Head>
                <Table.HeaderCell>Ticket</Table.HeaderCell>
                <Table.HeaderCell>Customer</Table.HeaderCell>
                <Table.HeaderCell>Subject</Table.HeaderCell>
                <Table.HeaderCell>Priority</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Updated</Table.HeaderCell>
              </Table.Head>
              <Table.Body>
                {data?.tickets?.map((ticket) => (
                  <Table.Row
                    key={ticket._id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/admin/support/${ticket._id}`)}
                  >
                    <Table.Cell className="font-mono text-xs font-medium text-ink">{ticket.ticketNumber}</Table.Cell>
                    <Table.Cell>{ticket.user?.name ?? '—'}</Table.Cell>
                    <Table.Cell className="max-w-xs truncate text-ink">{ticket.subject}</Table.Cell>
                    <Table.Cell className="capitalize">{ticket.priority}</Table.Cell>
                    <Table.Cell>
                      <StatusBadge status={ticket.status} />
                    </Table.Cell>
                    <Table.Cell>{new Date(ticket.updatedAt).toLocaleDateString()}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>

            {data?.pages > 1 && (
              <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                <span>
                  Page {data.page} of {data.pages} · {data.total} tickets
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

export default AdminSupportPage;
