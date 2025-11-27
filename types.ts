
export interface GeneratedImage {
  id: string;
  userId: string;
  src: string; // base64 data URL
  prompt: string;
  createdAt: string; // ISO date string
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  credits: number;
  role: 'user' | 'admin';
  status: 'active' | 'blocked';
}

export interface CreditPackage {
  id: string;
  name:string;
  credits: number;
  price: number;
}

export interface PaymentDetails {
  methodName: string;
  accountNumber: string;
  qrCodeUrl: string;
  youtubeLink?: string;
  tiktokLink?: string;
}

export interface PaymentRequest {
  id: string;
  userId: string;
  userEmail: string;
  packageId: string;
  packageName: string;
  trxId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Settings {
  paymentDetails: PaymentDetails;
  creditPackages: CreditPackage[];
}

export interface GlobalState {
  currentUser: User | null;
  isAuthenticated: boolean;
  users: User[];
  payments: PaymentRequest[];
  settings: Settings;
  imageHistory: GeneratedImage[];
}

export type Action =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER'; payload: User }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'DEDUCT_CREDITS'; payload: { userId: string; amount: number } }
  | { type: 'ADD_CREDITS'; payload: { userId: string; amount: number } }
  | { type: 'CREATE_PAYMENT_REQUEST'; payload: PaymentRequest }
  | { type: 'UPDATE_PAYMENT_REQUEST'; payload: PaymentRequest }
  | { type: 'UPDATE_PAYMENT_DETAILS'; payload: PaymentDetails }
  | { type: 'SET_CREDIT_PACKAGES'; payload: CreditPackage[] }
  | { type: 'ADD_IMAGE_TO_HISTORY'; payload: GeneratedImage }
  | { type: 'DELETE_IMAGE_FROM_HISTORY'; payload: { imageId: string } };