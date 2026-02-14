import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Skeleton } from '../components/ui/skeleton';
import { ShoppingCart, Search, Package, X } from 'lucide-react';
import { toast } from 'sonner';
import { useGetAllProducts, useGetAllSuppliers } from '../hooks/useQueries';
import { getSupplierIdFromUrl, clearSupplierFilter } from '../utils/urlParams';
import { ASSETS } from '../utils/assets';

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [supplierFilter, setSupplierFilter] = useState<string | null>(null);
  const navigate = useNavigate();

  const { data: products = [], isLoading: productsLoading } = useGetAllProducts();
  const { data: suppliers = [] } = useGetAllSuppliers();

  useEffect(() => {
    const supplierId = getSupplierIdFromUrl();
    setSupplierFilter(supplierId);
  }, []);

  const supplierMap = useMemo(() => {
    const map = new Map<string, string>();
    suppliers.forEach(supplier => {
      map.set(supplier.id.toString(), supplier.name);
    });
    return map;
  }, [suppliers]);

  const handleAddToCart = (product: any) => {
    const stored = localStorage.getItem('cart');
    const cart = stored ? JSON.parse(stored) : [];
    
    const cartItem = {
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      quantity: 1,
      supplierName: supplierMap.get(product.supplierId.toString()) || 'Unknown',
      image: ASSETS.productPlaceholder,
    };
    
    cart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
    toast.success(`${product.name} added to cart!`);
  };

  const handleClearFilter = () => {
    setSupplierFilter(null);
    clearSupplierFilter();
  };

  let filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (supplierFilter) {
    filteredProducts = filteredProducts.filter(
      product => product.supplierId.toString() === supplierFilter
    );
  }

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return Number(a.price - b.price);
    if (sortBy === 'price-high') return Number(b.price - a.price);
    if (sortBy === 'stock') return Number(b.stockQuantity - a.stockQuantity);
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3">Products</h1>
        <p className="text-muted-foreground text-lg">
          Browse our complete catalog of products from all stores
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name (A-Z)</SelectItem>
            <SelectItem value="price-low">Price (Low to High)</SelectItem>
            <SelectItem value="price-high">Price (High to Low)</SelectItem>
            <SelectItem value="stock">Stock Level</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filter Badge */}
      {supplierFilter && (
        <div className="mb-6">
          <Badge variant="secondary" className="gap-2 py-2 px-3">
            Store: {supplierMap.get(supplierFilter) || 'Unknown'}
            <button onClick={handleClearFilter} className="hover:text-foreground">
              <X className="h-3 w-3" />
            </button>
          </Badge>
        </div>
      )}

      {/* Loading State */}
      {productsLoading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="flex flex-col">
              <Skeleton className="aspect-square rounded-t-lg" />
              <CardHeader>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Products Grid */}
      {!productsLoading && sortedProducts.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <Card key={product.id} className="flex flex-col hover:shadow-medium transition-all border-border/50">
              <CardHeader className="p-0">
                <div className="aspect-square relative overflow-hidden rounded-t-lg bg-muted">
                  <img
                    src={ASSETS.productPlaceholder}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                  {Number(product.stockQuantity) < 20 && Number(product.stockQuantity) > 0 && (
                    <Badge variant="destructive" className="absolute top-2 right-2">
                      Low Stock
                    </Badge>
                  )}
                  {Number(product.stockQuantity) === 0 && (
                    <Badge variant="destructive" className="absolute top-2 right-2">
                      Out of Stock
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-4">
                <div className="mb-2">
                  <Badge variant="outline" className="text-xs">
                    {supplierMap.get(product.supplierId.toString()) || 'Unknown Store'}
                  </Badge>
                </div>
                <CardTitle className="text-lg mb-2 line-clamp-1">{product.name}</CardTitle>
                <CardDescription className="line-clamp-2 mb-3">
                  {product.description}
                </CardDescription>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">
                    ${(Number(product.price) / 100).toFixed(2)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {Number(product.stockQuantity)} in stock
                  </span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button
                  className="w-full gap-2"
                  onClick={() => handleAddToCart(product)}
                  disabled={Number(product.stockQuantity) === 0}
                >
                  <ShoppingCart className="h-4 w-4" />
                  {Number(product.stockQuantity) === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!productsLoading && sortedProducts.length === 0 && (
        <div className="text-center py-20">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
          <p className="text-muted-foreground">
            {searchQuery || supplierFilter ? 'Try adjusting your filters' : 'Products will appear here once stores add them'}
          </p>
          {supplierFilter && (
            <Button onClick={handleClearFilter} variant="outline" className="mt-4">
              Clear Filter
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
