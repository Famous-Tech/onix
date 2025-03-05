import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Routes from './routes';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { useAuthStore } from './store/auth';

const queryClient = new QueryClient();

function App() {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          id: user.uid,
          email: user.email!,
          name: user.displayName!,
          photoURL: user.photoURL!,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes />
        <Toaster position="top-center" />
      </Router>
    </QueryClientProvider>
  );
}

export default App;