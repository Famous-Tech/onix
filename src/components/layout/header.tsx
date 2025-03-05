import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useState } from 'react';
import { useCartStore } from '@/store/cart';
import toast from 'react-hot-toast';

export default function Header() {
  const { user } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartItems = useCartStore((state) => state.items);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        toast.success('Connecte avec succes!');
      }
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      toast.error(
        error.code === 'auth/popup-closed-by-user'
          ? 'Sign in cancelled'
          : 'Failed to sign in. Please try again.'
      );
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Deconnexion realise avec succes');
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out. Please try again.');
    }
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            ONIX
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/products" className="hover:text-gray-600">
              Products
            </Link>
            {user && (
              <Link to="/orders" className="hover:text-gray-600">
                Orders
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2"
                >
                  <img
                    src={user.photoURL}
                    alt={user.name}
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="hidden md:inline">{user.name}</span>
                </Button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button onClick={handleLogin} className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span className="hidden md:inline">Se connecter</span>
              </Button>
            )}

            <Button
              variant="ghost"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden mt-4 border-t pt-4">
            <Link
              to="/products"
              className="block py-2 hover:text-gray-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Produits
            </Link>
            {user && (
              <Link
                to="/orders"
                className="block py-2 hover:text-gray-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Commandes
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
