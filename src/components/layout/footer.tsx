import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">ONIX</h3>
            <p className="text-gray-400">
              Premium tech accessories crafted in Haiti
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-400 hover:text-white">
                  Orders
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-400 hover:text-white">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: contact@onix.com</li>
              <li>Phone: +509 1234 5678</li>
              <li>Address: Port-au-Prince, Haiti</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} ONYX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
