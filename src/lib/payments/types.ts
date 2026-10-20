export interface PaymentInitializationParams {
  orderNumber: string;
  email: string;
  amountInNaira: number;
  customerName: string;
  callbackUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentInitializationResult {
  success: boolean;
  authorizationUrl?: string;
  reference: string;
  message?: string;
}

export interface PaymentVerificationResult {
  success: boolean;
  status: 'success' | 'failed' | 'pending';
  reference: string;
  amount: number;
  paidAt?: string;
  channel?: string;
}
