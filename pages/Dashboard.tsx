
import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import ImageGenerationPage from './user/ImageGenerationPage';
import BuyCreditsPage from './user/BuyCreditsPage';
import HistoryPage from './user/HistoryPage';
import AdminDashboardPage from './admin/AdminDashboardPage';
import AdminUserManagementPage from './admin/AdminUserManagementPage';
import AdminPaymentsPage from './admin/AdminPaymentsPage';
import AdminSettingsPage from './admin/AdminSettingsPage';
import { useGlobalState } from '../hooks/useGlobalState';

const Dashboard: React.FC = () => {
  const [activePage, setActivePage] = useState('generate');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { state } = useGlobalState();
  const isAdmin = state.currentUser?.role === 'admin';

  const renderPage = () => {
    switch (activePage) {
      // User pages
      case 'generate':
        return <ImageGenerationPage />;
      case 'history':
        return <HistoryPage />;
      case 'buy-credits':
        return <BuyCreditsPage />;
      
      // Admin pages
      case 'admin-dashboard':
        return isAdmin ? <AdminDashboardPage /> : <p>Access Denied</p>;
      case 'admin-users':
        return isAdmin ? <AdminUserManagementPage /> : <p>Access Denied</p>;
      case 'admin-payments':
        return isAdmin ? <AdminPaymentsPage /> : <p>Access Denied</p>;
      case 'admin-settings':
        return isAdmin ? <AdminSettingsPage /> : <p>Access Denied</p>;
        
      default:
        return <ImageGenerationPage />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-950">
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage}
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-950 p-4 sm:p-6 lg:p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
