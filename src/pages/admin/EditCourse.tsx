
import React, { useState, useEffect } from 'react';
import { Navigate, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { LoaderCircle } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  level: string;
  duration: string;
  thumbnail_url?: string;
  published: boolean;
  enrollments_count?: number;
}

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollmentsCount, setEnrollmentsCount] = useState(0);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // Fetch course details
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('*')
          .eq('id', id)
          .single();

        if (courseError) throw courseError;

        // Fetch enrollments count
        const { count, error: countError } = await supabase
          .from('enrollments')
          .select('*', { count: 'exact' })
          .eq('course_id', id);

        if (countError) throw countError;

        setCourse(courseData);
        setEnrollmentsCount(count || 0);
      } catch (error) {
        console.error('Error fetching course:', error);
        toast.error('Failed to load course details');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchCourse();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('courses')
        .update({
          title: course.title,
          description: course.description,
          category: course.category,
          price: course.price,
          level: course.level,
          duration: course.duration,
          thumbnail_url: course.thumbnail_url,
          published: course.published,
          updated_at: new Date().toISOString()
        })
        .eq('id', course.id);

      if (error) throw error;
      
      toast.success('Course updated successfully');
      navigate('/admin/course-management');
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Failed to update course');
    } finally {
      setIsSaving(false);
    }
  };

  // Redirect if not authenticated or not admin
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-[calc(100vh-100px)]">
              <LoaderCircle className="h-8 w-8 animate-spin" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Course not found</h2>
              <Button 
                onClick={() => navigate('/admin/course-management')}
                className="mt-4"
              >
                Back to Course Management
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-semibold">Edit Course</h1>
                <p className="text-muted-foreground">Update course details and manage settings</p>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate('/admin/course-management')}
              >
                Back to Course Management
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Course Statistics</CardTitle>
                <CardDescription>Overview of course performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-secondary/10 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground">Total Enrollments</p>
                    <p className="text-2xl font-bold">{enrollmentsCount}</p>
                  </div>
                  <div className="p-4 bg-secondary/10 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <p className="text-2xl font-bold">{course.published ? 'Published' : 'Draft'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Course Details</CardTitle>
                  <CardDescription>Edit the basic information about your course</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Course Title</Label>
                    <Input
                      id="title"
                      value={course.title}
                      onChange={(e) => setCourse({ ...course, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={course.description}
                      onChange={(e) => setCourse({ ...course, description: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={course.category}
                        onValueChange={(value) => setCourse({ ...course, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Development">Development</SelectItem>
                          <SelectItem value="Business">Business</SelectItem>
                          <SelectItem value="Design">Design</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="level">Level</Label>
                      <Select
                        value={course.level}
                        onValueChange={(value) => setCourse({ ...course, level: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        value={course.duration}
                        onChange={(e) => setCourse({ ...course, duration: e.target.value })}
                        placeholder="e.g., 2 hours"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Price ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={course.price}
                        onChange={(e) => setCourse({ ...course, price: parseFloat(e.target.value) })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="thumbnail">Thumbnail URL</Label>
                    <Input
                      id="thumbnail"
                      value={course.thumbnail_url || ''}
                      onChange={(e) => setCourse({ ...course, thumbnail_url: e.target.value })}
                      placeholder="Enter image URL"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant={course.published ? "default" : "secondary"}
                      onClick={() => setCourse({ ...course, published: !course.published })}
                    >
                      {course.published ? 'Published' : 'Draft'}
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {course.published ? 'Course is visible to students' : 'Course is hidden from students'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/course-management')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditCourse;
