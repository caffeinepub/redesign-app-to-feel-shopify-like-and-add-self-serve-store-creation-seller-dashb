import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { CreditCard, Lock, ArrowLeft } from 'lucide-react';
import { useCreateCheckoutSession } from '../hooks/useQueries';
import { toast } from 'sonner';
import type { ShoppingItem } from '../backend';

type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  supplierName: string;
  image: string;
};

export default function CheckoutPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const createCheckout = useCreateCheckoutSession();
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      try {
        setCartItems(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse cart:', e);
      }
    }
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsProcessing(true);
    try {
      const items: ShoppingItem[] = cartItems.map(item => ({
        productName: item.name,
        productDescription: `Product from ${item.supplierName}`,
        priceInCents: BigInt(item.price),
        quantity: BigInt(item.quantity),
        currency: 'usd',
      }));

      const session = await createCheckout.mutateAsync(items);
      
      if (!session?.url) {
        throw new Error('Stripe session missing url');
      }
      
      localStorage.removeItem('cart');
      window.location.href = session.url;
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to create checkout session. Please try again.');
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container py-12 max-w-4xl">
        <Card className="text-center py-20 border-border/50">
          <CardContent>
            <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-6">
              Add some products before checking out
            </p>
            <Button onClick={() => navigate({ to: '/products' })} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Products
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3">Checkout</h1>
        <p className="text-muted-foreground text-lg">
          Complete your purchase securely with Stripe
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <span className="font-medium">
                  ${((item.price * item.quantity) / 100).toFixed(2)}
                </span>
              </div>
            ))}
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${(subtotal / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (10%)</span>
                <span className="font-medium">${(tax / 100).toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">${(total / 100).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Lock className="h-4 w-4 text-primary" />
                Secure Payment with Stripe
              </div>
              <p className="text-xs text-muted-foreground">
                Your payment information is encrypted and secure. We never store your card details.
              </p>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={isProcessing || createCheckout.isPending}
              size="lg"
              className="w-full gap-2"
            >
              {isProcessing || createCheckout.isPending ? (
                <>
                  <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5" />
                  Pay ${(total / 100).toFixed(2)}
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By completing this purchase, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
