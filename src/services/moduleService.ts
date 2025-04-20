
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types
export interface Module {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface ModuleCreateInput {
  course_id: string;
  title: string;
  description?: string;
  position: number;
}

export interface ModuleUpdateInput {
  title?: string;
  description?: string;
  position?: number;
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  content: string | null;
  video_url: string | null;
  duration: number;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface LessonCreateInput {
  module_id: string;
  title: string;
  content?: string;
  video_url?: string;
  duration: number;
  position: number;
}

export interface LessonUpdateInput {
  title?: string;
  content?: string;
  video_url?: string;
  duration?: number;
  position?: number;
}

// Get all modules for a course
export const getCourseModules = async (courseId: string): Promise<Module[]> => {
  try {
    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .eq('course_id', courseId)
      .order('position', { ascending: true });
    
    if (error) {
      console.error('Error fetching course modules:', error);
      toast.error('Failed to load course modules');
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Error in getCourseModules:', err);
    toast.error('An unexpected error occurred');
    return [];
  }
};

// Create a new module
export const createModule = async (module: ModuleCreateInput): Promise<Module | null> => {
  try {
    const { data, error } = await supabase
      .from('modules')
      .insert(module)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating module:', error);
      toast.error('Failed to create module');
      return null;
    }
    
    toast.success('Module created successfully');
    return data;
  } catch (err) {
    console.error('Error in createModule:', err);
    toast.error('An unexpected error occurred');
    return null;
  }
};

// Update a module
export const updateModule = async (moduleId: string, updates: ModuleUpdateInput): Promise<Module | null> => {
  try {
    const { data, error } = await supabase
      .from('modules')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', moduleId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating module:', error);
      toast.error('Failed to update module');
      return null;
    }
    
    toast.success('Module updated successfully');
    return data;
  } catch (err) {
    console.error('Error in updateModule:', err);
    toast.error('An unexpected error occurred');
    return null;
  }
};

// Delete a module
export const deleteModule = async (moduleId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('modules')
      .delete()
      .eq('id', moduleId);
    
    if (error) {
      console.error('Error deleting module:', error);
      toast.error('Failed to delete module');
      return false;
    }
    
    toast.success('Module deleted successfully');
    return true;
  } catch (err) {
    console.error('Error in deleteModule:', err);
    toast.error('An unexpected error occurred');
    return false;
  }
};

// Get all lessons for a module
export const getModuleLessons = async (moduleId: string): Promise<Lesson[]> => {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('module_id', moduleId)
      .order('position', { ascending: true });
    
    if (error) {
      console.error('Error fetching module lessons:', error);
      toast.error('Failed to load module lessons');
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Error in getModuleLessons:', err);
    toast.error('An unexpected error occurred');
    return [];
  }
};

// Create a new lesson
export const createLesson = async (lesson: LessonCreateInput): Promise<Lesson | null> => {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .insert(lesson)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating lesson:', error);
      toast.error('Failed to create lesson');
      return null;
    }
    
    toast.success('Lesson created successfully');
    return data;
  } catch (err) {
    console.error('Error in createLesson:', err);
    toast.error('An unexpected error occurred');
    return null;
  }
};

// Update a lesson
export const updateLesson = async (lessonId: string, updates: LessonUpdateInput): Promise<Lesson | null> => {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', lessonId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating lesson:', error);
      toast.error('Failed to update lesson');
      return null;
    }
    
    toast.success('Lesson updated successfully');
    return data;
  } catch (err) {
    console.error('Error in updateLesson:', err);
    toast.error('An unexpected error occurred');
    return null;
  }
};

// Delete a lesson
export const deleteLesson = async (lessonId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', lessonId);
    
    if (error) {
      console.error('Error deleting lesson:', error);
      toast.error('Failed to delete lesson');
      return false;
    }
    
    toast.success('Lesson deleted successfully');
    return true;
  } catch (err) {
    console.error('Error in deleteLesson:', err);
    toast.error('An unexpected error occurred');
    return false;
  }
};
