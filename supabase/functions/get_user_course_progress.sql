
-- Create database function to get a user's progress for a course
CREATE OR REPLACE FUNCTION public.get_user_course_progress(p_user_id uuid, p_course_id uuid)
RETURNS SETOF lesson_progress AS $$
BEGIN
  RETURN QUERY
  SELECT lp.*
  FROM public.lesson_progress lp
  JOIN public.lessons l ON l.id = lp.lesson_id
  JOIN public.modules m ON m.id = l.module_id
  WHERE lp.user_id = p_user_id AND m.course_id = p_course_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
