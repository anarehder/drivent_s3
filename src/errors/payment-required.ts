import { ApplicationError } from '@/protocols';

export function paymentReq(): ApplicationError {
  return {
    name: 'PaymentRequired',
    message: 'Payment is required for this point on!',
  };
}
