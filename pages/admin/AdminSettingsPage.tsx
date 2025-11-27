
import React, { useState, ChangeEvent } from 'react';
import toast from 'react-hot-toast';
import { useGlobalState } from '../../hooks/useGlobalState';
import type { CreditPackage, PaymentDetails } from '../../types';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { CURRENCY_SYMBOL } from '../../config';
import { UploadIcon } from '../../components/icons';

const AdminSettingsPage: React.FC = () => {
    const { state, dispatch } = useGlobalState();
    const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>(state.settings.paymentDetails);
    const [creditPackages, setCreditPackages] = useState<CreditPackage[]>(state.settings.creditPackages);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState<CreditPackage | null>(null);

    const handlePaymentDetailsChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value });
    };

    const handleSavePaymentDetails = () => {
        dispatch({ type: 'UPDATE_PAYMENT_DETAILS', payload: paymentDetails });
        toast.success('Payment details updated.');
    };

    const handleQrCodeUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setPaymentDetails({ ...paymentDetails, qrCodeUrl: reader.result as string });
                toast.success('QR Code ready to be saved.');
            };
            reader.readAsDataURL(file);
        }
    };

    const openPackageModal = (pkg: CreditPackage | null) => {
        setEditingPackage(pkg || { id: '', name: '', credits: 0, price: 0 });
        setIsModalOpen(true);
    };

    const handleSavePackage = () => {
        if (!editingPackage?.name || editingPackage.credits <= 0 || editingPackage.price < 0) {
            toast.error("Please fill all package fields with valid values.");
            return;
        }

        let updatedPackages;
        if (editingPackage.id) { // Editing existing
            updatedPackages = creditPackages.map(p => p.id === editingPackage.id ? editingPackage : p);
        } else { // Adding new
            updatedPackages = [...creditPackages, { ...editingPackage, id: new Date().toISOString() }];
        }
        setCreditPackages(updatedPackages);
        dispatch({ type: 'SET_CREDIT_PACKAGES', payload: updatedPackages });
        toast.success(`Package ${editingPackage.id ? 'updated' : 'added'}.`);
        setIsModalOpen(false);
    };

    const handleDeletePackage = (id: string) => {
        const updatedPackages = creditPackages.filter(p => p.id !== id);
        setCreditPackages(updatedPackages);
        dispatch({ type: 'SET_CREDIT_PACKAGES', payload: updatedPackages });
        toast.success('Package deleted.');
    };

    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-3xl font-bold text-white mb-6">Website Configuration</h1>

                {/* General Settings */}
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">General Settings</h2>
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-200 mb-2 border-b border-gray-700 pb-2">Payment Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                <Input label="Method Name" name="methodName" value={paymentDetails.methodName} onChange={handlePaymentDetailsChange} />
                                <Input label="Account Number" name="accountNumber" value={paymentDetails.accountNumber} onChange={handlePaymentDetailsChange} />
                            </div>
                            <div className="mt-6 flex items-end space-x-4">
                                <div className="flex-shrink-0">
                                    <img src={paymentDetails.qrCodeUrl} alt="QR Code" className="h-24 w-24 rounded-md bg-gray-700 object-cover" />
                                </div>
                                <div className="flex-grow">
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Upload QR Code</label>
                                    <label htmlFor="qr-upload" className="cursor-pointer bg-gray-700 text-gray-200 hover:bg-gray-600 focus:ring-gray-500 inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold transition-all">
                                        <UploadIcon className="w-5 h-5 mr-2" />
                                        Choose File
                                    </label>
                                    <input id="qr-upload" type="file" className="hidden" accept="image/*" onChange={handleQrCodeUpload} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-200 mb-2 border-b border-gray-700 pb-2">Social Links</h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                <Input label="YouTube Link" name="youtubeLink" value={paymentDetails.youtubeLink} onChange={handlePaymentDetailsChange} placeholder="https://youtube.com/channel/..." />
                                <Input label="TikTok Link" name="tiktokLink" value={paymentDetails.tiktokLink} onChange={handlePaymentDetailsChange} placeholder="https://tiktok.com/@..." />
                            </div>
                        </div>
                    </div>

                     <div className="mt-8 text-right">
                        <Button onClick={handleSavePaymentDetails}>Save Settings</Button>
                    </div>
                </div>
            </div>

            {/* Credit Packages */}
            <div>
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-white">Credit Packages</h2>
                    <Button onClick={() => openPackageModal(null)}>Add New Package</Button>
                 </div>
                 <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-800">
                            <thead className="bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Package Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Credits</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-900 divide-y divide-gray-800">
                                {creditPackages.map(pkg => (
                                    <tr key={pkg.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{pkg.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{pkg.credits}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{CURRENCY_SYMBOL}{pkg.price}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <Button variant="secondary" onClick={() => openPackageModal(pkg)}>Edit</Button>
                                            <Button variant="danger" onClick={() => handleDeletePackage(pkg.id)}>Delete</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingPackage?.id ? 'Edit Package' : 'Add New Package'}>
                {editingPackage && (
                    <div className="space-y-4">
                        <Input label="Package Name" value={editingPackage.name} onChange={e => setEditingPackage({ ...editingPackage, name: e.target.value })} />
                        <Input label="Credits" type="number" value={editingPackage.credits} onChange={e => setEditingPackage({ ...editingPackage, credits: parseInt(e.target.value) || 0 })} />
                        <Input label={`Price (${CURRENCY_SYMBOL})`} type="number" value={editingPackage.price} onChange={e => setEditingPackage({ ...editingPackage, price: parseInt(e.target.value) || 0 })} />
                        <div className="flex justify-end pt-4">
                            <Button onClick={handleSavePackage}>Save Package</Button>
                        </div>
                    </div>
                )}
            </Modal>

        </div>
    );
};

export default AdminSettingsPage;