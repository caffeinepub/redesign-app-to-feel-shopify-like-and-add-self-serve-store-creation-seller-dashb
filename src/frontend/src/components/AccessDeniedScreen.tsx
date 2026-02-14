import { Button } from './ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { ShieldAlert } from 'lucide-react';

export default function AccessDeniedScreen() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
            <ShieldAlert className="relative h-24 w-24 text-primary mx-auto" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Authentication Required</h1>
          <p className="text-muted-foreground">
            Please log in to access the platform and start browsing products from our suppliers.
          </p>
        </div>

        <Button
          onClick={login}
          disabled={isLoggingIn}
          size="lg"
          className="w-full"
        >
          {isLoggingIn ? (
            <>
              <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              Logging in...
            </>
          ) : (
            'Login to Continue'
          )}
        </Button>

        <p className="text-xs text-muted-foreground">
          By logging in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
