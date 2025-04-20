
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AddCourse = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    instructor: '',
    category: 'development',
    thumbnailUrl: '',
    price: '',
    duration: '',
    level: 'beginner'
  });

  // Categories
  const categories = [
    { value: 'development', label: 'Development' },
    { value: 'design', label: 'Design' },
    { value: 'business', label: 'Business' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'photography', label: 'Photography' },
    { value: 'music', label: 'Music' }
  ];

  // Course levels
  const levels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  // Redirect if not authenticated or not admin
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourseData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setCourseData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // This would be replaced with actual API call to create course
      // For now, just showing a success message
      toast.success('Course created successfully!');
      navigate('/admin/course-management');
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error('Failed to create course. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold">Add New Course</h1>
                <p className="text-gray-600">Create a new course for your students</p>
              </div>
              <Button variant="outline" onClick={() => navigate('/admin/course-management')}>
                Back to Courses
              </Button>
            </div>
            
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Course Details</CardTitle>
                  <CardDescription>Fill in the information about the new course.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Course Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Course Title <span className="text-red-500">*</span></Label>
                    <Input 
                      id="title"
                      name="title"
                      value={courseData.title}
                      onChange={handleChange}
                      placeholder="e.g. Complete Web Development Bootcamp"
                      required
                    />
                  </div>
                  
                  {/* Course Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                    <Textarea 
                      id="description"
                      name="description"
                      value={courseData.description}
                      onChange={handleChange}
                      placeholder="Provide a detailed description of your course"
                      rows={5}
                      required
                    />
                  </div>
                  
                  {/* Course Instructor */}
                  <div className="space-y-2">
                    <Label htmlFor="instructor">Instructor Name <span className="text-red-500">*</span></Label>
                    <Input 
                      id="instructor"
                      name="instructor"
                      value={courseData.instructor}
                      onChange={handleChange}
                      placeholder="e.g. John Smith"
                      required
                    />
                  </div>
                  
                  {/* Two column layout for category and level */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                      <Select 
                        value={courseData.category} 
                        onValueChange={(value) => handleSelectChange('category', value)}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="level">Level <span className="text-red-500">*</span></Label>
                      <Select 
                        value={courseData.level} 
                        onValueChange={(value) => handleSelectChange('level', value)}
                      >
                        <SelectTrigger id="level">
                          <SelectValue placeholder="Select a level" />
                        </SelectTrigger>
                        <SelectContent>
                          {levels.map(level => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {/* Two column layout for price and duration */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price ($) <span className="text-red-500">*</span></Label>
                      <Input 
                        id="price"
                        name="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={courseData.price}
                        onChange={handleChange}
                        placeholder="e.g. 49.99"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (hours) <span className="text-red-500">*</span></Label>
                      <Input 
                        id="duration"
                        name="duration"
                        value={courseData.duration}
                        onChange={handleChange}
                        placeholder="e.g. 10.5"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Thumbnail URL */}
                  <div className="space-y-2">
                    <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
                    <Input 
                      id="thumbnailUrl"
                      name="thumbnailUrl"
                      value={courseData.thumbnailUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/course-thumbnail.jpg"
                    />
                    <p className="text-sm text-gray-500">Provide a URL for the course thumbnail image</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate('/admin/course-management')}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-purple-600 hover:bg-purple-700" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Course'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddCourse;
