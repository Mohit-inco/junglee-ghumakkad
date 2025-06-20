
-- Create a table to store registered admin phone numbers
CREATE TABLE public.admin_phone_numbers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on the table
ALTER TABLE public.admin_phone_numbers ENABLE ROW LEVEL SECURITY;

-- Create a policy that only allows admins to view and manage phone numbers
-- (This assumes you have admin users in your system)
CREATE POLICY "Only admins can manage admin phone numbers" 
  ON public.admin_phone_numbers 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- Insert some default admin phone numbers (you can modify these)
INSERT INTO public.admin_phone_numbers (phone_number) VALUES 
  ('+1234567890'),
  ('+919876543210');

-- Create a function to check if a phone number is registered as admin
CREATE OR REPLACE FUNCTION public.is_admin_phone_number(phone TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.admin_phone_numbers 
    WHERE phone_number = phone AND is_active = true
  );
$$;
