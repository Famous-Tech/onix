import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart';
import toast from 'react-hot-toast';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const addItem = useCartStore((state) => state.addItem);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data } = await api.get<Product>(`/products/${id}`);
      return data;
    },
  });

  const handleAddToCart = () => {
    if (product) {
      addItem(product);
      toast.success('Added to cart');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="animate-pulse bg-gray-200 aspect-square rounded-lg"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square rounded-lg overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-medium mb-6">${product.price.toFixed(2)}</p>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <Button onClick={handleAddToCart} size="lg" className="w-full md:w-auto">
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}