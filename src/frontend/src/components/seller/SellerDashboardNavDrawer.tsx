import { X, Home, Package, ShoppingBag, Users, Megaphone, Tag, FileText, Globe, BarChart3, Store, Settings } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

interface SellerDashboardNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  supplierId: string;
  onProductsClick: () => void;
}

export default function SellerDashboardNavDrawer({
  isOpen,
  onClose,
  supplierId,
  onProductsClick,
}: SellerDashboardNavDrawerProps) {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate({ to: path });
    onClose();
  };

  const handlePlaceholder = (label: string) => {
    toast.info(`${label} - Coming soon`);
    onClose();
  };

  const handleProductsClick = () => {
    onProductsClick();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay - higher z-index to cover dashboard top bar */}
      <div
        className="fixed inset-0 bg-black/50 z-[60] transition-opacity"
        onClick={onClose}
      />

      {/* Drawer - even higher z-index to appear above overlay */}
      <div className="fixed left-0 top-0 bottom-0 w-72 bg-background z-[70] shadow-xl overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Navigation</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-md transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-2">
          <button
            onClick={() => handleNavigation('/seller-dashboard')}
            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-muted rounded-md transition-colors text-left"
          >
            <Home className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Home</span>
          </button>

          <button
            onClick={() => handlePlaceholder('Orders')}
            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-muted rounded-md transition-colors text-left"
          >
            <ShoppingBag className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Orders</span>
          </button>

          <button
            onClick={handleProductsClick}
            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-muted rounded-md transition-colors text-left"
          >
            <Package className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Products</span>
          </button>

          <button
            onClick={() => handlePlaceholder('Customers')}
            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-muted rounded-md transition-colors text-left"
          >
            <Users className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Customers</span>
          </button>

          <button
            onClick={() => handlePlaceholder('Marketing')}
            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-muted rounded-md transition-colors text-left"
          >
            <Megaphone className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Marketing</span>
          </button>

          <button
            onClick={() => handlePlaceholder('Discounts')}
            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-muted rounded-md transition-colors text-left"
          >
            <Tag className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Discounts</span>
          </button>

          <button
            onClick={() => handlePlaceholder('Content')}
            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-muted rounded-md transition-colors text-left"
          >
            <FileText className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Content</span>
          </button>

          <button
            onClick={() => handlePlaceholder('Markets')}
            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-muted rounded-md transition-colors text-left"
          >
            <Globe className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Markets</span>
          </button>

          <button
            onClick={() => handlePlaceholder('Analytics')}
            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-muted rounded-md transition-colors text-left"
          >
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Analytics</span>
          </button>

          <div className="my-4 border-t border-border" />

          <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Sales Channels
          </div>

          <button
            onClick={() => handleNavigation(`/store/${supplierId}`)}
            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-muted rounded-md transition-colors text-left"
          >
            <Store className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Online Store</span>
          </button>

          <div className="my-4 border-t border-border" />

          <button
            onClick={() => handleNavigation('/create-store')}
            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-muted rounded-md transition-colors text-left"
          >
            <Settings className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Settings</span>
          </button>
        </nav>
      </div>
    </>
  );
}
