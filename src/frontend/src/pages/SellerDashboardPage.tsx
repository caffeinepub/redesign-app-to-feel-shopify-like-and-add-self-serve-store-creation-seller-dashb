import { useState, useRef, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Store, AlertCircle, RefreshCw } from 'lucide-react';
import { useGetCallerSupplierProfile, useGetCallerSupplierProducts } from '../hooks/useQueries';
import { useDelayedLoadingFallback } from '../hooks/useDelayedLoadingFallback';
import SellerDashboardTopBar from '../components/seller/SellerDashboardTopBar';
import SellerDashboardOnboardingCards from '../components/seller/SellerDashboardOnboardingCards';
import SellerProductList from '../components/seller/SellerProductList';
import ProductFormDialog from '../components/seller/ProductFormDialog';
import SellerDashboardNavDrawer from '../components/seller/SellerDashboardNavDrawer';

export default function SellerDashboardPage() {
  const navigate = useNavigate();
  const { data: supplierProfile, isLoading: profileLoading, isError, error, refetch } = useGetCallerSupplierProfile();
  const { data: products = [], isLoading: productsLoading, refetch: refetchProducts } = useGetCallerSupplierProducts();
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const productsRef = useRef<HTMLDivElement>(null);

  // Show fallback UI if loading takes too long
  const showLoadingFallback = useDelayedLoadingFallback(profileLoading, 12000);

  const handleProductsScroll = () => {
    if (productsRef.current) {
      productsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleRetry = () => {
    refetch();
    refetchProducts();
  };

  const handleReload = () => {
    window.location.reload();
  };

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  // Show error state with retry option - prioritize errors over loading
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="max-w-md w-full text-center py-12 border-destructive/50">
          <CardContent className="space-y-6">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto" />
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Failed to Load Dashboard</h2>
              <p className="text-muted-foreground">
                {error instanceof Error ? error.message : 'Unable to load your store profile. Please try again.'}
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button onClick={handleRetry} variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
              <Button onClick={handleReload} variant="default">
                Reload Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading state with delayed fallback
  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <div className="text-center max-w-md">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground mb-6">Loading dashboard...</p>
          
          {showLoadingFallback && (
            <Card className="mt-6 border-border/50">
              <CardContent className="py-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  This is taking longer than expected. Your dashboard may be initializing.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={handleRetry} variant="outline" size="sm" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Retry
                  </Button>
                  <Button onClick={handleReload} variant="default" size="sm">
                    Reload Page
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Show create store prompt when profile is null
  if (!supplierProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="max-w-md w-full text-center py-12 border-border/50">
          <CardContent className="space-y-6">
            <Store className="h-16 w-16 text-muted-foreground mx-auto" />
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Create Your Store First</h2>
              <p className="text-muted-foreground">
                You need to create a store before accessing the seller dashboard
              </p>
            </div>
            <Button onClick={() => navigate({ to: '/create-store' })} className="gap-2">
              <Store className="h-4 w-4" />
              Create Store
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render dashboard when supplier profile exists
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Dashboard-only top bar */}
      <SellerDashboardTopBar
        storeName={supplierProfile.name}
        supplierId={supplierProfile.id.toString()}
        onMenuClick={() => setIsDrawerOpen(true)}
      />

      {/* Navigation Drawer */}
      <SellerDashboardNavDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        supplierId={supplierProfile.id.toString()}
        onProductsClick={handleProductsScroll}
      />

      {/* Main content */}
      <div className="container max-w-5xl py-6 space-y-6">
        {/* Onboarding/Setup Cards */}
        <SellerDashboardOnboardingCards
          supplierProfile={supplierProfile}
          onAddProduct={() => setIsProductDialogOpen(true)}
        />

        {/* Product Management Section */}
        <div ref={productsRef} className="bg-card rounded-lg border border-border/50 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-1">Your Products</h2>
            <p className="text-sm text-muted-foreground">
              Manage your product inventory and pricing
            </p>
          </div>
          <SellerProductList products={products} isLoading={productsLoading} />
        </div>
      </div>

      <ProductFormDialog
        open={isProductDialogOpen}
        onOpenChange={setIsProductDialogOpen}
      />
    </div>
  );
}
