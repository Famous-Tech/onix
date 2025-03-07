import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { Product } from '@/types';

export default function Home() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const { data } = await api.get<Product[]>('/products?limit=4');
      return data;
    },
  });

  return (
    <div>
      <section className="relative h-[600px] flex items-center justify-center bg-black text-white">
        <img
          src=".././../assets/home_bg.jpg"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">ONIX</h1>
          <p className="text-xl md:text-2xl mb-8">Premium Tech Accessories from Haiti</p>
          <Link
            to="/products"
            className="inline-block bg-white text-black px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products?.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="group"
              >
                <div className="aspect-square rounded-lg overflow-hidden mb-4">
                  <img
                    src={product.imageurl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-medium mb-2">{product.name}</h3>
                <p className="text-gray-600">
                  ${product.price ? product.price.toFixed(2) : '0.00'}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-xl font-bold mb-4">Handcrafted in Haiti</h3>
              <p className="text-gray-600">Each product is carefully made by skilled artisans</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Premium Quality</h3>
              <p className="text-gray-600">Using only the finest materials available</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Fast Shipping</h3>
              <p className="text-gray-600">Worldwide delivery within 3-5 business days</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
