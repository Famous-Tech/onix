import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function Profile() {
  const { user } = useAuthStore();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>

      <div className="max-w-2xl">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={user?.photoURL}
              alt={user?.name}
              className="w-20 h-20 rounded-full"
            />
            <div>
              <h2 className="text-xl font-bold">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>

          <Button onClick={handleLogout} variant="outline">
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}