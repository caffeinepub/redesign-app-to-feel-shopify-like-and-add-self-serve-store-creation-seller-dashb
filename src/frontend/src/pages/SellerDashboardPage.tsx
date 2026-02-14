import { useState } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Store, Package, Plus, Settings, TrendingUp } from 'lucide-react';
import { useGetCallerSupplierProfile, useGetCallerSupplierProducts } from '../hooks/useQueries';
import SellerProductList from '../components/seller/SellerProductList';
import ProductFormDialog from '../components/seller/ProductFormDialog';

export default function SellerDashboardPage() {
  const navigate = useNavigate();
  const { data: supplierProfile, isLoading: profileLoading } = useGetCallerSupplierProfile();
  const { data: products = [], isLoading: productsLoading } = useGetCallerSupplierProducts();
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);

  if (profileLoading) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!supplierProfile) {
    return (
      <div className="container py-12 max-w-2xl">
        <Card className="text-center py-12 border-border/50">
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

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + Number(p.stockQuantity), 0);
  const lowStockCount = products.filter(p => Number(p.stockQuantity) < 20 && Number(p.stockQuantity) > 0).length;

  return (
    <div className="container py-12">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">{supplierProfile.name}</h1>
            <p className="text-muted-foreground text-lg">
              Manage your store and products
            </p>
          </div>
          <Link to="/create-store">
            <Button variant="outline" className="gap-2">
              <Settings className="h-4 w-4" />
              Store Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalProducts}</div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Stock
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalStock}</div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Low Stock Items
            </CardTitle>
            <Badge variant={lowStockCount > 0 ? "destructive" : "secondary"}>
              {lowStockCount}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{lowStockCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Products Section */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Products</CardTitle>
              <CardDescription>
                Manage your product inventory and pricing
              </CardDescription>
            </div>
            <Button onClick={() => setIsProductDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <SellerProductList products={products} isLoading={productsLoading} />
        </CardContent>
      </Card>

      <ProductFormDialog
        open={isProductDialogOpen}
        onOpenChange={setIsProductDialogOpen}
      />
    </div>
  );
}
