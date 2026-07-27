import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ArrowLeft, Send } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Textarea from '../../components/forms/Textarea';
import ApiState from '../../components/dashboard/ApiState';
import StatusBadge from '../../components/dashboard/StatusBadge';
import { useApi, getErrorMessage } from '../../hooks/useApi';
import ticketsService from '../../services/ticketsService';
import { notify } from '../../components/ui/Toast';
import { cn } from '../../utils/cn';

const TicketDetailPage = () => {
  const { id } = useParams();
  const { userInfo } = useSelector((state) => state.auth);

  const { data, loading, error, refetch, setData } = useApi(() => ticketsService.getTicket(id), [id]);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

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

  return (
    <div>
      <Link
        to="/dashboard/tickets"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-ink"
      >
        <ArrowLeft size={16} /> Back to tickets
      </Link>

      <ApiState loading={loading} error={error} onRetry={refetch}>
        {data?.ticket && (
          <>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-mono text-xs text-slate-400">{data.ticket.ticketNumber}</p>
                <h1 className="mt-1 font-display text-2xl font-semibold text-ink">{data.ticket.subject}</h1>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={data.ticket.status} />
                <span className="text-xs capitalize text-slate-500">{data.ticket.priority} priority</span>
              </div>
            </div>

            <Card>
              <div className="space-y-5">
                {data.ticket.messages?.map((msg, i) => {
                  const isMe = (msg.sender?._id ?? msg.sender) === userInfo?._id;
                  return (
                    <div key={i} className={cn('flex', isMe ? 'justify-end' : 'justify-start')}>
                      <div
                        className={cn(
                          'max-w-md rounded-2xl px-4 py-3 text-sm',
                          isMe ? 'bg-primary-600 text-white' : 'bg-cloud text-ink'
                        )}
                      >
                        <p className="mb-1 text-xs font-medium opacity-70">
                          {isMe ? 'You' : msg.sender?.name ?? 'Support'}
                        </p>
                        <p className="leading-relaxed">{msg.message}</p>
                        <p className="mt-1.5 text-[11px] opacity-60">
                          {new Date(msg.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {!['closed'].includes(data.ticket.status) && (
                <form onSubmit={handleReply} className="mt-6 flex items-start gap-3 border-t border-mist pt-5">
                  <Textarea
                    placeholder="Type your reply…"
                    rows={2}
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    containerClassName="flex-1"
                  />
                  <Button type="submit" isLoading={sending} leftIcon={<Send size={16} />}>
                    Send
                  </Button>
                </form>
              )}
            </Card>
          </>
        )}
      </ApiState>
    </div>
  );
};

export default TicketDetailPage;
