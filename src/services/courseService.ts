
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types
export interface Course {
  id: string;
  title: string;
  description: string | null;
  instructor_id: string;
  category: string;
  thumbnail_url: string | null;
  price: number;
  duration: string;
  level: string;
  rating: number;
  created_at: string;
  updated_at: string;
  published: boolean;
}

export interface CourseCreateInput {
  title: string;
  description?: string;
  category: string;
  thumbnail_url?: string;
  price: number;
  duration: string;
  level: string;
}

export interface CourseUpdateInput extends Partial<CourseCreateInput> {
  published?: boolean;
}

// Get all published courses
export const getPublishedCourses = async (): Promise<Course[]> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('published', true);
    
    if (error) {
      console.error('Error fetching published courses:', error);
      toast.error('Failed to load courses');
      return [];
    }
    
    // Ensure rating is included in the returned data
    return (data || []).map(course => ({
      ...course,
      rating: course.rating || 0
    }));
  } catch (err) {
    console.error('Error in getPublishedCourses:', err);
    toast.error('An unexpected error occurred');
    return [];
  }
};

// Get courses taught by instructor
export const getInstructorCourses = async (instructorId: string): Promise<Course[]> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('instructor_id', instructorId);
    
    if (error) {
      console.error('Error fetching instructor courses:', error);
      toast.error('Failed to load your courses');
      return [];
    }
    
    // Ensure rating is included in the returned data
    return (data || []).map(course => ({
      ...course,
      rating: course.rating || 0
    }));
  } catch (err) {
    console.error('Error in getInstructorCourses:', err);
    toast.error('An unexpected error occurred');
    return [];
  }
};

// Get courses enrolled by user
export const getUserEnrolledCourses = async (userId: string): Promise<Course[]> => {
  try {
    const { data, error } = await supabase
      .from('enrollments')
      .select('course_id, courses(*)')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching enrolled courses:', error);
      toast.error('Failed to load your enrolled courses');
      return [];
    }
    
    // Transform the result to get an array of courses with rating
    return (data || []).map(item => ({
      ...item.courses,
      rating: item.courses.rating || 0
    }));
  } catch (err) {
    console.error('Error in getUserEnrolledCourses:', err);
    toast.error('An unexpected error occurred');
    return [];
  }
};

// Get course by ID
export const getCourseById = async (courseId: string): Promise<Course | null> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single();
    
    if (error) {
      console.error('Error fetching course:', error);
      toast.error('Failed to load course details');
      return null;
    }
    
    return {
      ...data,
      rating: data.rating || 0
    };
  } catch (err) {
    console.error('Error in getCourseById:', err);
    toast.error('An unexpected error occurred');
    return null;
  }
};

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
      rating: 0  // New courses start with a rating of 0
    };
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
      rating: data.rating || 0
    };
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
