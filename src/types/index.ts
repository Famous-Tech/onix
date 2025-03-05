export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  photoURL: string;
}

export interface Order {
  id: string;
  userId: string;
  products: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  total: number;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}