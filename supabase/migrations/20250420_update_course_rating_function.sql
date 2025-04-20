
-- Create or replace the function to update course ratings when reviews change
CREATE OR REPLACE FUNCTION public.update_course_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the course rating
  UPDATE public.courses
  SET rating = (
    SELECT COALESCE(AVG(rating), 0)
    FROM public.reviews
    WHERE course_id = CASE 
      WHEN TG_OP = 'DELETE' THEN OLD.course_id
      ELSE NEW.course_id
    END
  )
  WHERE id = CASE 
    WHEN TG_OP = 'DELETE' THEN OLD.course_id
    ELSE NEW.course_id
  END;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Drop the existing trigger if it exists
DROP TRIGGER IF EXISTS update_course_rating_trigger ON public.reviews;

-- Create the trigger to update course rating when a review is added/updated/deleted
CREATE TRIGGER update_course_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW EXECUTE PROCEDURE public.update_course_rating();
