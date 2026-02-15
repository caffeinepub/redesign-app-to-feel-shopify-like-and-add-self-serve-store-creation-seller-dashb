import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Store, Package, Settings, Eye, Palette, Truck, Globe } from 'lucide-react';
import type { SupplierProfile } from '../../backend';

interface SellerDashboardOnboardingCardsProps {
  supplierProfile: SupplierProfile;
  onAddProduct: () => void;
}

export default function SellerDashboardOnboardingCards({
  supplierProfile,
  onAddProduct,
}: SellerDashboardOnboardingCardsProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {/* Welcome header */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold mb-1">Good morning, let's get started.</h1>
        <p className="text-sm text-muted-foreground">
          Complete these steps to set up your Shanju store
        </p>
      </div>

      {/* Store name/settings card */}
      <Card className="border-border/50 hover:border-border transition-colors">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Store className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base mb-1">Add store name</CardTitle>
                <CardDescription className="text-sm">
                  Customize your store name, description, and contact information
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="shrink-0">Setup</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate({ to: '/create-store' })}
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              Store Settings
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate({ to: '/store/$supplierId', params: { supplierId: supplierProfile.id.toString() } })}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              View Store
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add product card */}
      <Card className="border-border/50 hover:border-border transition-colors">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base mb-1">Add your first product</CardTitle>
                <CardDescription className="text-sm">
                  Start by adding a product and a few key details
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="shrink-0">Required</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Button onClick={onAddProduct} className="gap-2">
            <Package className="h-4 w-4" />
            Add Product
          </Button>
        </CardContent>
      </Card>

      {/* Additional setup cards (visual only) */}
      <Card className="border-border/50 opacity-75">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <Palette className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <CardTitle className="text-base mb-1">Customize theme</CardTitle>
                <CardDescription className="text-sm">
                  Choose or generate a custom theme, then add your logo, colors, and images
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="shrink-0">Optional</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Button variant="outline" disabled>
            Customize
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/50 opacity-75">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <Truck className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <CardTitle className="text-base mb-1">Review your shipping rates</CardTitle>
                <CardDescription className="text-sm">
                  Set up shipping zones and rates for your products
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="shrink-0">Optional</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Button variant="outline" disabled>
            Review
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/50 opacity-75">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-muted rounded-lg">
                <Globe className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <CardTitle className="text-base mb-1">Customize domain</CardTitle>
                <CardDescription className="text-sm">
                  Add a custom domain to make your store more professional
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="shrink-0">Optional</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Button variant="outline" disabled>
            Customize
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
