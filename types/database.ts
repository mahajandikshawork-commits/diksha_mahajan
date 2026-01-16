export interface OrderItem {
  id: number;
  name: string;
  tagline: string;
  price: string;
  image: string;
  size: string;
  quantity: number;
  customMeasurements?: Record<string, string>;
}

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id?: string;
  order_id: string;
  payment_id: string;
  order_date: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  customer_city: string;
  customer_state: string;
  customer_pincode: string;
  items: OrderItem[];
  total: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}
