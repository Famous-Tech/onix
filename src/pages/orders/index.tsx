import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { Order } from '@/types';

export default function Orders() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data } = await api.get<Order[]>('/orders');
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Orders</h1>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-50 rounded-lg p-6">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Orders</h1>

      <div className="space-y-4">
        {orders?.map((order) => (
          <div key={order.id} className="bg-gray-50 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-600">
                  Order #{order.id.slice(0, 8)}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'delivered'
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'shipped'
                      ? 'bg-blue-100 text-blue-800'
                      : order.status === 'processing'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-medium">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}