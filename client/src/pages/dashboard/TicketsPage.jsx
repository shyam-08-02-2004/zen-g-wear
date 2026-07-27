import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, LifeBuoy } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/forms/Input';
import Select from '../../components/forms/Select';
import Textarea from '../../components/forms/Textarea';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import PageHeader from '../../components/dashboard/PageHeader';
import StatusBadge from '../../components/dashboard/StatusBadge';
import ApiState from '../../components/dashboard/ApiState';
import { useApi, getErrorMessage } from '../../hooks/useApi';
import ticketsService from '../../services/ticketsService';
import { notify } from '../../components/ui/Toast';

const STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

const CATEGORY_OPTIONS = [
  { value: 'billing', label: 'Billing' },
  { value: 'technical', label: 'Technical' },
  { value: 'account', label: 'Account' },
  { value: 'general', label: 'General' },
  { value: 'other', label: 'Other' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const emptyForm = { subject: '', description: '', category: 'general', priority: 'medium' };

const TicketsPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [creating, setCreating] = useState(false);

  const { data, loading, error, refetch } = useApi(
    () => ticketsService.getMyTickets({ search: search || undefined, status: status || undefined, limit: 20 }),
    [search, status]
  );

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setCreating(true);
    try {
      const res = await ticketsService.createTicket(form);
      notify.success('Support ticket created');
      setCreateOpen(false);
      setForm(emptyForm);
      navigate(`/dashboard/tickets/${res.data.data.ticket._id}`);
    } catch (err) {
      const fieldErrors = {};
      (err?.response?.data?.errors ?? []).forEach((e2) => (fieldErrors[e2.field] = e2.message));
      setFormErrors(fieldErrors);
      notify.error(getErrorMessage(err));
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Support Tickets"
        description="Get help from our team — replies land right in the thread."
        action={
          <Button leftIcon={<Plus size={16} />} onClick={() => setCreateOpen(true)}>
            New ticket
          </Button>
        }
      />

      <Card padded={false}>
        <div className="flex flex-col gap-3 border-b border-mist p-4 sm:flex-row sm:items-center">
          <Input
            leftIcon={<Search size={16} />}
            placeholder="Search tickets…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            containerClassName="flex-1"
          />
          <Select
            options={STATUS_OPTIONS}
            placeholder="All statuses"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="sm:w-48"
          />
        </div>

        <div className="p-4">
          <ApiState
            loading={loading}
            error={error}
            onRetry={refetch}
            isEmpty={!data?.tickets?.length}
            emptyProps={{
              icon: <LifeBuoy size={22} />,
              title: 'No support tickets',
              description: 'Need help with something? Open a ticket and our team will jump in.',
              action: (
                <Button size="sm" onClick={() => setCreateOpen(true)}>
                  Open a ticket
                </Button>
              ),
            }}
          >
            <Table>
              <Table.Head>
                <Table.HeaderCell>Ticket</Table.HeaderCell>
                <Table.HeaderCell>Subject</Table.HeaderCell>
                <Table.HeaderCell>Category</Table.HeaderCell>
                <Table.HeaderCell>Priority</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell>Updated</Table.HeaderCell>
              </Table.Head>
              <Table.Body>
                {data?.tickets?.map((ticket) => (
                  <Table.Row
                    key={ticket._id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/dashboard/tickets/${ticket._id}`)}
                  >
                    <Table.Cell className="font-mono text-xs font-medium text-ink">{ticket.ticketNumber}</Table.Cell>
                    <Table.Cell className="max-w-xs truncate text-ink">{ticket.subject}</Table.Cell>
                    <Table.Cell className="capitalize">{ticket.category}</Table.Cell>
                    <Table.Cell className="capitalize">{ticket.priority}</Table.Cell>
                    <Table.Cell>
                      <StatusBadge status={ticket.status} />
                    </Table.Cell>
                    <Table.Cell>{new Date(ticket.updatedAt).toLocaleDateString()}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </ApiState>
        </div>
      </Card>

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setCreateOpen(false)}
        title="Open a support ticket"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button form="create-ticket-form" type="submit" isLoading={creating}>
              Submit ticket
            </Button>
          </>
        }
      >
        <form id="create-ticket-form" onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Subject"
            required
            value={form.subject}
            error={formErrors.subject}
            onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              options={CATEGORY_OPTIONS}
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            />
            <Select
              label="Priority"
              options={PRIORITY_OPTIONS}
              value={form.priority}
              onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
            />
          </div>
          <Textarea
            label="Description"
            required
            rows={5}
            value={form.description}
            error={formErrors.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
        </form>
      </Modal>
    </div>
  );
};

export default TicketsPage;
