import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import AdminNotices from '@/components/admin/AdminNotices';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, Award, TrendingUp, ArrowUpRight, ArrowRight, PlusCircle, Filter } from 'lucide-react';

const enrollmentData = [
  { name: 'Jan', enrollments: 120 },
  { name: 'Feb', enrollments: 140 },
  { name: 'Mar', enrollments: 180 },
  { name: 'Apr', enrollments: 250 },
  { name: 'May', enrollments: 310 },
  { name: 'Jun', enrollments: 290 },
  { name: 'Jul', enrollments: 350 },
];

const studentProgressData = [
  { id: 1, name: 'John Smith', email: 'john@example.com', coursesEnrolled: 3, completionRate: 85 },
  { id: 2, name: 'Sara Johnson', email: 'sara@example.com', coursesEnrolled: 5, completionRate: 92 },
  { id: 3, name: 'Michael Brown', email: 'michael@example.com', coursesEnrolled: 2, completionRate: 45 },
  { id: 4, name: 'Emily Davis', email: 'emily@example.com', coursesEnrolled: 4, completionRate: 78 },
  { id: 5, name: 'Robert Wilson', email: 'robert@example.com', coursesEnrolled: 1, completionRate: 30 },
];

const topCoursesData = [
  { name: 'Web Development', students: 450 },
  { name: 'Data Science', students: 350 },
  { name: 'UX Design', students: 280 },
  { name: 'JavaScript', students: 220 },
  { name: 'Mobile App Dev', students: 190 },
];

const AdminDashboard = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('week');

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold">Admin Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Manage enrollments, students, and courses</p>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate('/admin/reports')}>View Reports</Button>
                <Button 
                  className="bg-purple-600 hover:bg-purple-700" 
                  onClick={() => navigate('/admin/add-course')}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Course
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Users className="h-6 w-6 text-blue-500 dark:text-blue-300" />
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Students</p>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-bold">45,624</h3>
                      <span className="text-green-600 dark:text-green-400 text-sm flex items-center">
                        <ArrowUpRight className="h-4 w-4" />
                        12%
                      </span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">1,245 new this month</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <BookOpen className="h-6 w-6 text-purple-500 dark:text-purple-300" />
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Courses</p>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-bold">284</h3>
                      <span className="text-green-600 dark:text-green-400 text-sm flex items-center">
                        <ArrowUpRight className="h-4 w-4" />
                        8%
                      </span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">12 added this month</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <Award className="h-6 w-6 text-green-500 dark:text-green-300" />
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Course Completions</p>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-bold">18,452</h3>
                      <span className="text-green-600 dark:text-green-400 text-sm flex items-center">
                        <ArrowUpRight className="h-4 w-4" />
                        15%
                      </span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">642 this month</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                    <TrendingUp className="h-6 w-6 text-amber-500 dark:text-amber-300" />
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Revenue</p>
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-bold">$924,852</h3>
                      <span className="text-green-600 dark:text-green-400 text-sm flex items-center">
                        <ArrowUpRight className="h-4 w-4" />
                        18%
                      </span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">$58,242 this month</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <AdminNotices />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle>Enrollment Trends</CardTitle>
                    <CardDescription>Monthly course enrollments</CardDescription>
                  </div>
                  <div className="flex space-x-1 rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
                    <Button 
                      variant={dateRange === 'week' ? 'secondary' : 'ghost'} 
                      onClick={() => handleDateRangeChange('week')}
                      size="sm"
                      className="text-xs px-3 h-7"
                    >
                      Week
                    </Button>
                    <Button 
                      variant={dateRange === 'month' ? 'secondary' : 'ghost'}
                      onClick={() => handleDateRangeChange('month')}
                      size="sm"
                      className="text-xs px-3 h-7"
                    >
                      Month
                    </Button>
                    <Button 
                      variant={dateRange === 'year' ? 'secondary' : 'ghost'}
                      onClick={() => handleDateRangeChange('year')}
                      size="sm"
                      className="text-xs px-3 h-7"
                    >
                      Year
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={enrollmentData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                        <XAxis dataKey="name" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1f2937', 
                            borderColor: '#374151',
                            color: '#f9fafb' 
                          }} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="enrollments" 
                          stroke="#8b5cf6" 
                          fill="#c4b5fd" 
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle>Top Courses</CardTitle>
                    <CardDescription>By number of enrolled students</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center gap-1 h-8">
                    <Filter className="h-3.5 w-3.5" />
                    Filter
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={topCoursesData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} horizontal={false} />
                        <XAxis type="number" stroke="#9ca3af" />
                        <YAxis dataKey="name" type="category" width={100} stroke="#9ca3af" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1f2937', 
                            borderColor: '#374151',
                            color: '#f9fafb' 
                          }} 
                        />
                        <Bar dataKey="students" fill="#60a5fa" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Student Progress</CardTitle>
                  <CardDescription>Overview of student enrollment and course completion</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Filter className="h-3.5 w-3.5" />
                  Filter Results
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Courses Enrolled</TableHead>
                      <TableHead>Completion Rate</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentProgressData.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.coursesEnrolled}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                              <div 
                                className={`h-full rounded-full ${
                                  student.completionRate >= 80 ? 'bg-green-500' : 
                                  student.completionRate >= 50 ? 'bg-amber-500' : 'bg-red-500'
                                }`} 
                                style={{ width: `${student.completionRate}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{student.completionRate}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => navigate(`/admin/student/${student.id}`)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 flex justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/admin/students')} 
                    className="text-purple-600 dark:text-purple-400"
                  >
                    View All Students
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
