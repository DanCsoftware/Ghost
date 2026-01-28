import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Button } from '@/components/ui/button';
import { Mail, Ghost } from 'lucide-react';
import { toast } from 'sonner';

interface GhostEntryProps {
  onAuthSuccess: (accessToken: string) => void;
}

export default function GhostEntry({ onAuthSuccess }: GhostEntryProps) {
  const [isLoading, setIsLoading] = useState(false);

  const login = useGoogleLogin({
    onSuccess: (response) => {
      console.log('Gmail auth success');
      onAuthSuccess(response.access_token);
      toast.success('Connected to Gmail!');
      setIsLoading(false);
    },
    onError: (error) => {
      console.error('Gmail auth error:', error);
      toast.error('Failed to connect to Gmail');
      setIsLoading(false);
    },
    scope: 'https://www.googleapis.com/auth/gmail.readonly',
  });

  const handleConnect = () => {
    setIsLoading(true);
    login();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <Ghost className="mx-auto h-16 w-16 text-ghost-accent" strokeWidth={1.5} />
          <h1 className="mt-6 text-4xl font-bold tracking-tight">Ghost</h1>
          <p className="mt-3 text-muted-foreground">
            Stop wondering if you've been ghosted. Track your job applications and see which companies actually respond.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={handleConnect}
            disabled={isLoading}
            size="lg"
            className="w-full"
          >
            <Mail className="mr-2 h-5 w-5" />
            {isLoading ? 'Connecting...' : 'Connect Gmail'}
          </Button>
          
          <p className="text-xs text-muted-foreground">
            We only read emails to find job applications. Your data never leaves your browser.
          </p>
        </div>
      </div>
    </div>
  );
}