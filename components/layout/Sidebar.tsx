
import React from 'react';
import { useGlobalState } from '../../hooks/useGlobalState';
import { APP_NAME } from '../../config';
import { 
    ImageIcon, CreditCardIcon, UsersIcon, CheckCircleIcon, SettingsIcon, LayoutDashboardIcon, SparklesIcon, XIcon, HistoryIcon,
    YouTubeIcon, TikTokIcon
} from '../icons';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  page: string;
  activePage: string;
  onClick: (page: string) => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, page, activePage, onClick }) => (
  <button 
    onClick={() => onClick(page)}
    className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
      activePage === page 
        ? 'bg-primary-600 text-white' 
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`}
  >
    {icon}
    <span className="ml-3">{label}</span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, isOpen, setIsOpen }) => {
  const { state } = useGlobalState();
  const isAdmin = state.currentUser?.role === 'admin';
  const { youtubeLink, tiktokLink } = state.settings.paymentDetails;

  const handleNavClick = (page: string) => {
    setActivePage(page);
    setIsOpen(false);
  }

  const userNav = [
    { icon: <ImageIcon className="w-5 h-5" />, label: 'Generate Image', page: 'generate' },
    { icon: <HistoryIcon className="w-5 h-5" />, label: 'History', page: 'history' },
    { icon: <CreditCardIcon className="w-5 h-5" />, label: 'Buy Credits', page: 'buy-credits' },
  ];

  const adminNav = [
    { icon: <LayoutDashboardIcon className="w-5 h-5" />, label: 'Dashboard', page: 'admin-dashboard' },
    { icon: <UsersIcon className="w-5 h-5" />, label: 'User Management', page: 'admin-users' },
    { icon: <CheckCircleIcon className="w-5 h-5" />, label: 'Payments', page: 'admin-payments' },
    { icon: <SettingsIcon className="w-5 h-5" />, label: 'Settings', page: 'admin-settings' },
  ];

  return (
    <>
    <div className={`fixed inset-0 z-30 bg-gray-900/80 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}></div>
    <aside className={`fixed top-0 left-0 z-40 w-64 h-screen bg-gray-900 border-r border-gray-800 flex flex-col flex-shrink-0 transition-transform lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
        <div className="flex items-center">
            <SparklesIcon className="w-8 h-8 text-primary-500" />
            <span className="ml-2 text-xl font-bold text-white">{APP_NAME}</span>
        </div>
        <button className="text-gray-400 hover:text-white lg:hidden" onClick={() => setIsOpen(false)}>
            <XIcon className="w-6 h-6" />
        </button>
      </div>
      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 px-4 py-6 space-y-2">
          {isAdmin ? (
            <>
              <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin Panel</p>
              {adminNav.map(item => (
                <NavItem key={item.page} {...item} activePage={activePage} onClick={handleNavClick} />
              ))}
              <hr className="border-gray-700 my-4"/>
              <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User View</p>
              {userNav.map(item => (
                <NavItem key={item.page} {...item} activePage={activePage} onClick={handleNavClick} />
              ))}
            </>
          ) : (
            userNav.map(item => (
              <NavItem key={item.page} {...item} activePage={activePage} onClick={handleNavClick} />
            ))
          )}
        </nav>
        
        {(youtubeLink || tiktokLink) && (
            <div className="px-6 py-4 mt-auto">
                <div className="flex items-center justify-center space-x-4">
                    {youtubeLink && (
                        <a href={youtubeLink} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="YouTube">
                            <YouTubeIcon className="w-6 h-6"/>
                        </a>
                    )}
                    {tiktokLink && (
                         <a href={tiktokLink} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="TikTok">
                            <TikTokIcon className="w-6 h-6"/>
                        </a>
                    )}
                </div>
            </div>
        )}

      </div>
    </aside>
    </>
  );
};

export default Sidebar;