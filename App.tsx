
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { useGlobalState } from './hooks/useGlobalState';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
  const { state } = useGlobalState();

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          className: '',
          style: {
            border: '1px solid #334155',
            padding: '16px',
            color: '#e2e8f0',
            backgroundColor: '#1e293b',
          },
        }}
      />
      {state.isAuthenticated ? <Dashboard /> : <LoginPage />}
    </>
  );
};

export default App;
