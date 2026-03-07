import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable/index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { ArrowRight, Loader2, Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');

  const { signIn, signUp, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = location.state?.from?.pathname || '/';

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'forgot') {
      if (!email.trim()) {
        toast({ title: 'Missing email', description: 'Please enter your email address', variant: 'destructive' });
        return;
      }
      setIsSubmitting(true);
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) {
          toast({ title: 'Error', description: error.message, variant: 'destructive' });
        } else {
          toast({ title: 'Check your email', description: 'We sent you a password reset link.' });
          setMode('signin');
        }
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (!email.trim() || !password.trim()) {
      toast({ title: 'Missing fields', description: 'Please fill in all fields', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'signup') {
        const { error } = await signUp(email, password);
        if (error) {
          toast({ title: 'Sign Up Failed', description: error.message, variant: 'destructive' });
        } else {
          setPendingEmail(email);
          setMode('verify-otp');
          setOtpValue('');
          toast({ title: 'OTP Sent', description: 'We sent a 6-digit verification code to your email.' });
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast({ title: 'Sign In Failed', description: error.message, variant: 'destructive' });
        } else {
          navigate(from, { replace: true });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otpValue.length !== 6) {
      toast({ title: 'Invalid OTP', description: 'Please enter the full 6-digit code', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: pendingEmail,
        token: otpValue,
        type: 'signup',
      });
      if (error) {
        toast({ title: 'Verification Failed', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Email Verified!', description: 'Your account is now active.' });
        navigate(from, { replace: true });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: pendingEmail,
      });
      if (error) {
        toast({ title: 'Resend Failed', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'OTP Resent', description: 'Check your email for a new verification code.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth('google', {
        redirect_uri: window.location.origin,
      });
      if (error) {
        toast({ title: 'Google Sign In Failed', description: error.message, variant: 'destructive' });
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // OTP Verification Screen
  if (mode === 'verify-otp') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="fixed inset-0 bg-gradient-to-br from-terminal-cyan/5 via-transparent to-terminal-gold/5 pointer-events-none" />

        <div className="relative z-10 w-full max-w-md space-y-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-terminal-cyan to-terminal-blue flex items-center justify-center shadow-lg shadow-terminal-cyan/20">
              <ShieldCheck className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground">Verify Your Email</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Enter the 6-digit code sent to <span className="text-terminal-cyan font-mono">{pendingEmail}</span>
              </p>
            </div>
          </div>

          <Card className="border-border bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-lg">Enter OTP</CardTitle>
              <CardDescription>Check your inbox (and spam folder)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otpValue}
                  onChange={(value) => setOtpValue(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="w-12 h-14 text-lg font-mono bg-secondary/50 border-border" />
                    <InputOTPSlot index={1} className="w-12 h-14 text-lg font-mono bg-secondary/50 border-border" />
                    <InputOTPSlot index={2} className="w-12 h-14 text-lg font-mono bg-secondary/50 border-border" />
                    <InputOTPSlot index={3} className="w-12 h-14 text-lg font-mono bg-secondary/50 border-border" />
                    <InputOTPSlot index={4} className="w-12 h-14 text-lg font-mono bg-secondary/50 border-border" />
                    <InputOTPSlot index={5} className="w-12 h-14 text-lg font-mono bg-secondary/50 border-border" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button
                onClick={handleVerifyOtp}
                className="w-full bg-gradient-to-r from-terminal-cyan to-terminal-blue hover:opacity-90"
                disabled={isSubmitting || otpValue.length !== 6}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify & Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>

              <div className="text-center space-y-2">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isSubmitting}
                  className="text-sm text-terminal-cyan hover:underline disabled:opacity-50"
                >
                  Didn't receive it? Resend OTP
                </button>
                <br />
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setOtpValue(''); }}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  ← Back to Sign Up
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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

        {/* Login Card */}
        <Card className="border-border bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-lg">
              {mode === 'forgot' ? 'Reset Password' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </CardTitle>
            <CardDescription>
              {mode === 'forgot'
                ? "Enter your email and we'll send you a reset link"
                : mode === 'signin' ? 'Enter your credentials to continue' : 'Sign up for a new account'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mode !== 'forgot' && (
              <>
                {/* Google Sign In */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center gap-3 h-11"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading || isSubmitting}
                >
                  {isGoogleLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                  )}
                  Continue with Google
                </Button>

                <div className="relative">
                  <Separator />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                    or
                  </span>
                </div>
              </>
            )}

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-secondary/50 pl-10"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              {mode !== 'forgot' && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-secondary/50 pl-10 pr-10"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}
              {mode === 'signin' && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-xs text-muted-foreground hover:text-terminal-cyan"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-terminal-cyan to-terminal-blue hover:opacity-90"
                disabled={isSubmitting || isGoogleLoading}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {mode === 'forgot' ? 'Sending...' : mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : (
                  <>
                    {mode === 'forgot' ? 'Send Reset Link' : mode === 'signin' ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="text-center space-y-1">
              {mode === 'forgot' ? (
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-sm text-terminal-cyan hover:underline"
                >
                  Back to Sign In
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                  className="text-sm text-terminal-cyan hover:underline"
                >
                  {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Market Status */}
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
