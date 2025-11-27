
import type { CreditPackage, PaymentDetails } from './types';

export const APP_NAME = "AI image bd";
export const ADMIN_EMAIL = "r91125198@gmail.com";
export const ADMIN_PASSWORD = "@RAFI2009";
export const CURRENCY_SYMBOL = "৳";

export const INITIAL_PAYMENT_DETAILS: PaymentDetails = {
  methodName: 'Bkash/Nagad/Rocket',
  accountNumber: '01853963244',
  qrCodeUrl: 'https://i.ibb.co/6r6M51A/placeholder-qr.png',
  youtubeLink: '',
  tiktokLink: '',
};

export const INITIAL_CREDIT_PACKAGES: CreditPackage[] = [
  { id: 'pkg1', name: 'Starter Pack', credits: 100, price: 50 },
  { id: 'pkg2', name: 'Pro Pack', credits: 500, price: 200 }
];