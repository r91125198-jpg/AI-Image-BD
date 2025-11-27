
import React from 'react';
import { useGlobalState } from '../../hooks/useGlobalState';
import { CreditCardIcon, LogOutIcon, MenuIcon } from '../icons';
import { CURRENCY_SYMBOL } from '../../config';

interface HeaderProps {
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { state, dispatch } = useGlobalState();
  const { currentUser } = state;

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <header className="flex-shrink-0 bg-gray-900 border-b border-gray-700">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="text-gray-400 hover:text-white lg:hidden mr-4"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
            <div className="hidden lg:block">
                <h1 className="text-xl font-semibold text-white">Welcome, {currentUser?.name}</h1>
            </div>
        </div>

        <div className="flex items-center space-x-4">
            {currentUser?.role === 'user' && (
                <div className="flex items-center space-x-2 bg-gray-800 px-3 py-1.5 rounded-full text-sm">
                    <CreditCardIcon className="w-5 h-5 text-primary-400" />
                    <span className="text-white font-medium">{currentUser.credits} Credits</span>
                </div>
            )}
            
            <button 
                onClick={handleLogout} 
                className="p-2 rounded-full text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                title="Logout"
            >
              <LogOutIcon className="w-5 h-5" />
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
