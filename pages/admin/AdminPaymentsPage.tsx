import React from 'react';
import toast from 'react-hot-toast';
import { useGlobalState } from '../../hooks/useGlobalState';
import type { PaymentRequest } from '../../types';
import Button from '../../components/common/Button';
// FIX: Imported CheckCircleIcon to be used when there are no pending payments.
import { CheckCircleIcon } from '../../components/icons';

const AdminPaymentsPage: React.FC = () => {
    const { state, dispatch } = useGlobalState();
    
    const handleApproval = (payment: PaymentRequest, newStatus: 'approved' | 'rejected') => {
        dispatch({ type: 'UPDATE_PAYMENT_REQUEST', payload: { ...payment, status: newStatus } });
        
        if (newStatus === 'approved') {
            const pkg = state.settings.creditPackages.find(p => p.id === payment.packageId);
            if (pkg) {
                dispatch({ type: 'ADD_CREDITS', payload: { userId: payment.userId, amount: pkg.credits } });
                toast.success(`Payment approved. ${pkg.credits} credits added to ${payment.userEmail}.`);
            }
        } else {
            toast.error(`Payment for ${payment.userEmail} has been rejected.`);
        }
    };

    const pendingPayments = state.payments.filter(p => p.status === 'pending');

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-6">Payment Verification</h1>
            {pendingPayments.length > 0 ? (
                <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-800">
                            <thead className="bg-gray-800">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User Email</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Package</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">TrxID</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-900 divide-y divide-gray-800">
                                {pendingPayments.map(payment => (
                                    <tr key={payment.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{payment.userEmail}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{payment.packageName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200 font-mono">{payment.trxId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <Button variant="secondary" onClick={() => handleApproval(payment, 'rejected')}>Reject</Button>
                                            <Button onClick={() => handleApproval(payment, 'approved')}>Approve</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="text-center py-16 px-6 bg-gray-900 rounded-lg border-2 border-dashed border-gray-700">
                    <CheckCircleIcon className="w-12 h-12 mx-auto text-gray-500"/>
                    <h3 className="mt-4 text-lg font-medium text-gray-300">All Clear!</h3>
                    <p className="mt-1 text-sm text-gray-500">There are no pending payment requests to review.</p>
                </div>
            )}
        </div>
    );
};

export default AdminPaymentsPage;