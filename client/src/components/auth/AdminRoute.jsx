import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

/**
 * Wrap admin-only route trees with this as a layout route:
 *   <Route element={<AdminRoute />}>
 *     <Route path="/admin/*" element={<AdminShell />} />
 *   </Route>
 *
 * Unauthenticated visitors go to /login; authenticated non-admins go back
 * to their own dashboard rather than seeing a bare 403.
 */
const AdminRoute = () => {
  const { isAuthenticated, userInfo } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (userInfo?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
