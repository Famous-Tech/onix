import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart';
import toast from 'react-hot-toast';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createOrder = useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/orders', {
        products: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        total,
      });
      return data;
    },
    onSuccess: () => {
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/orders');
    },
    onError: () => {
      toast.error('Failed to place order. Please try again.');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await createOrder.mutateAsync();
    setIsSubmitting(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          {items.map((item) => (
            <div
              key={item.product.id}
              className="flex gap-4 border-b py-4 last:border-0"
            >
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">{item.product.name}</h3>
                <p className="text-gray-600">
                  {item.quantity} x ${item.product.price.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Payment Details</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-md border p-2"
                    placeholder="4242 4242 4242 4242"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-md border p-2"
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">CVC</label>
                    <input
                      type="text"
                      className="w-full rounded-md border p-2"
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="border-t mt-6 pt-6">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full mt-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}