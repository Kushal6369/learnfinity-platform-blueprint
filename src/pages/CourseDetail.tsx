
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/context/AuthContext';
import { 
  Clock, Users, Calendar, Star, CheckCircle, PlayCircle, BookOpen, 
  Download, Award, MessageCircle, ArrowLeft, Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Mock course data
const courses = [
  {
    id: '1',
    title: 'Introduction to Web Development',
    description: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript. Build responsive websites from scratch and understand modern web development practices.',
    instructor: {
      name: 'Dr. Sarah Johnson',
      avatar: 'https://i.pravatar.cc/150?img=1',
      title: 'Senior Web Developer',
      bio: 'Dr. Sarah Johnson has over 10 years of experience in web development. She has worked with major tech companies and has taught at several leading universities.'
    },
    category: 'Development',
    thumbnailUrl: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613',
    rating: 4.8,
    reviews: 376,
    duration: '6 hours',
    lastUpdated: 'March 2025',
    studentsCount: 12564,
    price: 49.99,
    language: 'English',
    subtitles: ['English', 'Spanish', 'French'],
    prerequisites: ['Basic computer knowledge', 'No coding experience required'],
    whatYouWillLearn: [
      'Build websites using HTML5, CSS3, and JavaScript',
      'Create responsive layouts that work on mobile devices',
      'Understand how the web works and how websites are hosted',
      'Deploy your websites to the internet'
    ],
    chapters: [
      {
        id: 'ch-1',
        title: 'Course Introduction',
        duration: '12 min',
        type: 'video',
        isFree: true
      },
      {
        id: 'ch-2',
        title: 'HTML Fundamentals',
        duration: '42 min',
        type: 'video',
        isFree: false
      },
      {
        id: 'ch-3',
        title: 'HTML Quiz',
        duration: '15 min',
        type: 'quiz',
        isFree: false
      },
      {
        id: 'ch-4',
        title: 'CSS Basics',
        duration: '56 min',
        type: 'video',
        isFree: false
      },
      {
        id: 'ch-5',
        title: 'CSS Layout & Flexbox',
        duration: '68 min',
        type: 'video',
        isFree: false
      },
      {
        id: 'ch-6',
        title: 'CSS Assignment',
        duration: '30 min',
        type: 'assignment',
        isFree: false
      },
      {
        id: 'ch-7',
        title: 'JavaScript Introduction',
        duration: '49 min',
        type: 'video',
        isFree: false
      },
      {
        id: 'ch-8',
        title: 'DOM Manipulation',
        duration: '53 min',
        type: 'video',
        isFree: false
      },
      {
        id: 'ch-9',
        title: 'JavaScript Project',
        duration: '60 min',
        type: 'project',
        isFree: false
      },
      {
        id: 'ch-10',
        title: 'Responsive Design',
        duration: '47 min',
        type: 'video',
        isFree: false
      },
      {
        id: 'ch-11',
        title: 'Final Quiz',
        duration: '20 min',
        type: 'quiz',
        isFree: false
      },
      {
        id: 'ch-12',
        title: 'Course Conclusion',
        duration: '8 min',
        type: 'video',
        isFree: true
      },
    ],
    resources: [
      {
        id: 'res-1',
        title: 'Course Slides',
        type: 'pdf',
        size: '2.4 MB'
      },
      {
        id: 'res-2',
        title: 'HTML Cheat Sheet',
        type: 'pdf',
        size: '1.1 MB'
      },
      {
        id: 'res-3',
        title: 'CSS Reference Guide',
        type: 'pdf',
        size: '1.8 MB'
      },
      {
        id: 'res-4',
        title: 'Project Files',
        type: 'zip',
        size: '4.5 MB'
      }
    ]
  }
];

// Mock reviews
const reviews = [
  {
    id: '1',
    user: {
      name: 'John Smith',
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    rating: 5,
    date: '2 weeks ago',
    comment: 'This is an excellent course for beginners. The instructor explains everything clearly and the exercises help reinforce what you learn.'
  },
  {
    id: '2',
    user: {
      name: 'Maria Rodriguez',
      avatar: 'https://i.pravatar.cc/150?img=5'
    },
    rating: 4,
    date: '1 month ago',
    comment: 'I learned a lot from this course. The content is well structured and easy to follow. I would have liked more real-world examples though.'
  },
  {
    id: '3',
    user: {
      name: 'David Chen',
      avatar: 'https://i.pravatar.cc/150?img=8'
    },
    rating: 5,
    date: '2 months ago',
    comment: 'As someone with no prior coding experience, this course was perfect for me. The pace is just right, and the instructor is fantastic at explaining complex concepts in simple terms.'
  }
];

const CourseDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isEnrolled, setIsEnrolled] = useState(false);
  
  // Find the course by ID
  const course = courses.find(c => c.id === id);
  
  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-3xl font-bold mb-4">Course Not Found</h1>
            <p className="mb-6 text-gray-600">The course you are looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/courses')}>Browse Courses</Button>
          </div>
        </div>
      </div>
    );
  }
  
  const handleEnroll = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setIsEnrolled(true);
    toast.success('Successfully enrolled in the course!');
  };
  
  const renderRatingStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
        />
      ));
  };
  
  const { 
    title, 
    description, 
    instructor, 
    thumbnailUrl, 
    rating, 
    reviews: reviewCount, 
    duration, 
    lastUpdated, 
    studentsCount, 
    price, 
    language, 
    subtitles, 
    whatYouWillLearn,
    prerequisites,
    chapters,
    resources,
    category
  } = course;
  
  const totalVideoDuration = chapters.reduce((total, chapter) => {
    const [mins] = chapter.duration.split(' ');
    return total + parseInt(mins, 10);
  }, 0);
  
  const totalLectures = chapters.length;
  const videosCount = chapters.filter(ch => ch.type === 'video').length;
  const quizzesCount = chapters.filter(ch => ch.type === 'quiz').length;
  const assignmentsCount = chapters.filter(ch => ch.type === 'assignment').length;
  const projectsCount = chapters.filter(ch => ch.type === 'project').length;
  
  const totalDurationHours = Math.floor(totalVideoDuration / 60);
  const totalDurationMins = totalVideoDuration % 60;
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Course header */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 text-white">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/courses')}
            className="mb-6 text-gray-200 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <div className="md:w-2/3 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-white/20">{category}</Badge>
                <span className="text-sm">Updated {lastUpdated}</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
              <p className="text-lg text-gray-100">{description}</p>
              
              <div className="flex items-center flex-wrap gap-4">
                <div className="flex items-center">
                  <div className="flex mr-1">
                    {renderRatingStars(rating)}
                  </div>
                  <span className="ml-1">
                    {rating} ({reviewCount} reviews)
                  </span>
                </div>
                
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  <span>{studentsCount.toLocaleString()} students</span>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{duration} total</span>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>Last updated: {lastUpdated}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={instructor.avatar} alt={instructor.name} />
                  <AvatarFallback>{instructor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm">Instructor</p>
                  <p className="font-medium">{instructor.name}</p>
                </div>
              </div>
            </div>
            
            {/* Course card */}
            <div className="md:w-1/3">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden text-gray-900">
                <div className="aspect-video">
                  <img 
                    src={thumbnailUrl} 
                    alt={title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold">${price}</span>
                  </div>
                  
                  {isEnrolled ? (
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700" 
                      onClick={() => navigate('/dashboard')}
                    >
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Go to Course
                    </Button>
                  ) : (
                    <Button 
                      className="w-full bg-purple-600 hover:bg-purple-700" 
                      onClick={handleEnroll}
                    >
                      Enroll Now
                    </Button>
                  )}
                  
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Language:</span>
                      <span className="font-medium">{language}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtitles:</span>
                      <span className="font-medium">{subtitles.join(', ')}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total lectures:</span>
                      <span className="font-medium">{totalLectures}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total duration:</span>
                      <span className="font-medium">
                        {totalDurationHours}h {totalDurationMins}m
                      </span>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200 text-center">
                      <p className="text-sm text-gray-600">30-day money-back guarantee</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Course content */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="curriculum">
              <TabsList className="mb-6">
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="curriculum" className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-semibold">Course Content</h2>
                    <div className="text-sm text-gray-600">
                      {totalLectures} lectures • {totalDurationHours}h {totalDurationMins}m total length
                    </div>
                  </div>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="section-1">
                      <AccordionTrigger>Section 1: Getting Started</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-3">
                          {chapters.slice(0, 3).map((chapter) => (
                            <li 
                              key={chapter.id}
                              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
                            >
                              <div className="flex items-center">
                                {chapter.type === 'video' && <PlayCircle className="h-4 w-4 mr-2 text-gray-500" />}
                                {chapter.type === 'quiz' && <BookOpen className="h-4 w-4 mr-2 text-gray-500" />}
                                <span className={chapter.isFree ? "text-gray-900" : "text-gray-600"}>
                                  {chapter.title}
                                  {chapter.isFree && <span className="ml-2 text-xs text-green-600 font-medium">Free</span>}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm text-gray-500 mr-2">{chapter.duration}</span>
                                {!chapter.isFree && !isEnrolled && <Lock className="h-4 w-4 text-gray-400" />}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="section-2">
                      <AccordionTrigger>Section 2: CSS Fundamentals</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-3">
                          {chapters.slice(3, 6).map((chapter) => (
                            <li 
                              key={chapter.id}
                              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
                            >
                              <div className="flex items-center">
                                {chapter.type === 'video' && <PlayCircle className="h-4 w-4 mr-2 text-gray-500" />}
                                {chapter.type === 'quiz' && <BookOpen className="h-4 w-4 mr-2 text-gray-500" />}
                                {chapter.type === 'assignment' && <BookOpen className="h-4 w-4 mr-2 text-gray-500" />}
                                <span className={chapter.isFree ? "text-gray-900" : "text-gray-600"}>
                                  {chapter.title}
                                  {chapter.isFree && <span className="ml-2 text-xs text-green-600 font-medium">Free</span>}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm text-gray-500 mr-2">{chapter.duration}</span>
                                {!chapter.isFree && !isEnrolled && <Lock className="h-4 w-4 text-gray-400" />}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="section-3">
                      <AccordionTrigger>Section 3: JavaScript Basics</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-3">
                          {chapters.slice(6, 9).map((chapter) => (
                            <li 
                              key={chapter.id}
                              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
                            >
                              <div className="flex items-center">
                                {chapter.type === 'video' && <PlayCircle className="h-4 w-4 mr-2 text-gray-500" />}
                                {chapter.type === 'project' && <BookOpen className="h-4 w-4 mr-2 text-gray-500" />}
                                <span className={chapter.isFree ? "text-gray-900" : "text-gray-600"}>
                                  {chapter.title}
                                  {chapter.isFree && <span className="ml-2 text-xs text-green-600 font-medium">Free</span>}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm text-gray-500 mr-2">{chapter.duration}</span>
                                {!chapter.isFree && !isEnrolled && <Lock className="h-4 w-4 text-gray-400" />}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="section-4">
                      <AccordionTrigger>Section 4: Responsive Design & Conclusion</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-3">
                          {chapters.slice(9, 12).map((chapter) => (
                            <li 
                              key={chapter.id}
                              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
                            >
                              <div className="flex items-center">
                                {chapter.type === 'video' && <PlayCircle className="h-4 w-4 mr-2 text-gray-500" />}
                                {chapter.type === 'quiz' && <BookOpen className="h-4 w-4 mr-2 text-gray-500" />}
                                <span className={chapter.isFree ? "text-gray-900" : "text-gray-600"}>
                                  {chapter.title}
                                  {chapter.isFree && <span className="ml-2 text-xs text-green-600 font-medium">Free</span>}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm text-gray-500 mr-2">{chapter.duration}</span>
                                {!chapter.isFree && !isEnrolled && <Lock className="h-4 w-4 text-gray-400" />}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
                
                {resources.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-4">Course Resources</h2>
                    <ul className="space-y-3">
                      {resources.map((resource) => (
                        <li 
                          key={resource.id}
                          className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
                        >
                          <div className="flex items-center">
                            <Download className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{resource.title}</span>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">{resource.size}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="overview" className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">What You'll Learn</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {whatYouWillLearn.map((item, index) => (
                      <div key={index} className="flex">
                        <CheckCircle className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Prerequisites</h2>
                  <ul className="space-y-2">
                    {prerequisites.map((item, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2 text-blue-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Course Description</h2>
                  <div className="prose max-w-none">
                    <p className="mb-4">{description}</p>
                    <p className="mb-4">
                      This comprehensive course will take you from beginner to proficient in web development.
                      You'll learn all the essential skills needed to build responsive, modern websites from scratch.
                    </p>
                    <p>
                      By the end of the course, you'll have built several projects that you can add to your portfolio,
                      and you'll have the confidence to tackle web development projects on your own.
                    </p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">This Course Includes</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <PlayCircle className="h-5 w-5 mr-2 text-gray-600" />
                      <span>{videosCount} video lectures</span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-gray-600" />
                      <span>{quizzesCount} quizzes</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="h-5 w-5 mr-2 text-gray-600" />
                      <span>Certificate of completion</span>
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="h-5 w-5 mr-2 text-gray-600" />
                      <span>Q&A support</span>
                    </div>
                    <div className="flex items-center">
                      <Download className="h-5 w-5 mr-2 text-gray-600" />
                      <span>{resources.length} downloadable resources</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-gray-600" />
                      <span>{assignmentsCount} assignments</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="instructor" className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-shrink-0">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={instructor.avatar} alt={instructor.name} />
                        <AvatarFallback>{instructor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{instructor.name}</h2>
                      <p className="text-gray-600">{instructor.title}</p>
                      
                      <div className="flex items-center mt-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm ml-1">4.8 Instructor Rating</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <MessageCircle className="h-4 w-4 text-gray-400" />
                        <span className="text-sm ml-1">452 Reviews</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm ml-1">32,568 Students</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <PlayCircle className="h-4 w-4 text-gray-400" />
                        <span className="text-sm ml-1">8 Courses</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">About the Instructor</h3>
                    <p className="text-gray-700">
                      {instructor.bio}
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3 flex flex-col items-center justify-center p-4 border-r border-gray-200">
                      <div className="text-6xl font-bold text-yellow-500">{rating}</div>
                      <div className="flex mt-2">
                        {renderRatingStars(rating)}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Course Rating</div>
                    </div>
                    
                    <div className="md:w-2/3">
                      <h3 className="text-lg font-semibold mb-4">Rating Breakdown</h3>
                      <div className="space-y-3">
                        {[5, 4, 3, 2, 1].map((star) => (
                          <div key={star} className="flex items-center">
                            <div className="w-16 text-sm">{star} stars</div>
                            <div className="w-full ml-4 mr-4">
                              <Progress 
                                value={star === 5 ? 78 : star === 4 ? 15 : star === 3 ? 5 : star === 2 ? 2 : 0} 
                                className="h-2" 
                              />
                            </div>
                            <div className="w-12 text-right text-sm text-gray-600">
                              {star === 5 ? '78%' : star === 4 ? '15%' : star === 3 ? '5%' : star === 2 ? '2%' : '0%'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-6">Student Reviews</h3>
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                        <div className="flex items-start">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={review.user.avatar} alt={review.user.name} />
                            <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="ml-4">
                            <div className="flex items-center">
                              <h4 className="font-medium">{review.user.name}</h4>
                              <span className="text-gray-400 text-sm ml-2">• {review.date}</span>
                            </div>
                            <div className="flex items-center mt-1">
                              {renderRatingStars(review.rating)}
                            </div>
                            <p className="mt-3 text-gray-700">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Course Requirements</h2>
                <ul className="space-y-2">
                  {prerequisites.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">Share This Course</h3>
                <p className="text-gray-600 text-sm mb-4">If you found this course helpful, share it with your friends and colleagues.</p>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Facebook
                  </Button>
                  <Button variant="outline" size="sm">
                    Twitter
                  </Button>
                  <Button variant="outline" size="sm">
                    LinkedIn
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
