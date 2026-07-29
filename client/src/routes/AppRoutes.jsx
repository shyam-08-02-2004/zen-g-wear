import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute.jsx';
import AdminRoute from '../components/auth/AdminRoute.jsx';
import DashboardShell from '../components/layout/DashboardShell.jsx';
import AdminShell from '../components/layout/AdminShell.jsx';
import StoreLayout from '../components/layout/StoreLayout.jsx';
import Home from '../pages/Home.jsx';
import Login from '../pages/auth/Login.jsx';
import Register from '../pages/auth/Register.jsx';
import ProductListing from '../pages/shop/ProductListing.jsx';
import ProductDetails from '../pages/shop/ProductDetails.jsx';
import CartPage from '../pages/shop/CartPage.jsx';
import CheckoutPage from '../pages/shop/CheckoutPage.jsx';
import OrderSuccessPage from '../pages/shop/OrderSuccessPage.jsx';

import DashboardOverview from '../pages/dashboard/DashboardOverview.jsx';
import ProfilePage from '../pages/dashboard/ProfilePage.jsx';
import WishlistPage from '../pages/dashboard/WishlistPage.jsx';
import OrdersPage from '../pages/dashboard/OrdersPage.jsx';
import InvoicesPage from '../pages/dashboard/InvoicesPage.jsx';
import BillingPage from '../pages/dashboard/BillingPage.jsx';
import NotificationsPage from '../pages/dashboard/NotificationsPage.jsx';
import TicketsPage from '../pages/dashboard/TicketsPage.jsx';
import TicketDetailPage from '../pages/dashboard/TicketDetailPage.jsx';
import SettingsPage from '../pages/dashboard/SettingsPage.jsx';

import AdminDashboardOverview from '../pages/admin/AdminDashboardOverview.jsx';
import AdminUsersPage from '../pages/admin/AdminUsersPage.jsx';
import AdminOrdersPage from '../pages/admin/AdminOrdersPage.jsx';
import AdminPaymentsPage from '../pages/admin/AdminPaymentsPage.jsx';
import AdminProductsPage from '../pages/admin/AdminProductsPage.jsx';
import AdminSupportPage from '../pages/admin/AdminSupportPage.jsx';
import AdminTicketDetailPage from '../pages/admin/AdminTicketDetailPage.jsx';
import AdminAnalyticsPage from '../pages/admin/AdminAnalyticsPage.jsx';
import AdminRevenuePage from '../pages/admin/AdminRevenuePage.jsx';
import AdminAbandonedCartsPage from '../pages/admin/AdminAbandonedCartsPage.jsx';
import AdminSettingsPage from '../pages/admin/AdminSettingsPage.jsx';

function AppRoutes() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Public Storefront with StoreLayout */}
      <Route element={<StoreLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<ProductListing />} />
        <Route path="/products" element={<Navigate to="/shop" replace />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/brands" element={<Navigate to="/shop" replace />} />
        
        {/* Protected Storefront Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
        </Route>
      </Route>

      {/* Protected Dashboard Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardShell />}>
          <Route index element={<DashboardOverview />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="invoices" element={<InvoicesPage />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="tickets" element={<TicketsPage />} />
          <Route path="tickets/:id" element={<TicketDetailPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminShell />}>
          <Route index element={<AdminDashboardOverview />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="payments" element={<AdminPaymentsPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="support" element={<AdminSupportPage />} />
          <Route path="support/:id" element={<AdminTicketDetailPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="revenue" element={<AdminRevenuePage />} />
          <Route path="abandoned-carts" element={<AdminAbandonedCartsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
