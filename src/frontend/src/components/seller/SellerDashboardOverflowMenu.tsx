import { MoreVertical, Settings, ExternalLink, LogOut } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';

interface SellerDashboardOverflowMenuProps {
  supplierId: string;
}

export default function SellerDashboardOverflowMenu({ supplierId }: SellerDashboardOverflowMenuProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { clear } = useInternetIdentity();

  const handleStoreSettings = () => {
    navigate({ to: '/create-store' });
  };

  const handleViewStore = () => {
    navigate({ to: `/store/${supplierId}` });
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    // Clear cart from localStorage
    localStorage.removeItem('cart');
    navigate({ to: '/' });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10"
        >
          <MoreVertical className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 z-[50] bg-white border border-gray-200 shadow-lg text-gray-900"
        sideOffset={8}
      >
        <DropdownMenuItem 
          onClick={handleStoreSettings} 
          className="cursor-pointer text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900"
        >
          <Settings className="h-4 w-4 mr-2" />
          Store Settings
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleViewStore} 
          className="cursor-pointer text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          View Store
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-200" />
        <DropdownMenuItem 
          onClick={handleLogout} 
          className="cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-600"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
