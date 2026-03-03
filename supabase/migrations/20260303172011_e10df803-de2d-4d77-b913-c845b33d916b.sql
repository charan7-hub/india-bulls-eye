
INSERT INTO public.profiles (user_id, email, display_name)
SELECT id, email, COALESCE(raw_user_meta_data->>'full_name', email)
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.profiles)
ON CONFLICT DO NOTHING;
