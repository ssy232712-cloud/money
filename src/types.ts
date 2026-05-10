export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  icon: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Receipt {
  items: CartItem[];
  totalPrice: number;
  paidAmount: number;
  expectedChange: number;
  timestamp: Date;
}
