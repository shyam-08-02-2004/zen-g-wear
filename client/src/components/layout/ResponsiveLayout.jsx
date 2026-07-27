import { useState } from 'react';
import { cn } from '../../utils/cn';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

/**
 * The single responsive shell every screen in the app renders inside of.
 * - Public/marketing pages: `<ResponsiveLayout navLinks={...} showFooter>`
 * - Dashboard pages: `<ResponsiveLayout withSidebar sidebarItems={...}>`
 *
 * Handles the mobile sidebar drawer state internally so pages don't have to.
 *
 * @param {{
 *   navLinks?: { label: string, to: string }[],
 *   withSidebar?: boolean,
 *   sidebarItems?: { label: string, to: string, icon?: React.ReactNode, badge?: React.ReactNode }[],
 *   unreadCount?: number,
 *   onNotificationsClick?: () => void,
 *   showFooter?: boolean,
 *   footerColumns?: object[],
 *   contentClassName?: string,
 * }} props
 */
const ResponsiveLayout = ({
  navLinks = [],
  withSidebar = false,
  sidebarItems = [],
  unreadCount = 0,
  onNotificationsClick,
  showFooter = false,
  footerColumns,
  contentClassName,
  children,
}) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-cloud">
      <Navbar
        navLinks={navLinks}
        onMenuClick={withSidebar ? () => setSidebarOpen((prev) => !prev) : undefined}
        unreadCount={unreadCount}
        onNotificationsClick={onNotificationsClick}
      />

      <div className="flex flex-1">
        {withSidebar && (
          <Sidebar items={sidebarItems} isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}

        <main className={cn('flex-1 px-4 py-6 sm:px-6 lg:px-8', contentClassName)}>
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>

      {showFooter && <Footer columns={footerColumns} />}
    </div>
  );
};

export default ResponsiveLayout;
