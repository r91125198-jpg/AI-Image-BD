import React from 'react';
import { useGlobalState } from '../../hooks/useGlobalState';
import { CURRENCY_SYMBOL } from '../../config';
// FIX: Added CreditCardIcon to the import list for the StatCard component.
import { CheckCircleIcon, UsersIcon, CreditCardIcon } from '../../components/icons';

const StatCard: React.FC<{title: string, value: string | number, icon: React.ReactNode}> = ({ title, value, icon }) => (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-950 text-primary-400">
                {icon}
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">{title}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
            </div>
        </div>
    </div>
);

const AdminDashboardPage: React.FC = () => {
    const { state } = useGlobalState();

    const totalUsers = state.users.length;
    const pendingApprovals = state.payments.filter(p => p.status === 'pending').length;
    
    const sessionRevenue = state.payments
        .filter(p => p.status === 'approved')
        .reduce((total, payment) => {
            const pkg = state.settings.creditPackages.find(p => p.id === payment.packageId);
            return total + (pkg ? pkg.price : 0);
        }, 0);

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard 
                    title="Total Session Users" 
                    value={totalUsers} 
                    icon={<UsersIcon className="w-6 h-6" />} 
                />
                <StatCard 
                    title="Pending Approvals" 
                    value={pendingApprovals} 
                    icon={<CheckCircleIcon className="w-6 h-6" />} 
                />
                <StatCard 
                    title="Session Revenue" 
                    value={`${CURRENCY_SYMBOL}${sessionRevenue}`} 
                    icon={<CreditCardIcon className="w-6 h-6" />} 
                />
            </div>
        </div>
    );
};

export default AdminDashboardPage;