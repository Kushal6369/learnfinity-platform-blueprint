import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Users, Activity, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import CourseGrid from '@/components/courses/CourseGrid';
import { CourseType } from '@/components/courses/CourseCard';
import SlidingMenu from "@/components/SlidingMenu";

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
    <>
      <SlidingMenu />
    </>
  );
};

export default Index;
