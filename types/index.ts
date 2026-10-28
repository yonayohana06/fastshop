export interface User {
  id: string | number;
  name: string;
  email: string;
  role: "user" | "admin" | string;
  phone_number?: string | null;
  created_at?: string;
}

export interface AuthResponseData {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  code?: number;
  success?: boolean;
  message: string;
  data: T;
  pagination?: Pagination;
}

export interface Product {
  id: string | number;
  name: string;
  description?: string;
  price: string | number;
  stock: number;
  image_url: string;
  category_id?: number | string;
  category_name?: string;
}

export interface Category {
  id: number | string;
  name: string;
  slug: string;
  icon_url?: string | null;
  created_at?: string;
  product_count?: number;
}

export interface CartItem {
  cart_item_id: number | string;
  product_id: number | string;
  product_name: string;
  price: string | number;
  image_url: string;
  quantity: number;
  subtotal: string | number;
}

export interface CartData {
  items: CartItem[];
  grand_total: number | string;
}

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "COMPLETED"
  | "CANCELLED";

export interface OrderItem {
  order_item_id: number | string;
  product_id: number | string;
  product_name: string;
  product_image: string;
  quantity: number;
  price_at_purchase: number | string;
  subtotal: number | string;
}

export interface Order {
  id?: string;
  order_id?: string;
  user_id: string;
  total_amount: number | string;
  status: OrderStatus;
  shipping_address: string;
  payment_proof_url: string | null;
  payment_submitted_at: string | null;
  created_at: string;
  updated_at: string;
  total_items?: number;
  total_quantity?: number;
  items?: OrderItem[];
}

export interface Pagination {
  currentPage: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
