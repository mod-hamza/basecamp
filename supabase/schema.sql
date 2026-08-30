-- Basecamp / Student Partner - Supabase Schema
-- Source: PRD Section 4 (14 tables, exact order)
-- This file is the canonical full schema (idempotent run in SQL Editor).
-- For incremental updates, add supabase/migrations/002_*.sql, 003_*.sql, etc. and append here.

-- 4.1 profiles (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  currency TEXT DEFAULT 'AED',
  timezone TEXT DEFAULT 'Asia/Dubai',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 4.2 agent_profile
CREATE TABLE public.agent_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  courses JSONB DEFAULT '[]',
  monthly_budget NUMERIC DEFAULT 0,
  savings_goal_target NUMERIC DEFAULT 0,
  savings_goal_deadline DATE,
  known_recurring_expenses JSONB DEFAULT '[]',
  study_preferences JSONB DEFAULT '{}',
  calendar_connected BOOLEAN DEFAULT FALSE,
  gcal_refresh_token TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE public.agent_profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their profile" ON public.agent_profile
  FOR ALL USING (auth.uid() = user_id);

-- 4.3 chats
CREATE TABLE public.chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'New Chat',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their chats" ON public.chats
  FOR ALL USING (auth.uid() = user_id);

-- 4.4 messages
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID REFERENCES public.chats(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  agent_tag TEXT CHECK (agent_tag IN ('router', 'study', 'finance', 'calendar', 'general')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their messages" ON public.messages
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_messages_chat_id ON public.messages(chat_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);

-- 4.5 courses
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT,
  exam_date DATE,
  typical_class_times JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their courses" ON public.courses
  FOR ALL USING (auth.uid() = user_id);

-- 4.6 lectures
CREATE TABLE public.lectures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  week_number INTEGER,
  chapter TEXT,
  lecture_number INTEGER,
  title TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  audio_url TEXT,
  duration_seconds INTEGER,
  processing_status TEXT DEFAULT 'pending' CHECK (
    processing_status IN ('pending', 'transcribing', 'generating_notes', 'complete', 'error')
  ),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.lectures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their lectures" ON public.lectures
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_lectures_course_id ON public.lectures(course_id);

-- 4.7 transcripts
CREATE TABLE public.transcripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lecture_id UUID REFERENCES public.lectures(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  raw_text TEXT NOT NULL,
  word_count INTEGER,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.transcripts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their transcripts" ON public.transcripts
  FOR ALL USING (auth.uid() = user_id);

-- 4.8 notes
CREATE TABLE public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lecture_id UUID REFERENCES public.lectures(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  structured_notes TEXT NOT NULL,
  summary TEXT NOT NULL,
  key_concepts JSONB DEFAULT '[]',
  formulas JSONB DEFAULT '[]',
  definitions JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their notes" ON public.notes
  FOR ALL USING (auth.uid() = user_id);

-- 4.9 practice_questions
CREATE TABLE public.practice_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lecture_id UUID REFERENCES public.lectures(id) ON DELETE CASCADE,
  note_id UUID REFERENCES public.notes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_type TEXT CHECK (question_type IN ('mcq', 'short_answer', 'true_false')),
  question TEXT NOT NULL,
  options JSONB,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.practice_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their questions" ON public.practice_questions
  FOR ALL USING (auth.uid() = user_id);

-- 4.10 transactions
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'AED',
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  subcategory TEXT,
  description TEXT,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their transactions" ON public.transactions
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_transactions_user_date ON public.transactions(user_id, transaction_date DESC);
CREATE INDEX idx_transactions_category ON public.transactions(user_id, category);

-- 4.11 budgets
CREATE TABLE public.budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  monthly_limit NUMERIC NOT NULL,
  currency TEXT DEFAULT 'AED',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, start_date)
);

ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their budgets" ON public.budgets
  FOR ALL USING (auth.uid() = user_id);

-- 4.12 savings_goals
CREATE TABLE public.savings_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  target_amount NUMERIC NOT NULL,
  current_amount NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'AED',
  deadline DATE,
  daily_target NUMERIC,
  weekly_target NUMERIC,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their goals" ON public.savings_goals
  FOR ALL USING (auth.uid() = user_id);

-- 4.13 recurring_expenses
CREATE TABLE public.recurring_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'AED',
  category TEXT NOT NULL,
  frequency TEXT CHECK (frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
  day_of_month INTEGER,
  next_due DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.recurring_expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their recurring expenses" ON public.recurring_expenses
  FOR ALL USING (auth.uid() = user_id);

-- 4.14 calendar_events
CREATE TABLE public.calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  gcal_event_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  is_exam BOOLEAN DEFAULT FALSE,
  is_class BOOLEAN DEFAULT FALSE,
  agent_suggested BOOLEAN DEFAULT FALSE,
  reminder_set BOOLEAN DEFAULT FALSE,
  synced_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own their calendar events" ON public.calendar_events
  FOR ALL USING (auth.uid() = user_id);
