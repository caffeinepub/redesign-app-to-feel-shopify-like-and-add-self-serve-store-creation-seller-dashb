import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Store } from 'lucide-react';
import { useGetCallerSupplierProfile, useGetCallerSupplierProducts } from '../hooks/useQueries';
import SellerDashboardTopBar from '../components/seller/SellerDashboardTopBar';
import SellerDashboardOnboardingCards from '../components/seller/SellerDashboardOnboardingCards';
import SellerProductList from '../components/seller/SellerProductList';
import ProductFormDialog from '../components/seller/ProductFormDialog';

export default function SellerDashboardPage() {
  const navigate = useNavigate();
  const { data: supplierProfile, isLoading: profileLoading } = useGetCallerSupplierProfile();
  const { data: products = [], isLoading: productsLoading } = useGetCallerSupplierProducts();
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Dashboard-only top bar */}
      <SellerDashboardTopBar storeName={supplierProfile.name} />

      {/* Main content */}
      <div className="container max-w-5xl py-6 space-y-6">
        {/* Onboarding/Setup Cards */}
        <SellerDashboardOnboardingCards
          supplierProfile={supplierProfile}
          onAddProduct={() => setIsProductDialogOpen(true)}
        />

        {/* Product Management Section */}
        <div className="bg-card rounded-lg border border-border/50 p-6">
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
