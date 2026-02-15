import { useState, useRef, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Store, AlertCircle } from 'lucide-react';
import { useGetCallerSupplierProfile, useGetCallerSupplierProducts } from '../hooks/useQueries';
import SellerDashboardTopBar from '../components/seller/SellerDashboardTopBar';
import SellerDashboardOnboardingCards from '../components/seller/SellerDashboardOnboardingCards';
import SellerProductList from '../components/seller/SellerProductList';
import ProductFormDialog from '../components/seller/ProductFormDialog';
import SellerDashboardNavDrawer from '../components/seller/SellerDashboardNavDrawer';

export default function SellerDashboardPage() {
  const navigate = useNavigate();
  const { data: supplierProfile, isLoading: profileLoading, isFetched, isError, error, refetch } = useGetCallerSupplierProfile();
  const { data: products = [], isLoading: productsLoading } = useGetCallerSupplierProducts();
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const productsRef = useRef<HTMLDivElement>(null);

  const handleProductsScroll = () => {
    if (productsRef.current) {
      productsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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

  // Show loading state while query is loading or refetching
  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state with retry option
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="max-w-md w-full text-center py-12 border-destructive/50">
          <CardContent className="space-y-6">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto" />
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Failed to Load Store</h2>
              <p className="text-muted-foreground">
                {error instanceof Error ? error.message : 'Unable to load your store profile. Please try again.'}
              </p>
            </div>
            <Button onClick={() => refetch()} variant="outline">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Only show create store prompt when query has definitively resolved to null
  if (isFetched && !supplierProfile) {
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
        storeName={supplierProfile!.name}
        supplierId={supplierProfile!.id.toString()}
        onMenuClick={() => setIsDrawerOpen(true)}
      />

      {/* Navigation Drawer */}
      <SellerDashboardNavDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        supplierId={supplierProfile!.id.toString()}
        onProductsClick={handleProductsScroll}
      />

      {/* Main content */}
      <div className="container max-w-5xl py-6 space-y-6">
        {/* Onboarding/Setup Cards */}
        <SellerDashboardOnboardingCards
          supplierProfile={supplierProfile!}
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
