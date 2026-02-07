import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate('/', { replace: true });
    return null;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast({ title: 'Missing fields', description: 'Please enter both email and password', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast({ title: 'Welcome back!', description: 'Signed in successfully' });
      navigate('/', { replace: true });
    } catch (err: any) {
      toast({ title: 'Sign in failed', description: err.message || 'Please try again', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast({ title: 'Missing fields', description: 'Please enter both email and password', variant: 'destructive' });
      return;
    }
    if (password.length < 6) {
      toast({ title: 'Weak password', description: 'Password must be at least 6 characters', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) throw error;
      toast({
        title: 'Check your email',
        description: 'We sent you a confirmation link. Please verify your email before signing in.',
      });
      setActiveTab('signin');
    } catch (err: any) {
      toast({ title: 'Sign up failed', description: err.message || 'Please try again', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="fixed inset-0 bg-gradient-to-br from-terminal-cyan/5 via-transparent to-terminal-gold/5 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-terminal-cyan to-terminal-blue flex items-center justify-center shadow-lg shadow-terminal-cyan/20">
            <span className="text-3xl font-bold text-primary-foreground">₹</span>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">StockPulse</h1>
            <p className="text-muted-foreground text-sm mt-1">Your Indian Market Analytics Terminal</p>
          </div>
        </div>

        {/* Auth Card */}
        <Card className="border-border bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-lg">{activeTab === 'signin' ? 'Sign In' : 'Create Account'}</CardTitle>
            <CardDescription>
              {activeTab === 'signin' ? 'Enter your credentials to continue' : 'Sign up with your email and password'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'signin' | 'signup')}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input id="signin-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-secondary/50" disabled={isSubmitting} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input id="signin-password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-secondary/50" disabled={isSubmitting} />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-terminal-cyan to-terminal-blue hover:opacity-90" disabled={isSubmitting}>
                    {isSubmitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Signing in...</> : <>Sign In<ArrowRight className="h-4 w-4 ml-2" /></>}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input id="signup-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-secondary/50" disabled={isSubmitting} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input id="signup-password" type="password" placeholder="Min. 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-secondary/50" disabled={isSubmitting} />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-terminal-cyan to-terminal-blue hover:opacity-90" disabled={isSubmitting}>
                    {isSubmitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Creating account...</> : <>Create Account<ArrowRight className="h-4 w-4 ml-2" /></>}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-terminal-green/10 text-terminal-green text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-terminal-green animate-pulse" />
            NSE & BSE Markets
          </div>
        </div>
      </div>
    </div>
  );
}
