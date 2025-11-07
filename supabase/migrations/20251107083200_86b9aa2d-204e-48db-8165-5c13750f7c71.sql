-- Create function to delete the current user's account
CREATE OR REPLACE FUNCTION public.delete_current_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete the user from auth.users (this will cascade to sessions table)
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;