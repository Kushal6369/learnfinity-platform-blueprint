
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
    
    return (data || []).map(course => ({
      ...course,
      rating: (course as any).rating ?? 0
    })) as Course[];
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
    
    return (data || []).map(course => ({
      ...course,
      rating: (course as any).rating ?? 0
    })) as Course[];
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
    
    return (data || []).map(item => ({
      ...item.courses,
      rating: (item.courses as any)?.rating ?? 0
    })) as Course[];
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
      rating: (data as any)?.rating ?? 0
    } as Course;
  } catch (err) {
    console.error('Error in getCourseById:', err);
    toast.error('An unexpected error occurred');
    return null;
  }
};

// Import the separate files for course management functions
import { 
  createCourse, 
  updateCourse, 
  deleteCourse,
  toggleCoursePublishStatus,
  enrollUserInCourse,
  isUserEnrolled
} from './courseManagementService';

// Export all functions
export {
  createCourse,
  updateCourse,
  deleteCourse,
  toggleCoursePublishStatus,
  enrollUserInCourse,
  isUserEnrolled
};
