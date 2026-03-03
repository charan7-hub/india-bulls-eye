import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState('');
  const [originalUsername, setOriginalUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const hasMinLength = username.length >= 6;
  const hasMaxLength = username.length <= 10;
  const hasNumber = /\d/.test(username);
  const isValid = hasMinLength && hasMaxLength && hasNumber;
  const hasChanges = username !== originalUsername;

  useEffect(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('display_name, avatar_url')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.display_name) {
          setUsername(data.display_name);
          setOriginalUsername(data.display_name);
        }
        if (data?.avatar_url) setAvatarUrl(data.avatar_url);
        setIsLoading(false);
      });
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Max 2MB allowed', variant: 'destructive' });
      return;
    }

    setIsUploading(true);
    const filePath = `${user.id}/avatar.${file.name.split('.').pop()}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast({ title: 'Upload failed', description: uploadError.message, variant: 'destructive' });
      setIsUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    const url = `${publicUrl}?t=${Date.now()}`;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: url })
      .eq('user_id', user.id);

    if (updateError) {
      toast({ title: 'Error', description: updateError.message, variant: 'destructive' });
    } else {
      setAvatarUrl(url);
      toast({ title: 'Avatar updated' });
    }
    setIsUploading(false);
  };

  const handleSaveUsername = async () => {
    if (!isValid || !user || !hasChanges) return;
    setIsSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({ display_name: username })
      .eq('user_id', user.id);

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setOriginalUsername(username);
      toast({ title: 'Username updated' });
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-terminal-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-sm font-bold text-foreground">Profile Settings</h1>
        </div>
      </header>

      <div className="max-w-md mx-auto p-6 space-y-8">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-4">
          <div
            className="relative w-24 h-24 bg-muted border border-border flex items-center justify-center cursor-pointer group overflow-hidden"
            onClick={() => fileInputRef.current?.click()}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-muted-foreground">
                {username?.[0]?.toUpperCase() || '?'}
              </span>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="h-5 w-5 text-white" />
            </div>
            {isUploading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
          />
          <p className="text-xs text-muted-foreground">Click to change avatar (max 2MB)</p>
        </div>

        {/* Email (read-only) */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</label>
          <div className="h-10 px-3 flex items-center bg-muted/50 border border-border text-sm text-muted-foreground">
            {user?.email}
          </div>
        </div>

        {/* Username */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Username</label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="h-10"
            placeholder="Enter username"
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

        <Button
          className="w-full"
          onClick={handleSaveUsername}
          disabled={!isValid || !hasChanges || isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
