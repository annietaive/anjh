-- Create assignments table for teacher homework management
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  lesson_id BIGINT NOT NULL,
  due_date DATE NOT NULL,
  assigned_to_grade BIGINT NOT NULL CHECK (assigned_to_grade >= 6 AND assigned_to_grade <= 9),
  assigned_to_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_assignments_teacher_id ON public.assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_assignments_status ON public.assignments(status);
CREATE INDEX IF NOT EXISTS idx_assignments_grade ON public.assignments(assigned_to_grade);
CREATE INDEX IF NOT EXISTS idx_assignments_user_id ON public.assignments(assigned_to_user_id);

-- Enable Row Level Security
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

-- Policy: Teachers can view their own assignments
CREATE POLICY "Teachers can view own assignments" ON public.assignments
  FOR SELECT
  USING (auth.uid() = teacher_id);

-- Policy: Teachers can create assignments
CREATE POLICY "Teachers can create assignments" ON public.assignments
  FOR INSERT
  WITH CHECK (auth.uid() = teacher_id);

-- Policy: Teachers can update their own assignments
CREATE POLICY "Teachers can update own assignments" ON public.assignments
  FOR UPDATE
  USING (auth.uid() = teacher_id);

-- Policy: Teachers can delete their own assignments
CREATE POLICY "Teachers can delete own assignments" ON public.assignments
  FOR DELETE
  USING (auth.uid() = teacher_id);

-- Optional: Students can view assignments for their grade or assigned to them specifically
CREATE POLICY "Students can view assignments for their grade" ON public.assignments
  FOR SELECT
  USING (
    assigned_to_grade = (
      SELECT grade FROM public.user_profiles WHERE user_id = auth.uid()
    )
    OR assigned_to_user_id = auth.uid()
  );

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_assignments_updated_at
  BEFORE UPDATE ON public.assignments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
