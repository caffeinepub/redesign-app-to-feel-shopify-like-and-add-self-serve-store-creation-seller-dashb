import { Link } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { XCircle, ArrowLeft, RotateCcw } from 'lucide-react';

export default function PaymentFailurePage() {
  return (
    <div className="container py-12 max-w-2xl">
      <Card className="text-center py-12 border-destructive/20 bg-destructive/5">
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-destructive/20 blur-2xl rounded-full"></div>
              <XCircle className="relative h-20 w-20 text-destructive mx-auto" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Payment Cancelled</h1>
            <p className="text-muted-foreground text-lg">
              Your payment was not completed. No charges have been made to your account.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/cart">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Return to Cart
              </Button>
            </Link>
            <Link to="/checkout">
              <Button className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Try Again
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
