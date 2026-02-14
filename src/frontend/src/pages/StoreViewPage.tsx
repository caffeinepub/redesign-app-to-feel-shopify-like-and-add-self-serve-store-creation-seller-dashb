import { useParams, useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Store, MapPin, Mail, ShoppingCart, ArrowLeft, Package, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useGetSupplier, useGetSupplierProducts } from '../hooks/useQueries';
import { getProductImageUrl } from '../utils/productImages';
import { ASSETS } from '../utils/assets';

export default function StoreViewPage() {
  const { supplierId } = useParams({ from: '/store/$supplierId' });
  const navigate = useNavigate();
  const { data: supplier, isLoading: supplierLoading } = useGetSupplier(supplierId);
  const { data: products = [], isLoading: productsLoading } = useGetSupplierProducts(supplierId);

  const handleAddToCart = (product: any) => {
    if (Number(product.stockQuantity) === 0) {
      toast.error('This product is out of stock');
      return;
    }

    const stored = localStorage.getItem('cart');
    const cart = stored ? JSON.parse(stored) : [];
    
    const cartItem = {
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      quantity: 1,
      supplierName: supplier?.name || 'Unknown',
      image: getProductImageUrl(product),
    };
    
    cart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
    toast.success(`${product.name} added to cart!`);
  };

  if (supplierLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg">Loading store...</p>
        </div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="container py-20">
        <Card className="text-center py-20 border-border/50 max-w-2xl mx-auto">
          <CardContent>
            <Store className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-3">Store Not Found</h3>
            <p className="text-muted-foreground mb-8 text-lg">
              The store you're looking for doesn't exist
            </p>
            <Button onClick={() => navigate({ to: '/suppliers' })} size="lg" className="gap-2">
              <ArrowLeft className="h-5 w-5" />
              Back to Stores
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const featuredProducts = products.slice(0, 4);
  const allProducts = products;

  return (
    <div className="min-h-screen">
      {/* Hero Banner Section */}
      <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-background">
        <img
          src={ASSETS.heroBanner}
          alt="Store Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        {/* Hero Content Overlay */}
        <div className="relative h-full container flex flex-col justify-end pb-12 md:pb-16">
          <Button
            variant="ghost"
            onClick={() => navigate({ to: '/suppliers' })}
            className="absolute top-6 left-4 md:left-8 gap-2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="flex items-end gap-6">
            <div className="h-24 w-24 md:h-32 md:w-32 rounded-2xl bg-background border-4 border-background shadow-xl flex items-center justify-center flex-shrink-0">
              <Store className="h-12 w-12 md:h-16 md:w-16 text-primary" />
            </div>
            <div className="flex-1 pb-2">
              <h1 className="text-3xl md:text-5xl font-bold mb-2 text-foreground">
                {supplier.name}
              </h1>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(4.8 rating)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Store Info Section */}
      <div className="border-b border-border/50 bg-muted/30">
        <div className="container py-8">
          <div className="max-w-4xl">
            <p className="text-lg text-foreground/90 mb-6">
              {supplier.description || 'Welcome to our store! We offer quality products with excellent service.'}
            </p>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary" />
                <span>Worldwide Shipping Available</span>
              </div>
              {supplier.contactInfo && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-5 w-5 text-primary" />
                  <span>{supplier.contactInfo}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <Package className="h-5 w-5 text-primary" />
                <span>{products.length} Products Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12 md:py-16">
        {/* Featured Products Section */}
        {featuredProducts.length > 0 && (
          <section className="mb-16">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Products</h2>
              <p className="text-muted-foreground text-lg">Handpicked selections from our store</p>
            </div>

            {productsLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-64 w-full" />
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => {
                  const stock = Number(product.stockQuantity);
                  const isOutOfStock = stock === 0;
                  const isLowStock = stock > 0 && stock < 20;

                  return (
                    <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 border-border/50 flex flex-col overflow-hidden">
                      <div className="relative h-64 w-full overflow-hidden bg-muted">
                        <img
                          src={getProductImageUrl(product)}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {isOutOfStock && (
                          <Badge variant="destructive" className="absolute top-3 right-3 shadow-md">
                            Out of Stock
                          </Badge>
                        )}
                        {isLowStock && (
                          <Badge className="absolute top-3 right-3 bg-orange-500 hover:bg-orange-600 shadow-md">
                            Low Stock
                          </Badge>
                        )}
                      </div>
                      <CardContent className="flex-1 pt-5 pb-4">
                        <CardTitle className="text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {product.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 mb-4 text-sm">
                          {product.description}
                        </CardDescription>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-primary">
                            ${(Number(product.price) / 100).toFixed(2)}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {stock} left
                          </Badge>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0 pb-4">
                        <Button
                          className="w-full gap-2"
                          onClick={() => handleAddToCart(product)}
                          disabled={isOutOfStock}
                          size="lg"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* All Products Section */}
        <section>
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">All Products</h2>
            <p className="text-muted-foreground text-lg">Browse our complete collection</p>
          </div>

          {/* Loading State */}
          {productsLoading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-56 w-full" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}

          {/* Products Grid */}
          {!productsLoading && allProducts.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allProducts.map((product) => {
                const stock = Number(product.stockQuantity);
                const isOutOfStock = stock === 0;
                const isLowStock = stock > 0 && stock < 20;

                return (
                  <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 border-border/50 flex flex-col overflow-hidden">
                    <div className="relative h-56 w-full overflow-hidden bg-muted">
                      <img
                        src={getProductImageUrl(product)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {isOutOfStock && (
                        <Badge variant="destructive" className="absolute top-3 right-3 shadow-md">
                          Out of Stock
                        </Badge>
                      )}
                      {isLowStock && (
                        <Badge className="absolute top-3 right-3 bg-orange-500 hover:bg-orange-600 shadow-md">
                          Low Stock
                        </Badge>
                      )}
                    </div>
                    <CardContent className="flex-1 pt-5 pb-4">
                      <CardTitle className="text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 mb-4 text-sm">
                        {product.description}
                      </CardDescription>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">
                          ${(Number(product.price) / 100).toFixed(2)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {stock} left
                        </Badge>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 pb-4">
                      <Button
                        className="w-full gap-2"
                        onClick={() => handleAddToCart(product)}
                        disabled={isOutOfStock}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {!productsLoading && allProducts.length === 0 && (
            <Card className="text-center py-20 border-border/50">
              <CardContent>
                <Package className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-3">No Products Yet</h3>
                <p className="text-muted-foreground text-lg mb-8">
                  This store hasn't added any products yet. Check back soon!
                </p>
                <Button onClick={() => navigate({ to: '/suppliers' })} variant="outline" size="lg">
                  Browse Other Stores
                </Button>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}
