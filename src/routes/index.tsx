import { Routes as RouterRoutes, Route } from 'react-router-dom';
import Layout from '@/components/layout';
import Home from '@/pages/home';
import Products from '@/pages/products';
import ProductDetails from '@/pages/products/[id]';
import Cart from '@/pages/cart';
import Checkout from '@/pages/checkout';
import Profile from '@/pages/profile';
import Orders from '@/pages/orders';
import ProtectedRoute from '@/components/protected-route';

export default function Routes() {
  return (
    <RouterRoutes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
        </Route>
      </Route>
    </RouterRoutes>
  );
}