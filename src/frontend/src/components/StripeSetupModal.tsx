import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useIsStripeConfigured, useIsCallerAdmin, useSetStripeConfiguration } from '../hooks/useQueries';
import { toast } from 'sonner';
import { CreditCard } from 'lucide-react';

export default function StripeSetupModal() {
  const [open, setOpen] = useState(false);
  const [secretKey, setSecretKey] = useState('');
  const [countries, setCountries] = useState('US,CA,GB');
  
  const { data: isConfigured, isLoading: configLoading } = useIsStripeConfigured();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const setConfig = useSetStripeConfiguration();

  useEffect(() => {
    if (!configLoading && !adminLoading && isAdmin && !isConfigured) {
      setOpen(true);
    }
  }, [isConfigured, isAdmin, configLoading, adminLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!secretKey.trim()) {
      toast.error('Please enter your Stripe secret key');
      return;
    }

    const allowedCountries = countries.split(',').map(c => c.trim()).filter(Boolean);
    
    if (allowedCountries.length === 0) {
      toast.error('Please enter at least one country code');
      return;
    }

    try {
      await setConfig.mutateAsync({ secretKey, allowedCountries });
      toast.success('Stripe configured successfully!');
      setOpen(false);
    } catch (error) {
      toast.error('Failed to configure Stripe');
      console.error(error);
    }
  };

  if (!isAdmin || isConfigured) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Configure Stripe Payments
          </DialogTitle>
          <DialogDescription>
            Set up Stripe to enable payment processing on your platform.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="secretKey">Stripe Secret Key</Label>
            <Input
              id="secretKey"
              type="password"
              placeholder="sk_test_..."
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Get your secret key from the Stripe Dashboard
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="countries">Allowed Countries (comma-separated)</Label>
            <Input
              id="countries"
              placeholder="US,CA,GB,AU"
              value={countries}
              onChange={(e) => setCountries(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Use ISO 3166-1 alpha-2 country codes
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={setConfig.isPending}>
            {setConfig.isPending ? 'Configuring...' : 'Configure Stripe'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
