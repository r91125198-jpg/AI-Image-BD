
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useGlobalState } from '../../hooks/useGlobalState';
import type { CreditPackage, PaymentRequest } from '../../types';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import { CURRENCY_SYMBOL } from '../../config';
import { CreditCardIcon } from '../../components/icons';

const BuyCreditsPage: React.FC = () => {
  const { state, dispatch } = useGlobalState();
  const { settings, currentUser } = state;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null);
  const [trxId, setTrxId] = useState('');

  const handleBuyNow = (pkg: CreditPackage) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  const handleSubmitPayment = () => {
    if (!trxId.trim()) {
      toast.error('Transaction ID is required.');
      return;
    }
    if (!selectedPackage || !currentUser) return;

    const newPaymentRequest: PaymentRequest = {
      id: new Date().toISOString(),
      userId: currentUser.id,
      userEmail: currentUser.email,
      packageId: selectedPackage.id,
      packageName: selectedPackage.name,
      trxId: trxId,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: 'CREATE_PAYMENT_REQUEST', payload: newPaymentRequest });
    toast.success('Payment request submitted. Please wait for admin approval.');
    setIsModalOpen(false);
    setTrxId('');
    setSelectedPackage(null);
  };
  
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Buy Credits</h1>
      <p className="text-gray-400 mb-8">Choose a package that suits your needs. Your credits never expire.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settings.creditPackages.map(pkg => (
          <div key={pkg.id} className="bg-gray-900 border border-gray-800 rounded-lg p-6 flex flex-col">
            <h2 className="text-2xl font-semibold text-primary-400">{pkg.name}</h2>
            <div className="my-4">
              <span className="text-5xl font-bold text-white">{pkg.credits}</span>
              <span className="text-gray-400 ml-2">Credits</span>
            </div>
            <p className="text-gray-300">Get a huge boost to your creative power.</p>
            <div className="flex-grow"></div>
            <div className="mt-6">
                <div className="text-3xl font-bold text-white mb-4">{CURRENCY_SYMBOL}{pkg.price}</div>
                <Button onClick={() => handleBuyNow(pkg)} className="w-full">
                    Buy Now
                </Button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Purchase ${selectedPackage?.name}`}>
        {selectedPackage && (
            <div className="space-y-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-semibold text-white">Payment Instructions</h4>
                    <p className="text-sm text-gray-300">Send <span className="font-bold text-primary-400">{CURRENCY_SYMBOL}{selectedPackage.price}</span> to the following account and enter the Transaction ID below.</p>
                    <div className="mt-4 space-y-2">
                        <p className="text-sm"><span className="font-semibold text-gray-400">Method:</span> {settings.paymentDetails.methodName}</p>
                        <p className="text-sm"><span className="font-semibold text-gray-400">Number:</span> {settings.paymentDetails.accountNumber}</p>
                    </div>
                </div>

                {settings.paymentDetails.qrCodeUrl && (
                    <div className="text-center">
                        <img src={settings.paymentDetails.qrCodeUrl} alt="Payment QR Code" className="mx-auto rounded-lg max-w-xs h-auto" style={{maxWidth: '150px'}}/>
                    </div>
                )}
                
                <Input
                    label="Transaction ID (TrxID)"
                    id="trxId"
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    placeholder="Enter the TrxID from your payment"
                    required
                />

                <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmitPayment}>Submit for Approval</Button>
                </div>
            </div>
        )}
      </Modal>
    </div>
  );
};

export default BuyCreditsPage;
