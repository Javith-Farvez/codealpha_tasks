
-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles viewable by authenticated" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Meetings
CREATE TABLE public.meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 30,
  room_code TEXT NOT NULL UNIQUE DEFAULT substr(md5(random()::text), 1, 10),
  status TEXT NOT NULL DEFAULT 'scheduled', -- scheduled | live | ended | cancelled
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.meetings TO authenticated;
GRANT ALL ON public.meetings TO service_role;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Meetings viewable by authenticated" ON public.meetings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can create meetings" ON public.meetings FOR INSERT TO authenticated WITH CHECK (auth.uid() = host_id);
CREATE POLICY "Host can update meeting" ON public.meetings FOR UPDATE TO authenticated USING (auth.uid() = host_id);
CREATE POLICY "Host can delete meeting" ON public.meetings FOR DELETE TO authenticated USING (auth.uid() = host_id);

-- Participants
CREATE TABLE public.meeting_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID NOT NULL REFERENCES public.meetings ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  left_at TIMESTAMPTZ,
  UNIQUE (meeting_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.meeting_participants TO authenticated;
GRANT ALL ON public.meeting_participants TO service_role;
ALTER TABLE public.meeting_participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants viewable by authenticated" ON public.meeting_participants FOR SELECT TO authenticated USING (true);
CREATE POLICY "User can join meetings" ON public.meeting_participants FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "User can update own participation" ON public.meeting_participants FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "User can delete own participation" ON public.meeting_participants FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.meetings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.meeting_participants;

-- Chat messages within meetings
CREATE TABLE public.meeting_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID NOT NULL REFERENCES public.meetings ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.meeting_messages TO authenticated;
GRANT ALL ON public.meeting_messages TO service_role;
ALTER TABLE public.meeting_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Messages viewable by authenticated" ON public.meeting_messages FOR SELECT TO authenticated USING (true);
CREATE POLICY "User can send messages" ON public.meeting_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
ALTER PUBLICATION supabase_realtime ADD TABLE public.meeting_messages;
