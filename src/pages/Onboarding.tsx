import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function Onboarding() {
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const hasMinLength = username.length >= 6;
  const hasMaxLength = username.length <= 10;
  const hasNumber = /\d/.test(username);
  const isValid = hasMinLength && hasMaxLength && hasNumber;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || !user) return;

    setIsSubmitting(true);
    const { error } = await supabase
      .from('profiles')
      .upsert({ user_id: user.id, email: user.email, display_name: username }, { onConflict: 'user_id' });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Welcome!', description: `Username set to ${username}` });
      navigate('/');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto bg-gradient-to-br from-terminal-cyan to-terminal-blue flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-foreground">₹</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Welcome to StockPulse</h1>
          <p className="text-muted-foreground text-sm">Choose a username to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Input
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="text-center text-lg h-12"
              autoFocus
            />
            <div className="space-y-1 text-xs">
              <p className={hasMinLength ? 'text-terminal-green' : 'text-destructive'}>
                {hasMinLength ? '✓' : '✗'} Minimum 6 characters
              </p>
              <p className={hasMaxLength ? 'text-terminal-green' : 'text-destructive'}>
                {hasMaxLength ? '✓' : '✗'} Maximum 10 characters
              </p>
              <p className={hasNumber ? 'text-terminal-green' : 'text-destructive'}>
                {hasNumber ? '✓' : '✗'} Must include at least one number
              </p>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={!isValid || isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Continue'}
          </Button>
        </form>
      </div>
    </div>
  );
}
