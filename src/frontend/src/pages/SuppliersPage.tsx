import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { Store, MapPin, Mail, ArrowRight } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { useGetAllSuppliers, useGetAllProducts } from '../hooks/useQueries';
import { useMemo } from 'react';
import { setSupplierIdInUrl } from '../utils/urlParams';

export default function SuppliersPage() {
  const { data: suppliers = [], isLoading: suppliersLoading } = useGetAllSuppliers();
  const { data: products = [] } = useGetAllProducts();
  const navigate = useNavigate();

  const supplierProductCounts = useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach(product => {
      const supplierId = product.supplierId.toString();
      counts.set(supplierId, (counts.get(supplierId) || 0) + 1);
    });
    return counts;
  }, [products]);

  const handleViewProducts = (supplierId: string) => {
    setSupplierIdInUrl(supplierId);
    navigate({ to: '/products' });
  };

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3">Our Stores</h1>
        <p className="text-muted-foreground text-lg">
          Browse our network of verified stores and discover quality products
        </p>
      </div>

      {/* Loading State */}
      {suppliersLoading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-12 w-12 rounded-lg mb-2" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Suppliers Grid */}
      {!suppliersLoading && suppliers.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.map((supplier) => (
            <Card key={supplier.id.toString()} className="hover:shadow-medium transition-all border-border/50">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Store className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant="secondary" className="gap-1">
                    ⭐ 4.8
                  </Badge>
                </div>
                <CardTitle className="text-xl">{supplier.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {supplier.description || 'Quality products from a trusted store'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>Worldwide Shipping</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{supplier.contactInfo || 'Contact available'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Store className="h-4 w-4" />
                    <span>{supplierProductCounts.get(supplier.id.toString()) || 0} Products</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full gap-2" 
                  variant="outline"
                  onClick={() => handleViewProducts(supplier.id.toString())}
                >
                  View Products
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!suppliersLoading && suppliers.length === 0 && (
        <div className="text-center py-20">
          <Store className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Stores Yet</h3>
          <p className="text-muted-foreground">
            Stores will appear here once sellers register on the platform
          </p>
        </div>
      )}
    </div>
  );
}
