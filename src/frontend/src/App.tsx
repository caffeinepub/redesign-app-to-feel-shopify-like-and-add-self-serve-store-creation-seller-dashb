import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet, useLocation, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingHeader from './components/landing/LandingHeader';
import LandingFooter from './components/landing/LandingFooter';
import HomePage from './pages/HomePage';
import SuppliersPage from './pages/SuppliersPage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailurePage from './pages/PaymentFailurePage';
import CreateStorePage from './pages/CreateStorePage';
import SellerDashboardPage from './pages/SellerDashboardPage';
import StoreViewPage from './pages/StoreViewPage';
import ProfileSetupModal from './components/ProfileSetupModal';
import StripeSetupModal from './components/StripeSetupModal';
import AccessDeniedScreen from './components/AccessDeniedScreen';
import AdminSeedButton from './components/AdminSeedButton';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import { onboardingStorage } from './utils/onboardingStorage';
import { useEffect, useState } from 'react';

function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;
  const isLandingPage = location.pathname === '/';
  const isSellerDashboard = location.pathname === '/seller-dashboard';

  // Handle authenticated user redirect from home route
  useEffect(() => {
    if (isAuthenticated && !isInitializing && isLandingPage) {
      // Check for onboarding redirect target first (takes precedence)
      const redirectTarget = onboardingStorage.consumeRedirectTarget();
      
      if (redirectTarget) {
        // Navigate to onboarding target
        setIsRedirecting(true);
        navigate({ to: redirectTarget });
      } else {
        // Default redirect to seller dashboard for authenticated users
        setIsRedirecting(true);
        navigate({ to: '/seller-dashboard' });
      }
    }
  }, [isAuthenticated, isInitializing, isLandingPage, navigate]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Prevent landing page flash for authenticated users on home route
  if (isLandingPage && isAuthenticated && isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Public landing page - no auth required
  if (isLandingPage && !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <LandingHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <LandingFooter />
        <Toaster />
      </div>
    );
  }

  // All other routes require authentication
  if (!isAuthenticated) {
    return <AccessDeniedScreen />;
  }

  // Seller dashboard layout (no global header/footer to avoid double-stacking on mobile)
  if (isSellerDashboard) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1">
          <Outlet />
        </main>
        {showProfileSetup && <ProfileSetupModal />}
        <StripeSetupModal />
        <div className="fixed bottom-4 right-4 z-50">
          <AdminSeedButton />
        </div>
        <Toaster />
      </div>
    );
  }

  // Authenticated layout with global header/footer (for non-dashboard routes)
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {showProfileSetup && <ProfileSetupModal />}
      <StripeSetupModal />
      <div className="fixed bottom-4 right-4 z-50">
        <AdminSeedButton />
      </div>
      <Toaster />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const suppliersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/suppliers',
  component: SuppliersPage,
});

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products',
  component: ProductsPage,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: CartPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: CheckoutPage,
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-success',
  component: PaymentSuccessPage,
});

const paymentFailureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-failure',
  component: PaymentFailurePage,
});

const createStoreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create-store',
  component: CreateStorePage,
});

const sellerDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/seller-dashboard',
  component: SellerDashboardPage,
});

const storeViewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/store/$supplierId',
  component: StoreViewPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  suppliersRoute,
  productsRoute,
  cartRoute,
  checkoutRoute,
  paymentSuccessRoute,
  paymentFailureRoute,
  createStoreRoute,
  sellerDashboardRoute,
  storeViewRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
