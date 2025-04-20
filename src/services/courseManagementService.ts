
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Course, CourseCreateInput, CourseUpdateInput } from './courseService';

// Create a new course
export const createCourse = async (course: CourseCreateInput, instructorId: string): Promise<Course | null> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .insert({
        ...course,
        instructor_id: instructorId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        published: false, // New courses start as unpublished
        rating: 0 // Set initial rating to 0
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating course:', error);
      toast.error('Failed to create course');
      return null;
    }
    
    toast.success('Course created successfully');
    return {
      ...data,
      rating: (data as any)?.rating ?? 0
    } as Course;
  } catch (err) {
    console.error('Error in createCourse:', err);
    toast.error('An unexpected error occurred');
    return null;
  }
};

// Update a course
export const updateCourse = async (courseId: string, updates: CourseUpdateInput): Promise<Course | null> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', courseId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating course:', error);
      toast.error('Failed to update course');
      return null;
    }
    
    toast.success('Course updated successfully');
    return {
      ...data,
      rating: (data as any)?.rating ?? 0
    } as Course;
  } catch (err) {
    console.error('Error in updateCourse:', err);
    toast.error('An unexpected error occurred');
    return null;
  }
};

// Delete a course
export const deleteCourse = async (courseId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId);
    
    if (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course');
      return false;
    }
    
    toast.success('Course deleted successfully');
    return true;
  } catch (err) {
    console.error('Error in deleteCourse:', err);
    toast.error('An unexpected error occurred');
    return false;
  }
};

// Publish or unpublish a course
export const toggleCoursePublishStatus = async (courseId: string, publish: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('courses')
      .update({
        published: publish,
        updated_at: new Date().toISOString(),
      })
      .eq('id', courseId);
    
    if (error) {
      console.error('Error updating course publish status:', error);
      toast.error(`Failed to ${publish ? 'publish' : 'unpublish'} course`);
      return false;
    }
    
    toast.success(`Course ${publish ? 'published' : 'unpublished'} successfully`);
    return true;
  } catch (err) {
    console.error('Error in toggleCoursePublishStatus:', err);
    toast.error('An unexpected error occurred');
    return false;
  }
};

// Enroll a user in a course
export const enrollUserInCourse = async (userId: string, courseId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('enrollments')
      .insert({
        user_id: userId,
        course_id: courseId,
      });
    
    if (error) {
      console.error('Error enrolling in course:', error);
      toast.error('Failed to enroll in course');
      return false;
    }
    
    toast.success('Successfully enrolled in course');
    return true;
  } catch (err) {
    console.error('Error in enrollUserInCourse:', err);
    toast.error('An unexpected error occurred');
    return false;
  }
};

// Check if user is enrolled in course
export const isUserEnrolled = async (userId: string, courseId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error checking enrollment:', error);
      return false;
    }
    
    return !!data;
  } catch (err) {
    console.error('Error in isUserEnrolled:', err);
    return false;
  }
};
