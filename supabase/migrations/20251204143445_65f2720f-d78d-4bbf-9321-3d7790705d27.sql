-- Create moves table for tracking user moves
CREATE TABLE public.moves (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  from_address TEXT NOT NULL,
  to_address TEXT NOT NULL,
  moving_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create move_updates table for real-time tracking
CREATE TABLE public.move_updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  move_id UUID NOT NULL REFERENCES public.moves(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  message TEXT NOT NULL,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create documents table for document management
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  move_id UUID REFERENCES public.moves(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table for team chat
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  move_id UUID NOT NULL REFERENCES public.moves(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  is_from_team BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.moves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.move_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS policies for moves
CREATE POLICY "Users can view their own moves" ON public.moves FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own moves" ON public.moves FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own moves" ON public.moves FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own moves" ON public.moves FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for move_updates
CREATE POLICY "Users can view updates for their moves" ON public.move_updates FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.moves WHERE moves.id = move_updates.move_id AND moves.user_id = auth.uid()));

-- RLS policies for documents
CREATE POLICY "Users can view their own documents" ON public.documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own documents" ON public.documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own documents" ON public.documents FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for messages
CREATE POLICY "Users can view messages for their moves" ON public.messages FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.moves WHERE moves.id = messages.move_id AND moves.user_id = auth.uid()));
CREATE POLICY "Users can send messages for their moves" ON public.messages FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.moves WHERE moves.id = messages.move_id AND moves.user_id = auth.uid()));

-- Enable realtime for messages and move_updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.move_updates;

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- Storage policies
CREATE POLICY "Users can upload their own documents" ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can view their own documents" ON storage.objects FOR SELECT 
  USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own documents" ON storage.objects FOR DELETE 
  USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);