
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import StatsOverview from '@/components/dashboard/StatsOverview';
import ProgressCard from '@/components/dashboard/ProgressCard';
import { CourseType } from '@/components/courses/CourseCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CardContent, CardDescription, CardHeader, CardTitle, Card } from '@/components/ui/card';
import { BookOpen, CheckCircle2, Clock } from 'lucide-react';

// Mock data for in-progress courses
const inProgressCourses: (CourseType & { chaptersCompleted: number, totalChapters: number })[] = [
  {
    id: '1',
    title: 'Introduction to Web Development',
    instructor: 'Dr. Sarah Johnson',
    category: 'Development',
    thumbnailUrl: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613',
    rating: 4.8,
    duration: '6 hours',
    studentsCount: 12564,
    price: 49.99,
    progress: 65,
    enrolled: true,
    chaptersCompleted: 8,
    totalChapters: 12
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
  },
  {
    id: '3',
    title: 'UX Design Fundamentals',
    instructor: 'Emily Chen',
    category: 'Design',
    thumbnailUrl: 'https://images.unsplash.com/photo-1545235617-9465d2a55698',
    rating: 4.7,
    duration: '5 hours',
    studentsCount: 8453,
    price: 44.99,
    progress: 100,
    enrolled: true,
    chaptersCompleted: 8,
    totalChapters: 8
  }
];

// Mock data for completed courses
const completedCourses: (CourseType & { chaptersCompleted: number, totalChapters: number })[] = [
  {
    id: '4',
    title: 'HTML & CSS Basics',
    instructor: 'Dr. Sarah Johnson',
    category: 'Development',
    thumbnailUrl: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890',
    rating: 4.5,
    duration: '4 hours',
    studentsCount: 18925,
    price: 29.99,
    progress: 100,
    enrolled: true,
    chaptersCompleted: 6,
    totalChapters: 6
  },
  {
    id: '5',
    title: 'Git & GitHub for Beginners',
    instructor: 'Robert Chen',
    category: 'Development',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498',
    rating: 4.6,
    duration: '3 hours',
    studentsCount: 7632,
    price: 19.99,
    progress: 100,
    enrolled: true,
    chaptersCompleted: 5,
    totalChapters: 5
  }
];

// Stats data
const stats = {
  totalHours: 26,
  coursesCompleted: 2,
  coursesInProgress: 3,
  assignmentsCompleted: 15
};

// Upcoming deadlines
const upcomingDeadlines = [
  { 
    id: '1', 
    title: 'JavaScript Final Project', 
    course: 'Advanced JavaScript Concepts',
    dueDate: new Date(2025, 3, 20).toLocaleDateString() 
  },
  { 
    id: '2', 
    title: 'Responsive Design Quiz', 
    course: 'Introduction to Web Development',
    dueDate: new Date(2025, 3, 25).toLocaleDateString() 
  },
];

// Recent activities
const recentActivities = [
  { 
    id: '1', 
    activity: 'Completed Chapter: "DOM Manipulation"', 
    course: 'Advanced JavaScript Concepts', 
    timestamp: '2 hours ago' 
  },
  { 
    id: '2', 
    activity: 'Started Quiz: "CSS Layouts"', 
    course: 'Introduction to Web Development', 
    timestamp: 'Yesterday' 
  },
  { 
    id: '3', 
    activity: 'Submitted Assignment: "Wireframing Exercise"', 
    course: 'UX Design Fundamentals', 
    timestamp: '2 days ago' 
  },
];

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome message */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold">Welcome back, {user?.name}</h1>
                <p className="text-gray-600 mt-1">Here's an overview of your learning progress</p>
              </div>
            </div>
            
            {/* Stats cards */}
            <StatsOverview stats={stats} />
            
            {/* Course progress */}
            <div>
              <Tabs defaultValue="inprogress" className="w-full">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">My Courses</h2>
                  <TabsList>
                    <TabsTrigger value="inprogress" className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      In Progress
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="flex items-center">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Completed
                    </TabsTrigger>
                    <TabsTrigger value="all" className="flex items-center">
                      <BookOpen className="mr-2 h-4 w-4" />
                      All
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="inprogress" className="mt-2 space-y-6">
                  {inProgressCourses.map((course) => (
                    <ProgressCard 
                      key={course.id} 
                      course={course} 
                      chaptersCompleted={course.chaptersCompleted}
                      totalChapters={course.totalChapters}
                    />
                  ))}
                </TabsContent>
                
                <TabsContent value="completed" className="mt-2 space-y-6">
                  {completedCourses.map((course) => (
                    <ProgressCard 
                      key={course.id} 
                      course={course} 
                      chaptersCompleted={course.chaptersCompleted}
                      totalChapters={course.totalChapters}
                    />
                  ))}
                </TabsContent>
                
                <TabsContent value="all" className="mt-2 space-y-6">
                  {[...inProgressCourses, ...completedCourses].map((course) => (
                    <ProgressCard 
                      key={course.id} 
                      course={course} 
                      chaptersCompleted={course.chaptersCompleted}
                      totalChapters={course.totalChapters}
                    />
                  ))}
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Bottom cards grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming deadlines */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Upcoming Deadlines</CardTitle>
                  <CardDescription>Assignments and quizzes due soon</CardDescription>
                </CardHeader>
                <CardContent>
                  {upcomingDeadlines.length > 0 ? (
                    <ul className="space-y-4">
                      {upcomingDeadlines.map((item) => (
                        <li key={item.id} className="p-3 bg-purple-50 rounded-md">
                          <p className="font-medium">{item.title}</p>
                          <div className="flex justify-between items-center mt-1">
                            <p className="text-sm text-gray-600">{item.course}</p>
                            <p className="text-sm font-semibold text-purple-700">Due: {item.dueDate}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No upcoming deadlines</p>
                  )}
                </CardContent>
              </Card>
              
              {/* Recent activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
                  <CardDescription>Your learning activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {recentActivities.map((activity) => (
                      <li key={activity.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                        <p className="font-medium">{activity.activity}</p>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-sm text-gray-600">{activity.course}</p>
                          <p className="text-sm text-gray-500">{activity.timestamp}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
