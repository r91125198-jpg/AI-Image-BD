
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useGlobalState } from '../../hooks/useGlobalState';
import type { User } from '../../types';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';

const AdminUserManagementPage: React.FC = () => {
    const { state, dispatch } = useGlobalState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [creditsAmount, setCreditsAmount] = useState(0);

    const openCreditModal = (user: User) => {
        setSelectedUser(user);
        setCreditsAmount(0);
        setIsModalOpen(true);
    };

    const handleCreditChange = (operation: 'add' | 'remove') => {
        if (!selectedUser) return;

        const amount = operation === 'add' ? creditsAmount : -creditsAmount;
        if(operation === 'remove' && selectedUser.credits < creditsAmount) {
            toast.error("Cannot remove more credits than the user has.");
            return;
        }

        dispatch({ type: 'ADD_CREDITS', payload: { userId: selectedUser.id, amount } });
        toast.success(`Successfully ${operation === 'add' ? 'added' : 'removed'} ${creditsAmount} credits.`);
        setIsModalOpen(false);
    };

    const toggleBlockUser = (user: User) => {
        const newStatus = user.status === 'active' ? 'blocked' : 'active';
        dispatch({ type: 'UPDATE_USER', payload: { ...user, status: newStatus } });
        toast.success(`User ${user.email} has been ${newStatus}.`);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-6">User Management</h1>
            <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-800">
                        <thead className="bg-gray-800">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Credits</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-900 divide-y divide-gray-800">
                            {state.users.map(user => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{user.credits}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <Button variant="secondary" size="sm" onClick={() => openCreditModal(user)}>Edit Credits</Button>
                                        <Button variant={user.status === 'active' ? 'danger' : 'secondary'} size="sm" onClick={() => toggleBlockUser(user)}>
                                            {user.status === 'active' ? 'Block' : 'Unblock'}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Edit credits for ${selectedUser?.email}`}>
                <div className="space-y-4">
                    <p>Current Credits: <span className="font-bold text-primary-400">{selectedUser?.credits}</span></p>
                    <Input
                        label="Amount"
                        type="number"
                        value={creditsAmount}
                        onChange={(e) => setCreditsAmount(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    />
                    <div className="flex justify-end space-x-2 pt-2">
                        <Button variant="secondary" onClick={() => handleCreditChange('remove')}>Remove Credits</Button>
                        <Button onClick={() => handleCreditChange('add')}>Add Credits</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdminUserManagementPage;
