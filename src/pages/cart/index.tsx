import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';

export default function Cart() {
  const { items, total, removeItem, updateQuantity } = useCartStore();
  const { user } = useAuthStore();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-8">Add some products to your cart to continue shopping</p>
        <Link
          to="/products"
          className="inline-block bg-black text-white px-8 py-3 rounded-md font-medium hover:bg-black/90 transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="flex gap-4 border-b py-4 last:border-0"
            >
              <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{item.product.name}</h3>
                <p className="text-gray-600">
                  ${item.product.price.toFixed(2)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      updateQuantity(item.product.id, Math.max(1, item.quantity - 1))
                    }
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity + 1)
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.product.id)}
                    className="ml-4 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            {user ? (
              <Link to="/checkout">
                <Button className="w-full mt-6">Proceed to Checkout</Button>
              </Link>
            ) : (
              <p className="text-center mt-6 text-gray-600">
                Please{' '}
                <Link to="/" className="text-black underline">
                  sign in
                </Link>{' '}
                to checkout
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}