import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

/**
 * Wrap private route trees with this as a layout route:
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/dashboard/*" element={<DashboardShell />} />
 *   </Route>
 */
const ProtectedRoute = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
