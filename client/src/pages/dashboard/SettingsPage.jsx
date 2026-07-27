import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import PageHeader from '../../components/dashboard/PageHeader';
import { notify } from '../../components/ui/Toast';
import { logout } from '../../redux/slices/authSlice';
import authService from '../../services/authService';
import { getErrorMessage } from '../../hooks/useApi';

const SettingsPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [deactivating, setDeactivating] = useState(false);

  const handleDeactivate = async () => {
    setDeactivating(true);
    try {
      await authService.deactivateAccount();
      dispatch(logout());
      notify.success('Your account has been deactivated');
      navigate('/');
    } catch (err) {
      notify.error(getErrorMessage(err));
    } finally {
      setDeactivating(false);
    }
  };

  return (
    <div>
      <PageHeader title="Settings" description="Account details and account-level actions." />

      <div className="space-y-6">
        <Card>
          <Card.Header>
            <h2 className="font-display text-base font-semibold text-ink">Account details</h2>
          </Card.Header>
          <Card.Body>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-400">Account created</dt>
                <dd className="mt-1 text-sm text-ink">
                  {userInfo?.createdAt ? new Date(userInfo.createdAt).toLocaleDateString() : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-400">Last login</dt>
                <dd className="mt-1 text-sm text-ink">
                  {userInfo?.lastLogin ? new Date(userInfo.lastLogin).toLocaleString() : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-400">Account role</dt>
                <dd className="mt-1 text-sm capitalize text-ink">{userInfo?.role}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-400">Email verified</dt>
                <dd className="mt-1 text-sm text-ink">{userInfo?.isEmailVerified ? 'Yes' : 'No'}</dd>
              </div>
            </dl>
          </Card.Body>
        </Card>

        <Card className="border-red-200">
          <Card.Header>
            <h2 className="flex items-center gap-2 font-display text-base font-semibold text-red-600">
              <AlertTriangle size={17} /> Danger zone
            </h2>
          </Card.Header>
          <Card.Body>
            <p>Deactivating your account will sign you out and disable access immediately. This can be reversed by contacting support.</p>
            <Button variant="danger" className="mt-4" onClick={() => setConfirmOpen(true)}>
              Deactivate account
            </Button>
          </Card.Body>
        </Card>
      </div>

      <Modal
        isOpen={isConfirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Deactivate your account?"
        description="You'll be logged out immediately and lose access until it's reactivated."
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" isLoading={deactivating} onClick={handleDeactivate}>
              Yes, deactivate
            </Button>
          </>
        }
      />
    </div>
  );
};

export default SettingsPage;
