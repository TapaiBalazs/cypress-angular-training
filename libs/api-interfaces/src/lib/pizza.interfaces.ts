import { PaymentType } from './payment-type.enum';

export interface Pizza {
  id: number,
  name: string,
  price: number,
  imageUrl: string,
  description: string;
}

export interface Order {
  id: number,
  address: string,
  paymentType: PaymentType
  pizzas: Pizza[]
}
