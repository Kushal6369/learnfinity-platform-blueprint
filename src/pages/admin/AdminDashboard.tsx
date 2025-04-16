
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
import { Users, BookOpen, Award, TrendingUp, ArrowUpRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock data for enrollment chart
const enrollmentData = [
  { name: 'Jan', enrollments: 120 },
  { name: 'Feb', enrollments: 140 },
  { name: 'Mar', enrollments: 180 },
  { name: 'Apr', enrollments: 250 },
  { name: 'May', enrollments: 310 },
  { name: 'Jun', enrollments: 290 },
  { name: 'Jul', enrollments: 350 },
];

// Mock data for course completions
const completionData = [
  { name: 'Web Dev', completions: 86 },
  { name: 'JavaScript', completions: 65 },
  { name: 'UX Design', completions: 42 },
  { name: 'Data Science', completions: 53 },
  { name: 'Mobile Dev', completions: 30 },
];

// Mock data for revenue distribution
const revenueData = [
  { name: 'Web Development', value: 45 },
  { name: 'Data Science', value: 25 },
  { name: 'Design', value: 15 },
  { name: 'Business', value: 10 },
  { name: 'Other', value: 5 },
];

// Mock data for recent enrollments
const recentEnrollments = [
  { id: 1, user: 'John Smith', course: 'Introduction to Web Development', date: '2 hours ago' },
  { id: 2, user: 'Sara Johnson', course: 'Advanced JavaScript Concepts', date: '5 hours ago' },
  { id: 3, user: 'Michael Brown', course: 'UX Design Fundamentals', date: '6 hours ago' },
  { id: 4, user: 'Emily Davis', course: 'Data Science with Python', date: '1 day ago' },
  { id: 5, user: 'Robert Wilson', course: 'Mobile App Development', date: '1 day ago' },
];

const COLORS = ['#8b5cf6', '#60a5fa', '#4ade80', '#f97316', '#f43f5e'];

const AdminDashboard = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  // Redirect if not authenticated or not admin
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold">Admin Dashboard</h1>
                <p className="text-gray-600 mt-1">Overview of your platform's performance</p>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline">Export Report</Button>
                <Button className="bg-purple-600 hover:bg-purple-700">Add New Course</Button>
              </div>
            </div>
            
            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-blue-100">
                    <Users className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total Students</p>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-bold">45,624</h3>
                      <span className="text-green-600 text-sm flex items-center">
                        <ArrowUpRight className="h-4 w-4" />
                        12%
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">1,245 new this month</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-purple-100">
                    <BookOpen className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total Courses</p>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-bold">284</h3>
                      <span className="text-green-600 text-sm flex items-center">
                        <ArrowUpRight className="h-4 w-4" />
                        8%
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">12 added this month</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-green-100">
                    <Award className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Course Completions</p>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-bold">18,452</h3>
                      <span className="text-green-600 text-sm flex items-center">
                        <ArrowUpRight className="h-4 w-4" />
                        15%
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">642 this month</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-amber-100">
                    <TrendingUp className="h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-bold">$924,852</h3>
                      <span className="text-green-600 text-sm flex items-center">
                        <ArrowUpRight className="h-4 w-4" />
                        18%
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">$58,242 this month</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Enrollment trends */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg">Enrollment Trends</CardTitle>
                  <CardDescription>Monthly course enrollments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={enrollmentData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="enrollments" 
                          stroke="#8b5cf6" 
                          fill="#c4b5fd" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Course completions */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg">Course Completions</CardTitle>
                  <CardDescription>Top courses by completion rate</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={completionData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="completions" fill="#60a5fa" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Revenue and Recent Enrollments */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Revenue distribution */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg">Revenue Distribution</CardTitle>
                  <CardDescription>By course category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={revenueData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {revenueData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 mt-4">
                    {revenueData.map((entry, index) => (
                      <div key={`legend-${index}`} className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-1" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                        />
                        <span className="text-sm text-gray-600">{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Recent enrollments */}
              <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Recent Enrollments</CardTitle>
                  <CardDescription>New students enrolled in courses</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {recentEnrollments.map((enrollment) => (
                      <li 
                        key={enrollment.id}
                        className="border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                      >
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">{enrollment.user}</p>
                            <p className="text-sm text-gray-600">{enrollment.course}</p>
                          </div>
                          <div className="text-sm text-gray-500">
                            {enrollment.date}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full text-purple-600" asChild>
                    <a href="/admin/users" className="flex items-center justify-center">
                      View All Enrollments
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
