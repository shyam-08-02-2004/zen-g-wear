import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute.jsx';
import AdminRoute from '../components/auth/AdminRoute.jsx';
import StoreLayout from '../components/layout/StoreLayout.jsx';

// Core layout components are kept static for immediate render
import DashboardShell from '../components/layout/DashboardShell.jsx';
import AdminShell from '../components/layout/AdminShell.jsx';

// Public Pages (Lazy Loaded)
const Home = React.lazy(() => import('../pages/Home.jsx'));
const Login = React.lazy(() => import('../pages/auth/Login.jsx'));
const Register = React.lazy(() => import('../pages/auth/Register.jsx'));
const ForgotPassword = React.lazy(() => import('../pages/auth/ForgotPassword.jsx'));
const ResetPassword = React.lazy(() => import('../pages/auth/ResetPassword.jsx'));
const ProductListing = React.lazy(() => import('../pages/shop/ProductListing.jsx'));
const ProductDetails = React.lazy(() => import('../pages/shop/ProductDetails.jsx'));
const CartPage = React.lazy(() => import('../pages/shop/CartPage.jsx'));
const CheckoutPage = React.lazy(() => import('../pages/shop/CheckoutPage.jsx'));
const OrderTracking = React.lazy(() => import('../pages/shop/OrderTracking.jsx'));

// User Dashboard Pages (Lazy Loaded)
const DashboardOverview = React.lazy(() => import('../pages/dashboard/DashboardOverview.jsx'));
const ProfilePage = React.lazy(() => import('../pages/dashboard/ProfilePage.jsx'));
const AddressesPage = React.lazy(() => import('../pages/dashboard/AddressesPage.jsx'));
const WishlistPage = React.lazy(() => import('../pages/dashboard/WishlistPage.jsx'));
const OrdersPage = React.lazy(() => import('../pages/dashboard/OrdersPage.jsx'));
const InvoicesPage = React.lazy(() => import('../pages/dashboard/InvoicesPage.jsx'));
const BillingPage = React.lazy(() => import('../pages/dashboard/BillingPage.jsx'));
const NotificationsPage = React.lazy(() => import('../pages/dashboard/NotificationsPage.jsx'));
const TicketsPage = React.lazy(() => import('../pages/dashboard/TicketsPage.jsx'));
const TicketDetailPage = React.lazy(() => import('../pages/dashboard/TicketDetailPage.jsx'));
const SettingsPage = React.lazy(() => import('../pages/dashboard/SettingsPage.jsx'));

// Admin Pages (Lazy Loaded)
const AdminDashboardOverview = React.lazy(() => import('../pages/admin/AdminDashboardOverview.jsx'));
const AdminUsersPage = React.lazy(() => import('../pages/admin/AdminUsersPage.jsx'));
const AdminOrdersPage = React.lazy(() => import('../pages/admin/AdminOrdersPage.jsx'));
const AdminPaymentsPage = React.lazy(() => import('../pages/admin/AdminPaymentsPage.jsx'));
const AdminProductsPage = React.lazy(() => import('../pages/admin/AdminProductsPage.jsx'));
const AdminSupportPage = React.lazy(() => import('../pages/admin/AdminSupportPage.jsx'));
const AdminTicketDetailPage = React.lazy(() => import('../pages/admin/AdminTicketDetailPage.jsx'));
const AdminAnalyticsPage = React.lazy(() => import('../pages/admin/AdminAnalyticsPage.jsx'));
const AdminAIInsightsPage = React.lazy(() => import('../pages/admin/AdminAIInsightsPage.jsx'));
const AdminRevenuePage = React.lazy(() => import('../pages/admin/AdminRevenuePage.jsx'));
const AdminAbandonedCartsPage = React.lazy(() => import('../pages/admin/AdminAbandonedCartsPage.jsx'));
const AdminSettingsPage = React.lazy(() => import('../pages/admin/AdminSettingsPage.jsx'));

// A sleek, minimal loading fallback similar to modern e-commerce apps
const SuspenseFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-white">
    <div className="w-10 h-10 border-4 border-[#2874f0] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function AppRoutes() {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

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
            <Route path="/track-order" element={<OrderTracking />} />
          </Route>
        </Route>

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardShell />}>
            <Route index element={<DashboardOverview />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="addresses" element={<AddressesPage />} />
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

        {/* Admin Routes */}
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
            <Route path="insights" element={<AdminAIInsightsPage />} />
            <Route path="revenue" element={<AdminRevenuePage />} />
            <Route path="abandoned-carts" element={<AdminAbandonedCartsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
