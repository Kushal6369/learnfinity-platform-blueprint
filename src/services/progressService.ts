
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types
export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

// Get progress for a user's lesson
export const getUserLessonProgress = async (userId: string, lessonId: string): Promise<LessonProgress | null> => {
  try {
    const { data, error } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error fetching lesson progress:', error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('Error in getUserLessonProgress:', err);
    return null;
  }
};

// Get all progress for a user in a course
export const getUserCourseProgress = async (userId: string, courseId: string): Promise<LessonProgress[]> => {
  try {
    // Join lesson_progress with lessons and modules to filter by course_id
    const { data, error } = await supabase
      .from('lesson_progress')
      .select(`
        *,
        lessons:lesson_id (
          id,
          module_id,
          modules:module_id (
            course_id
          )
        )
      `)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching course progress:', error);
      return [];
    }
    
    // Filter to only include progress for lessons in the specified course
    return (data || []).filter(progress => 
      progress.lessons?.modules?.course_id === courseId
    );
  } catch (err) {
    console.error('Error in getUserCourseProgress:', err);
    return [];
  }
};

// Mark a lesson as completed
export const markLessonCompleted = async (userId: string, lessonId: string): Promise<boolean> => {
  try {
    // Check if progress record exists
    const { data: existingProgress } = await supabase
      .from('lesson_progress')
      .select('id')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .single();
    
    if (existingProgress) {
      // Update existing progress
      const { error } = await supabase
        .from('lesson_progress')
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingProgress.id);
      
      if (error) {
        console.error('Error updating lesson progress:', error);
        return false;
      }
    } else {
      // Create new progress record
      const { error } = await supabase
        .from('lesson_progress')
        .insert({
          user_id: userId,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error creating lesson progress:', error);
        return false;
      }
    }
    
    return true;
  } catch (err) {
    console.error('Error in markLessonCompleted:', err);
    return false;
  }
};

// Mark a lesson as incomplete
export const markLessonIncomplete = async (userId: string, lessonId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('lesson_progress')
      .update({
        completed: false,
        completed_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('lesson_id', lessonId);
    
    if (error) {
      console.error('Error updating lesson progress:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error in markLessonIncomplete:', err);
    return false;
  }
};

// Calculate course completion percentage
export const calculateCourseCompletion = async (userId: string, courseId: string): Promise<number> => {
  try {
    // First, get all modules for the course
    const { data: modules, error: modulesError } = await supabase
      .from('modules')
      .select('id')
      .eq('course_id', courseId);
    
    if (modulesError || !modules || modules.length === 0) {
      console.error('Error fetching modules:', modulesError);
      return 0;
    }
    
    // Get module IDs
    const moduleIds = modules.map(module => module.id);
    
    // Get total number of lessons in the course
    const { count: totalLessons, error: countError } = await supabase
      .from('lessons')
      .select('id', { count: 'exact', head: true })
      .in('module_id', moduleIds);
    
    if (countError || totalLessons === null) {
      console.error('Error counting lessons:', countError);
      return 0;
    }
    
    // Get completed lessons for this course
    const { data: progress, error: progressError } = await supabase
      .from('lesson_progress')
      .select(`
        *,
        lessons:lesson_id (
          module_id
        )
      `)
      .eq('user_id', userId)
      .eq('completed', true);
    
    if (progressError) {
      console.error('Error counting completed lessons:', progressError);
      return 0;
    }
    
    // Filter to only count lessons in this course
    const completedLessons = progress ? progress.filter(p => 
      p.lessons && moduleIds.includes(p.lessons.module_id)
    ).length : 0;
    
    if (!totalLessons) return 0;
    
    return Math.round((completedLessons / totalLessons) * 100);
  } catch (err) {
    console.error('Error in calculateCourseCompletion:', err);
    return 0;
  }
};
