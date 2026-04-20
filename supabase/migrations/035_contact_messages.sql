-- Create contact_messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL
);

-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow public to insert (anonymous contact form)
CREATE POLICY "Allow public to insert contact messages" 
ON public.contact_messages 
FOR INSERT 
WITH CHECK (true);

-- Allow admins to read (for now, authenticated users could be restricted later)
CREATE POLICY "Allow authenticated users to view contact messages" 
ON public.contact_messages 
FOR SELECT 
USING (auth.role() = 'authenticated');
