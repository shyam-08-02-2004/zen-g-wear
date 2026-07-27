import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, Send } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Select from '../../components/forms/Select';
import Textarea from '../../components/forms/Textarea';
import ApiState from '../../components/dashboard/ApiState';
import StatusBadge from '../../components/dashboard/StatusBadge';
import { useApi, getErrorMessage } from '../../hooks/useApi';
import ticketsService from '../../services/ticketsService';
import { notify } from '../../components/ui/Toast';
import { cn } from '../../utils/cn';

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

const AdminTicketDetailPage = () => {
  const { id } = useParams();
  const { userInfo } = useSelector((state) => state.auth);

  const { data, loading, error, refetch, setData } = useApi(() => ticketsService.getTicket(id), [id]);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    setSending(true);
    try {
      const res = await ticketsService.addMessage(id, { message: reply });
      setData({ ticket: res.data.data.ticket });
      setReply('');
    } catch (err) {
      notify.error(getErrorMessage(err));
    } finally {
      setSending(false);
    }
  };

  const handleFieldChange = async (field, value) => {
    setUpdating(true);
    try {
      const res = await ticketsService.updateTicket(id, { [field]: value });
      setData({ ticket: res.data.data.ticket });
      notify.success('Ticket updated');
    } catch (err) {
      notify.error(getErrorMessage(err));
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      <Link
        to="/admin/support"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-ink"
      >
        <ArrowLeft size={16} /> Back to support
      </Link>

      <ApiState loading={loading} error={error} onRetry={refetch}>
        {data?.ticket && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <p className="font-mono text-xs text-slate-400">{data.ticket.ticketNumber}</p>
              <h1 className="mt-1 font-display text-2xl font-semibold text-ink">{data.ticket.subject}</h1>
              <p className="mt-1 text-sm text-slate-500">
                {data.ticket.user?.name} · {data.ticket.user?.email}
              </p>

              <Card className="mt-5">
                <div className="space-y-5">
                  {data.ticket.messages?.map((msg, i) => {
                    const isCustomer = (msg.sender?._id ?? msg.sender) === data.ticket.user?._id;
                    return (
                      <div key={i} className={cn('flex', isCustomer ? 'justify-start' : 'justify-end')}>
                        <div
                          className={cn(
                            'max-w-md rounded-2xl px-4 py-3 text-sm',
                            isCustomer ? 'bg-cloud text-ink' : 'bg-primary-600 text-white'
                          )}
                        >
                          <p className="mb-1 text-xs font-medium opacity-70">
                            {(msg.sender?._id ?? msg.sender) === userInfo?._id ? 'You' : msg.sender?.name ?? 'Support'}
                          </p>
                          <p className="leading-relaxed">{msg.message}</p>
                          <p className="mt-1.5 text-[11px] opacity-60">{new Date(msg.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <form onSubmit={handleReply} className="mt-6 flex items-start gap-3 border-t border-mist pt-5">
                  <Textarea
                    placeholder="Reply as support…"
                    rows={2}
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    containerClassName="flex-1"
                  />
                  <Button type="submit" isLoading={sending} leftIcon={<Send size={16} />}>
                    Send
                  </Button>
                </form>
              </Card>
            </div>

            <div>
              <Card>
                <Card.Header>
                  <h2 className="font-display text-base font-semibold text-ink">Ticket details</h2>
                </Card.Header>
                <Card.Body className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Current status</span>
                    <StatusBadge status={data.ticket.status} />
                  </div>
                  <Select
                    label="Update status"
                    options={STATUS_OPTIONS}
                    value={data.ticket.status}
                    disabled={updating}
                    onChange={(e) => handleFieldChange('status', e.target.value)}
                  />
                  <Select
                    label="Priority"
                    options={PRIORITY_OPTIONS}
                    value={data.ticket.priority}
                    disabled={updating}
                    onChange={(e) => handleFieldChange('priority', e.target.value)}
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Category</span>
                    <span className="capitalize text-ink">{data.ticket.category}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Opened</span>
                    <span className="text-ink">{new Date(data.ticket.createdAt).toLocaleDateString()}</span>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        )}
      </ApiState>
    </div>
  );
};

export default AdminTicketDetailPage;
