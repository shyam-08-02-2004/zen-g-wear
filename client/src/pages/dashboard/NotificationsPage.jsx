import { useState } from 'react';
import { Bell, Check, CheckCheck, Trash2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Select from '../../components/forms/Select';
import PageHeader from '../../components/dashboard/PageHeader';
import ApiState from '../../components/dashboard/ApiState';
import { useApi, getErrorMessage } from '../../hooks/useApi';
import notificationsService from '../../services/notificationsService';
import { notify } from '../../components/ui/Toast';
import { cn } from '../../utils/cn';

const TYPE_OPTIONS = [
  { value: 'order', label: 'Orders' },
  { value: 'payment', label: 'Payments' },
  { value: 'invoice', label: 'Invoices' },
  { value: 'ticket', label: 'Support tickets' },
  { value: 'system', label: 'System' },
  { value: 'promotion', label: 'Promotions' },
];

const NotificationsPage = () => {
  const [type, setType] = useState('');
  const [markingAll, setMarkingAll] = useState(false);

  const { data, loading, error, refetch, setData } = useApi(
    () => notificationsService.getMyNotifications({ type: type || undefined, limit: 20 }),
    [type]
  );

  const handleMarkAsRead = async (id) => {
    try {
      await notificationsService.markAsRead(id);
      setData((prev) => ({
        ...prev,
        notifications: prev.notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
        unreadCount: Math.max(0, (prev.unreadCount ?? 1) - 1),
      }));
    } catch (err) {
      notify.error(getErrorMessage(err));
    }
  };

  const handleMarkAllAsRead = async () => {
    setMarkingAll(true);
    try {
      await notificationsService.markAllAsRead();
      notify.success('All notifications marked as read');
      refetch();
    } catch (err) {
      notify.error(getErrorMessage(err));
    } finally {
      setMarkingAll(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationsService.deleteNotification(id);
      setData((prev) => ({ ...prev, notifications: prev.notifications.filter((n) => n._id !== id) }));
    } catch (err) {
      notify.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Updates about your orders, payments, and support tickets."
        action={
          <div className="flex items-center gap-3">
            <Select
              options={TYPE_OPTIONS}
              placeholder="All types"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-44"
            />
            <Button
              variant="outline"
              size="sm"
              leftIcon={<CheckCheck size={16} />}
              isLoading={markingAll}
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </Button>
          </div>
        }
      />

      <Card padded={false}>
        <ApiState
          loading={loading}
          error={error}
          onRetry={refetch}
          isEmpty={!data?.notifications?.length}
          emptyProps={{
            icon: <Bell size={22} />,
            title: "You're all caught up",
            description: 'New notifications will show up here as things happen on your account.',
          }}
        >
          <ul className="divide-y divide-mist">
            {data?.notifications?.map((n) => (
              <li
                key={n._id}
                className={cn('flex items-start justify-between gap-4 p-4', !n.isRead && 'bg-primary-50/40')}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                      n.isRead ? 'bg-transparent' : 'bg-primary-500'
                    )}
                  />
                  <div>
                    <p className="text-sm font-medium text-ink">{n.title}</p>
                    <p className="mt-0.5 text-sm text-slate-500">{n.message}</p>
                    <p className="mt-1 text-xs text-slate-400">{new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {!n.isRead && (
                    <button
                      type="button"
                      onClick={() => handleMarkAsRead(n._id)}
                      aria-label="Mark as read"
                      className="rounded-lg p-2 text-slate-400 hover:bg-mist hover:text-primary-600"
                    >
                      <Check size={16} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(n._id)}
                    aria-label="Delete notification"
                    className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </ApiState>
      </Card>
    </div>
  );
};

export default NotificationsPage;
