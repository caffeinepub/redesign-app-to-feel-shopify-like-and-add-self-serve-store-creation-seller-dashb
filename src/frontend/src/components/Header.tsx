import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from './ui/button';
import { ShoppingCart, Store, Menu } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetCallerSupplierProfile } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { ASSETS } from '../utils/assets';

export default function Header() {
  const { identity, clear, login, loginStatus } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: supplierProfile } = useGetCallerSupplierProfile();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const stored = localStorage.getItem('cart');
      if (stored) {
        try {
          const items = JSON.parse(stored);
          setCartCount(items.length);
        } catch (e) {
          setCartCount(0);
        }
      } else {
        setCartCount(0);
      }
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    const interval = setInterval(updateCartCount, 1000);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      clearInterval(interval);
    };
  }, []);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';
  const isSupplier = !!supplierProfile;

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      localStorage.removeItem('cart');
      navigate({ to: '/' });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3">
            <img src={ASSETS.logo} alt="ShopHub" className="h-8 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              to="/suppliers"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Suppliers
            </Link>
            <Link
              to="/products"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Products
            </Link>
            {isAuthenticated && (
              <Link
                to={isSupplier ? "/seller-dashboard" : "/create-store"}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {isSupplier ? 'Dashboard' : 'Create Store'}
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && userProfile && (
            <span className="hidden sm:inline text-sm text-muted-foreground">
              Welcome, <span className="font-medium text-foreground">{userProfile.name}</span>
            </span>
          )}

          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          <Button
            onClick={handleAuth}
            disabled={isLoggingIn}
            variant={isAuthenticated ? 'outline' : 'default'}
            size="sm"
          >
            {isLoggingIn ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
          </Button>
        </div>
      </div>
    </header>
  );
}
