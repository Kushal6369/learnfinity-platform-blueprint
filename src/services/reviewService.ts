
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types
export interface Review {
  id: string;
  user_id: string;
  course_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
  user_name?: string;
  user_avatar?: string;
}

// Get all reviews for a course
export const getCourseReviews = async (courseId: string): Promise<Review[]> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles:user_id (
          name,
          avatar_url
        )
      `)
      .eq('course_id', courseId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching course reviews:', error);
      toast.error('Failed to load reviews');
      return [];
    }
    
    // Transform the response to match the Review interface
    return (data || []).map(review => ({
      ...review,
      user_name: review.profiles?.name || 'Anonymous',
      user_avatar: review.profiles?.avatar_url || null
    }));
  } catch (err) {
    console.error('Error in getCourseReviews:', err);
    toast.error('An unexpected error occurred');
    return [];
  }
};

// Get a user's review for a specific course
export const getUserCourseReview = async (userId: string, courseId: string): Promise<Review | null> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error fetching user review:', error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('Error in getUserCourseReview:', err);
    return null;
  }
};

// Add or update a review
export const saveReview = async (
  userId: string, 
  courseId: string, 
  rating: number, 
  comment?: string
): Promise<Review | null> => {
  try {
    // Check if review already exists
    const existingReview = await getUserCourseReview(userId, courseId);
    
    if (existingReview) {
      // Update existing review
      const { data, error } = await supabase
        .from('reviews')
        .update({
          rating,
          comment: comment || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingReview.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating review:', error);
        toast.error('Failed to update review');
        return null;
      }
      
      toast.success('Review updated successfully');
      return data;
    } else {
      // Create new review
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          user_id: userId,
          course_id: courseId,
          rating,
          comment: comment || null
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating review:', error);
        toast.error('Failed to create review');
        return null;
      }
      
      toast.success('Review submitted successfully');
      return data;
    }
  } catch (err) {
    console.error('Error in saveReview:', err);
    toast.error('An unexpected error occurred');
    return null;
  }
};

// Delete a review
export const deleteReview = async (reviewId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);
    
    if (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
      return false;
    }
    
    toast.success('Review deleted successfully');
    return true;
  } catch (err) {
    console.error('Error in deleteReview:', err);
    toast.error('An unexpected error occurred');
    return false;
  }
};

// Get average rating for a course
export const getCourseAverageRating = async (courseId: string): Promise<number> => {
  try {
    // Get the average directly from reviews table
    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('course_id', courseId);
    
    if (error) {
      console.error('Error fetching course ratings:', error);
      return 0;
    }
    
    if (!data || data.length === 0) return 0;
    
    // Calculate average rating manually
    const sum = data.reduce((total, review) => total + review.rating, 0);
    return Number((sum / data.length).toFixed(1));
  } catch (err) {
    console.error('Error in getCourseAverageRating:', err);
    return 0;
  }
};
