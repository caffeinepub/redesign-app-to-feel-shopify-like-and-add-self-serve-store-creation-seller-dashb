import { Search, Bell, Menu, User } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';

interface SellerDashboardTopBarProps {
  storeName: string;
}

export default function SellerDashboardTopBar({ storeName }: SellerDashboardTopBarProps) {
  const initials = storeName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="bg-[oklch(0.18_0.01_240)] border-b border-[oklch(0.25_0.01_240)] sticky top-0 z-50">
      <div className="container max-w-5xl">
        <div className="flex items-center gap-3 py-3">
          {/* Menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 shrink-0"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Search input */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search"
                className="pl-9 bg-[oklch(0.25_0.01_240)] border-[oklch(0.3_0.01_240)] text-white placeholder:text-muted-foreground focus-visible:ring-primary/50"
                readOnly
              />
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
            >
              <Bell className="h-5 w-5" />
            </Button>

            <Avatar className="h-8 w-8 bg-primary">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </div>
  );
}
