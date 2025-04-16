
import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Users, Activity, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import CourseGrid from '@/components/courses/CourseGrid';
import { CourseType } from '@/components/courses/CourseCard';

// Mock data for featured courses
const featuredCourses: CourseType[] = [
  {
    id: '1',
    title: 'Introduction to Web Development',
    instructor: 'Dr. Sarah Johnson',
    category: 'Development',
    thumbnailUrl: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613',
    rating: 4.8,
    duration: '6 hours',
    studentsCount: 12564,
    price: 49.99
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
    price: 59.99
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
    price: 44.99
  },
  {
    id: '4',
    title: 'Data Science with Python',
    instructor: 'Prof. Alex Morgan',
    category: 'Data Science',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
    rating: 4.6,
    duration: '10 hours',
    studentsCount: 15236,
    price: 69.99
  }
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight animate-fade-in">
                Unlock Your Potential Through Quality Learning
              </h1>
              <p className="text-lg md:text-xl mb-8 text-purple-100 max-w-lg animate-fade-in" style={{ animationDelay: '100ms' }}>
                Discover thousands of courses taught by expert instructors and transform your skills with hands-on projects.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
                <Button size="lg" asChild>
                  <Link to="/courses" className="flex items-center">
                    Explore Courses
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="bg-transparent text-white border-white hover:bg-white hover:text-purple-900">
                  <Link to="/signup">Sign Up for Free</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center md:justify-end animate-fade-in" style={{ animationDelay: '300ms' }}>
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f" 
                alt="Students learning" 
                className="rounded-lg shadow-lg w-full max-w-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose LearnFinity</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Our platform offers everything you need to enhance your skills and advance your career</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 border border-gray-100 rounded-lg shadow-sm flex flex-col items-center text-center animate-scale-in">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <GraduationCap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Expert Instruction</h3>
              <p className="text-gray-600">Learn from industry professionals and experienced educators</p>
            </div>
            
            <div className="p-6 border border-gray-100 rounded-lg shadow-sm flex flex-col items-center text-center animate-scale-in" style={{ animationDelay: '100ms' }}>
              <div className="bg-purple-100 p-3 rounded-full mb-4">
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Diverse Courses</h3>
              <p className="text-gray-600">Thousands of courses across various disciplines and topics</p>
            </div>
            
            <div className="p-6 border border-gray-100 rounded-lg shadow-sm flex flex-col items-center text-center animate-scale-in" style={{ animationDelay: '200ms' }}>
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <Activity className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Track Progress</h3>
              <p className="text-gray-600">Monitor your learning with detailed progress tracking</p>
            </div>
            
            <div className="p-6 border border-gray-100 rounded-lg shadow-sm flex flex-col items-center text-center animate-scale-in" style={{ animationDelay: '300ms' }}>
              <div className="bg-amber-100 p-3 rounded-full mb-4">
                <Users className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Community</h3>
              <p className="text-gray-600">Connect with fellow learners and instructors</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Courses Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Courses</h2>
            <Button variant="ghost" asChild>
              <Link to="/courses" className="flex items-center text-purple-600">
                View All Courses
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <CourseGrid courses={featuredCourses} />
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-purple-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-white p-8 rounded-xl shadow-sm border border-purple-100">
            <div>
              <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
              <p className="text-gray-600 max-w-xl">
                Join thousands of students already learning on LearnFinity. Start your journey today!
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700" asChild>
                <Link to="/signup">Create Free Account</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/courses">Browse Courses</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <GraduationCap className="mr-2 h-5 w-5" />
                LearnFinity
              </h3>
              <p className="text-gray-400">
                Empowering learners worldwide with quality education and practical skills.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/courses" className="text-gray-400 hover:text-white">All Courses</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-4">Categories</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Development</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Business</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Design</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Data Science</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-4">Subscribe</h4>
              <p className="text-gray-400 mb-2">Get the latest updates and offers</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="px-3 py-2 bg-gray-800 text-white rounded-l-md focus:outline-none"
                />
                <Button className="rounded-l-none bg-purple-600 hover:bg-purple-700">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-6 mt-6 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} LearnFinity. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
