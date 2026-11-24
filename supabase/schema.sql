-- ====================================================================
-- DSA PREP HUB - SUPABASE POSTGRESQL DATABASE SCHEMA
-- Target Database: Supabase PostgreSQL (auth.users integration)
-- ====================================================================

-- Enable pgcrypto if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- --------------------------------------------------------------------
-- 1. STUDENT PROFILES TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    college TEXT DEFAULT 'Dr. D. Y. Patil Institute of Technology, Pimpri',
    department TEXT DEFAULT 'AI & Data Science Engineering',
    semester TEXT DEFAULT 'Semester III (SE)',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- --------------------------------------------------------------------
-- 2. QUESTION PROGRESS TABLE (Mandatory: tracks is_done per question)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.question_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question_id TEXT NOT NULL,
    is_done BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_question UNIQUE (user_id, question_id)
);

-- Indices for rapid user lookups and progress aggregation
CREATE INDEX IF NOT EXISTS idx_question_progress_user_id ON public.question_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_question_progress_question_id ON public.question_progress(question_id);

-- Enable RLS on question_progress
ALTER TABLE public.question_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read only their own question progress"
    ON public.question_progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own question progress"
    ON public.question_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update only their own question progress"
    ON public.question_progress FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete only their own question progress"
    ON public.question_progress FOR DELETE
    USING (auth.uid() = user_id);

-- --------------------------------------------------------------------
-- 3. USER BOOKMARKS TABLE (Save for revision)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question_id TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_bookmark UNIQUE (user_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_user_bookmarks_user_id ON public.user_bookmarks(user_id);

-- Enable RLS on user_bookmarks
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read only their own bookmarks"
    ON public.user_bookmarks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks"
    ON public.user_bookmarks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete only their own bookmarks"
    ON public.user_bookmarks FOR DELETE
    USING (auth.uid() = user_id);

-- --------------------------------------------------------------------
-- 4. AUTO PROFILE CREATION TRIGGER ON AUTH SIGNUP
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
