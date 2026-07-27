import { AlertTriangle } from 'lucide-react';
import { PageLoader } from '../ui/Loader';
import EmptyState from '../ui/EmptyState';
import Button from '../ui/Button';

/**
 * @param {{
 *   loading: boolean, error?: string|null, onRetry?: () => void,
 *   isEmpty?: boolean, emptyProps?: object, loadingLabel?: string,
 * }} props
 */
const ApiState = ({ loading, error, onRetry, isEmpty, emptyProps, loadingLabel = 'Loading', children }) => {
  if (loading) return <PageLoader label={loadingLabel} />;

  if (error) {
    return (
      <EmptyState
        icon={<AlertTriangle size={22} />}
        title="Couldn't load this"
        description={error}
        action={
          onRetry && (
            <Button variant="outline" onClick={onRetry}>
              Try again
            </Button>
          )
        }
      />
    );
  }

  if (isEmpty) return <EmptyState {...emptyProps} />;

  return children;
};

export default ApiState;
