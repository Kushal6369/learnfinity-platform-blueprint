import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ChevronRight, Users, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export type CourseType = {
  id: string;
  title: string;
  instructor: string;
  category: string;
  thumbnailUrl: string;
  rating: number;
  duration: string;
  studentsCount: number;
  price: number;
  progress?: number;
  enrolled?: boolean;
};

type CourseCardProps = {
  course: CourseType;
  className?: string;
};

const CourseCard = ({ course, className }: CourseCardProps) => {
  const {
    id,
    title,
    instructor,
    category,
    thumbnailUrl,
    rating,
    duration,
    studentsCount,
    price,
    progress,
    enrolled
  } = course;

  const { isAuthenticated } = useAuth();

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4", 
            i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          )}
        />
      ));
  };

  const handleEnroll = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please log in to enroll in courses');
      return;
    }

    // For now, just redirect to the course page
    window.location.href = `/course/${id}`;
  };

  return (
    <Card className={cn("overflow-hidden transition-shadow hover:shadow-md", className)}>
      <div className="aspect-video relative overflow-hidden">
        <img
          src={thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'}
          alt={title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        <Badge 
          variant="secondary" 
          className="absolute top-2 right-2 bg-white text-purple-700"
        >
          {category}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-3">by {instructor}</p>
        
        <div className="flex items-center gap-1 mb-3">
          {renderStars(rating)}
          <span className="text-sm ml-1 text-gray-700">{rating.toFixed(1)}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{studentsCount} students</span>
          </div>
        </div>
        
        {progress !== undefined && (
          <div className="mt-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        {enrolled ? (
          <Button variant="secondary" asChild>
            <Link to={`/course/${id}`} className="flex items-center">
              Continue Learning
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <div className="flex items-center justify-between w-full">
            <div className="text-lg font-semibold">
              {price > 0 ? `$${price.toFixed(2)}` : 'Free'}
            </div>
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleEnroll}
            >
              Enroll Now
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
