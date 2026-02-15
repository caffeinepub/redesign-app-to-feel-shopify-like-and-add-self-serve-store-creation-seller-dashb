import { Home, Package, ShoppingBag, Users, Megaphone, Tag, FileText, Globe, BarChart3, Store, Settings, Eye, Plus } from 'lucide-react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
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
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

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

  const handleOnlineStoreView = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`/store/${supplierId}`, '_blank');
  };

  const isActive = (path: string) => currentPath === path;

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay - higher z-index to cover dashboard top bar */}
      <div
        className="fixed inset-0 bg-black/50 z-[60] transition-opacity"
        onClick={onClose}
      />

      {/* Drawer - even higher z-index to appear above overlay */}
      <div className="fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-gray-900 z-[70] shadow-xl overflow-y-auto">
        {/* Navigation Items */}
        <nav className="py-3">
          {/* Main Navigation */}
          <button
            onClick={() => handleNavigation('/seller-dashboard')}
            className={`flex items-center gap-3 w-full px-4 py-2.5 transition-colors text-left ${
              isActive('/seller-dashboard')
                ? 'bg-gray-100 dark:bg-gray-800'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
          >
            <Home className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            <span className="text-[15px] text-gray-900 dark:text-gray-100">Home</span>
          </button>

          <button
            onClick={() => handlePlaceholder('Orders')}
            className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
          >
            <ShoppingBag className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            <span className="text-[15px] text-gray-900 dark:text-gray-100">Orders</span>
          </button>

          <button
            onClick={handleProductsClick}
            className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
          >
            <Package className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            <span className="text-[15px] text-gray-900 dark:text-gray-100">Products</span>
          </button>

          <button
            onClick={() => handlePlaceholder('Customers')}
            className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
          >
            <Users className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            <span className="text-[15px] text-gray-900 dark:text-gray-100">Customers</span>
          </button>

          <button
            onClick={() => handlePlaceholder('Marketing')}
            className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
          >
            <Megaphone className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            <span className="text-[15px] text-gray-900 dark:text-gray-100">Marketing</span>
          </button>

          <button
            onClick={() => handlePlaceholder('Discounts')}
            className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
          >
            <Tag className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            <span className="text-[15px] text-gray-900 dark:text-gray-100">Discounts</span>
          </button>

          <button
            onClick={() => handlePlaceholder('Content')}
            className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
          >
            <FileText className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            <span className="text-[15px] text-gray-900 dark:text-gray-100">Content</span>
          </button>

          <button
            onClick={() => handlePlaceholder('Markets')}
            className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
          >
            <Globe className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            <span className="text-[15px] text-gray-900 dark:text-gray-100">Markets</span>
          </button>

          <button
            onClick={() => handlePlaceholder('Analytics')}
            className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
          >
            <BarChart3 className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            <span className="text-[15px] text-gray-900 dark:text-gray-100">Analytics</span>
          </button>

          {/* Sales Channels Section */}
          <div className="mt-6 mb-2 px-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Sales channels
              </h3>
              <span className="text-gray-400 dark:text-gray-500">›</span>
            </div>
          </div>

          <button
            onClick={() => handleNavigation(`/store/${supplierId}`)}
            className={`flex items-center justify-between w-full px-4 py-2.5 transition-colors text-left group ${
              isActive(`/store/${supplierId}`)
                ? 'bg-gray-100 dark:bg-gray-800'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Store className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              <span className="text-[15px] text-gray-900 dark:text-gray-100">Online Store</span>
            </div>
            <button
              onClick={handleOnlineStoreView}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="View store"
            >
              <Eye className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
          </button>

          {/* Apps Section */}
          <div className="mt-6 mb-2 px-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Apps
              </h3>
              <span className="text-gray-400 dark:text-gray-500">›</span>
            </div>
          </div>

          <button
            onClick={() => handlePlaceholder('Apps')}
            className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
          >
            <div className="flex items-center justify-center h-5 w-5 rounded-full border-2 border-gray-700 dark:border-gray-300">
              <Plus className="h-3 w-3 text-gray-700 dark:text-gray-300" />
            </div>
            <span className="text-[15px] text-gray-900 dark:text-gray-100">Add</span>
          </button>

          {/* Settings - Bottom Section */}
          <div className="mt-6 pt-3 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => handleNavigation('/create-store')}
              className={`flex items-center gap-3 w-full px-4 py-2.5 transition-colors text-left ${
                isActive('/create-store')
                  ? 'bg-gray-100 dark:bg-gray-800'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
            >
              <Settings className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              <span className="text-[15px] text-gray-900 dark:text-gray-100">Settings</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}
