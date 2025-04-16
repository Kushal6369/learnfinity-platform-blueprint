
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Search, Plus, Filter, MoreVertical, Edit, Trash, Eye, FileUp, Upload 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Mock courses data
const mockCourses = [
  {
    id: '1',
    title: 'Introduction to Web Development',
    instructor: 'Dr. Sarah Johnson',
    category: 'Development',
    price: 49.99,
    published: true,
    enrollments: 12564,
    rating: 4.8,
    lastUpdated: 'March 15, 2025',
  },
  {
    id: '2',
    title: 'Advanced JavaScript Concepts',
    instructor: 'Michael Thompson',
    category: 'Programming',
    price: 59.99,
    published: true,
    enrollments: 9872,
    rating: 4.9,
    lastUpdated: 'February 22, 2025',
  },
  {
    id: '3',
    title: 'UX Design Fundamentals',
    instructor: 'Emily Chen',
    category: 'Design',
    price: 44.99,
    published: true,
    enrollments: 8453,
    rating: 4.7,
    lastUpdated: 'March 1, 2025',
  },
  {
    id: '4',
    title: 'Data Science with Python',
    instructor: 'Prof. Alex Morgan',
    category: 'Data Science',
    price: 69.99,
    published: true,
    enrollments: 15236,
    rating: 4.6,
    lastUpdated: 'March 10, 2025',
  },
  {
    id: '5',
    title: 'Mobile App Development with React Native',
    instructor: 'Jennifer Lee',
    category: 'Development',
    price: 54.99,
    published: true,
    enrollments: 6438,
    rating: 4.5,
    lastUpdated: 'January 15, 2025',
  },
  {
    id: '6',
    title: 'Machine Learning Fundamentals',
    instructor: 'Dr. Robert Smith',
    category: 'Data Science',
    price: 79.99,
    published: false,
    enrollments: 0,
    rating: 0,
    lastUpdated: 'March 18, 2025',
  },
];

type CourseFormProps = {
  onClose: () => void;
};

const CourseForm = ({ onClose }: CourseFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
      toast.success('Course created successfully');
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Course Title</Label>
          <Input id="title" placeholder="e.g. Introduction to Web Development" required />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="development">Development</SelectItem>
              <SelectItem value="programming">Programming</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="data-science">Data Science</SelectItem>
              <SelectItem value="business">Business</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Course Description</Label>
        <Textarea 
          id="description" 
          placeholder="Describe your course content and learning objectives..." 
          rows={4}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input id="price" type="number" min="0" step="0.01" placeholder="49.99" required />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (hours)</Label>
          <Input id="duration" type="number" min="0" step="0.5" placeholder="6.5" required />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="instructor">Instructor</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select instructor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dr-sarah-johnson">Dr. Sarah Johnson</SelectItem>
              <SelectItem value="michael-thompson">Michael Thompson</SelectItem>
              <SelectItem value="emily-chen">Emily Chen</SelectItem>
              <SelectItem value="prof-alex-morgan">Prof. Alex Morgan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="thumbnail">Course Thumbnail</Label>
        <div className="flex items-center gap-2">
          <Button variant="outline" type="button" className="w-full">
            <Upload className="mr-2 h-4 w-4" />
            Upload Image
          </Button>
        </div>
        <p className="text-xs text-gray-500">
          Recommended size: 1280x720 pixels (16:9 ratio). Max size: 3MB.
        </p>
      </div>
      
      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Course'}
        </Button>
      </DialogFooter>
    </form>
  );
};

const CourseManagement = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Redirect if not authenticated or not admin
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }
  
  // Filter courses based on search query and filters
  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || course.category.toLowerCase() === categoryFilter;
    
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'published' && course.published) ||
                          (statusFilter === 'draft' && !course.published);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
  
  const handleDeleteCourse = (id: string) => {
    toast.success(`Course deleted: ${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold">Course Management</h1>
                <p className="text-gray-600 mt-1">Create, edit, and manage your courses</p>
              </div>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Course
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[700px]">
                  <DialogHeader>
                    <DialogTitle>Create New Course</DialogTitle>
                    <DialogDescription>
                      Fill in the details for your new course. Click save when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <CourseForm onClose={() => setIsDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
            
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search courses or instructors..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="programming">Programming</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="data science">Data Science</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button variant="outline" onClick={() => {
                      setSearchQuery('');
                      setCategoryFilter('all');
                      setStatusFilter('all');
                    }}>
                      <Filter className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Courses table */}
            <Card>
              <CardHeader className="pb-0">
                <CardTitle>Courses</CardTitle>
                <CardDescription>
                  Showing {filteredCourses.length} out of {mockCourses.length} courses
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Instructor</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Enrollments</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCourses.length > 0 ? (
                        filteredCourses.map((course) => (
                          <TableRow key={course.id}>
                            <TableCell className="font-medium">{course.title}</TableCell>
                            <TableCell>{course.instructor}</TableCell>
                            <TableCell>{course.category}</TableCell>
                            <TableCell>${course.price.toFixed(2)}</TableCell>
                            <TableCell>
                              {course.published ? (
                                <Badge variant="success" className="bg-green-100 text-green-800">Published</Badge>
                              ) : (
                                <Badge variant="outline" className="bg-gray-100 text-gray-800">Draft</Badge>
                              )}
                            </TableCell>
                            <TableCell>{course.enrollments.toLocaleString()}</TableCell>
                            <TableCell>{course.rating > 0 ? course.rating.toFixed(1) : 'N/A'}</TableCell>
                            <TableCell>{course.lastUpdated}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem className="flex items-center">
                                    <Edit className="mr-2 h-4 w-4" />
                                    <span>Edit</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="flex items-center">
                                    <Eye className="mr-2 h-4 w-4" />
                                    <span>Preview</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="flex items-center">
                                    <FileUp className="mr-2 h-4 w-4" />
                                    <span>{course.published ? 'Unpublish' : 'Publish'}</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="flex items-center text-red-600"
                                    onClick={() => handleDeleteCourse(course.id)}
                                  >
                                    <Trash className="mr-2 h-4 w-4" />
                                    <span>Delete</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8">
                            <div className="flex flex-col items-center">
                              <p className="text-gray-500 mb-2">No courses found</p>
                              <Button 
                                variant="outline" 
                                onClick={() => {
                                  setSearchQuery('');
                                  setCategoryFilter('all');
                                  setStatusFilter('all');
                                }}
                              >
                                Reset Filters
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CourseManagement;
