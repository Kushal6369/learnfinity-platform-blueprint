
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import CourseDetailHeader from '@/components/courses/CourseDetailHeader';
import ModuleProgress from '@/components/courses/ModuleProgress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import ProgressCard from '@/components/dashboard/ProgressCard';

const MyCourses = () => {
  const { isAuthenticated, user } = useAuth();
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Mock enrolled courses data - in a real app this would come from the database
  const enrolledCourses = [
    {
      id: '1',
      title: 'Introduction to Web Development',
      instructor: 'Dr. Sarah Johnson',
      category: 'Development',
      thumbnailUrl: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613',
      rating: 4.8,
      duration: '120 hours',
      studentsCount: 12564,
      price: 0,
      progress: 20,
      enrolled: true,
      chaptersCompleted: 2,
      totalChapters: 10,
      description: 'Learn the basics of HTML, CSS, and JavaScript to build responsive websites from scratch.',
      modules: [
        { 
          id: '1-1', 
          title: 'Introduction to HTML', 
          duration: '2 hours', 
          completed: true 
        },
        { 
          id: '1-2', 
          title: 'CSS Fundamentals', 
          duration: '3 hours', 
          completed: true 
        },
        { 
          id: '1-3', 
          title: 'JavaScript Basics', 
          duration: '4 hours', 
          completed: false 
        },
        { 
          id: '1-4', 
          title: 'Responsive Design', 
          duration: '3 hours', 
          completed: false 
        },
        { 
          id: '1-5', 
          title: 'Building a Project', 
          duration: '6 hours', 
          completed: false 
        }
      ],
      tags: ['web-dev', 'beginner'],
      lessons: 10,
      certificate: true
    },
    {
      id: '2',
      title: 'Advanced JavaScript Concepts',
      instructor: 'Michael Thompson',
      category: 'Programming',
      thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
      rating: 4.9,
      duration: '8.5 hours',
      studentsCount: 9872,
      price: 59.99,
      progress: 30,
      enrolled: true,
      chaptersCompleted: 3,
      totalChapters: 10
    }
  ];
  
  // If a specific course is selected, show its details
  const [selectedCourse, setSelectedCourse] = React.useState(null);
  
  if (selectedCourse) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        
        <div className="flex">
          <Sidebar />
          
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              <button 
                onClick={() => setSelectedCourse(null)}
                className="mb-4 flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                ← Back to My Courses
              </button>
              
              <CourseDetailHeader course={selectedCourse} />
              
              <div className="mt-8">
                <Tabs defaultValue="content">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="content">Course Content</TabsTrigger>
                    <TabsTrigger value="instructor">Instructor</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  </TabsList>
                  <TabsContent value="content" className="mt-4">
                    <Card className="p-6">
                      <h3 className="text-xl font-semibold mb-4">Course Modules</h3>
                      <div className="space-y-4">
                        {selectedCourse.modules?.map((module) => (
                          <ModuleProgress 
                            key={module.id}
                            module={module}
                          />
                        ))}
                      </div>
                    </Card>
                  </TabsContent>
                  <TabsContent value="instructor">
                    <Card className="p-6">
                      <h3 className="text-xl font-semibold">About the Instructor</h3>
                      <div className="mt-4 flex items-start">
                        <div className="w-20 h-20 rounded-full overflow-hidden mr-4">
                          <img
                            src="https://i.pravatar.cc/150?img=32"
                            alt={selectedCourse.instructor}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-lg">{selectedCourse.instructor}</h4>
                          <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Experienced web developer and educator with over 10 years of industry experience.
                            Specializes in frontend technologies and responsive design principles.
                          </p>
                        </div>
                      </div>
                    </Card>
                  </TabsContent>
                  <TabsContent value="reviews">
                    <Card className="p-6">
                      <h3 className="text-xl font-semibold">Student Reviews</h3>
                      <div className="mt-4">
                        <div className="flex items-center mb-4">
                          <span className="text-3xl font-bold mr-2">{selectedCourse.rating}</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-5 w-5 ${i < Math.floor(selectedCourse.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="ml-2 text-gray-600 dark:text-gray-400">({selectedCourse.studentsCount} reviews)</span>
                          </div>
                        </div>
                        
                        {/* Mock reviews */}
                        <div className="space-y-4">
                          {[
                            { name: "Alex D.", rating: 5, comment: "Great course! Very comprehensive and well-explained." },
                            { name: "Sarah M.", rating: 4, comment: "Clear explanations and useful examples. Would recommend." }
                          ].map((review, index) => (
                            <div key={index} className="border-b pb-4 last:border-0">
                              <div className="flex items-center mb-1">
                                <span className="font-medium mr-2">{review.name}</span>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <svg
                                      key={i}
                                      xmlns="http://www.w3.org/2000/svg"
                                      className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                              </div>
                              <p className="text-gray-600 dark:text-gray-400">{review.comment}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  // Show list of enrolled courses
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-semibold mb-6">My Courses</h1>
            
            {enrolledCourses.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {enrolledCourses.map((course) => (
                  <ProgressCard 
                    key={course.id} 
                    course={course} 
                    chaptersCompleted={course.chaptersCompleted}
                    totalChapters={course.totalChapters}
                    onClick={() => setSelectedCourse(course)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">You haven't enrolled in any courses yet</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">Browse our course catalog to find something you're interested in.</p>
                <button
                  className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  onClick={() => window.location.href = '/courses'}
                >
                  Browse Courses
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyCourses;
