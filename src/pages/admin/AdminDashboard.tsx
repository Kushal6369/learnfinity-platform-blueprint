
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, Award, TrendingUp, ArrowUpRight, ArrowRight, PlusCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Mock data for enrollment chart (would be replaced with real data)
const enrollmentData = [
  { name: 'Jan', enrollments: 120 },
  { name: 'Feb', enrollments: 140 },
  { name: 'Mar', enrollments: 180 },
  { name: 'Apr', enrollments: 250 },
  { name: 'May', enrollments: 310 },
  { name: 'Jun', enrollments: 290 },
  { name: 'Jul', enrollments: 350 },
];

// Mock data for student progress (would be replaced with real data)
const studentProgressData = [
  { id: 1, name: 'John Smith', email: 'john@example.com', coursesEnrolled: 3, completionRate: 85 },
  { id: 2, name: 'Sara Johnson', email: 'sara@example.com', coursesEnrolled: 5, completionRate: 92 },
  { id: 3, name: 'Michael Brown', email: 'michael@example.com', coursesEnrolled: 2, completionRate: 45 },
  { id: 4, name: 'Emily Davis', email: 'emily@example.com', coursesEnrolled: 4, completionRate: 78 },
  { id: 5, name: 'Robert Wilson', email: 'robert@example.com', coursesEnrolled: 1, completionRate: 30 },
];

// Top courses data (would be replaced with real data)
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
                <p className="text-gray-600 mt-1">Manage enrollments, students, and courses</p>
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
              <Card>
                <CardHeader>
                  <CardTitle>Enrollment Trends</CardTitle>
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
              
              {/* Top courses */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Courses</CardTitle>
                  <CardDescription>By number of enrolled students</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={topCoursesData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="students" fill="#60a5fa" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Student Progress Table */}
            <Card>
              <CardHeader>
                <CardTitle>Student Progress</CardTitle>
                <CardDescription>Overview of student enrollment and course completion</CardDescription>
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
                            <div className="w-full h-2 bg-gray-200 rounded-full">
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
                    className="text-purple-600"
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
