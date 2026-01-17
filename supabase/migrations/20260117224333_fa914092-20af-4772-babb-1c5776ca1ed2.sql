-- Enable realtime for video_analyses table to support live notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.video_analyses;