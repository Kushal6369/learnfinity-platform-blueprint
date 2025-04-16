
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, BookOpen, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CourseType } from '../courses/CourseCard';

type ProgressCardProps = {
  course: CourseType;
  chaptersCompleted?: number;
  totalChapters?: number;
};

const ProgressCard = ({ 
  course, 
  chaptersCompleted = 0, 
  totalChapters = 0 
}: ProgressCardProps) => {
  const { id, title, thumbnailUrl, duration, progress = 0 } = course;
  const progressText = `${chaptersCompleted}/${totalChapters} chapters`;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 aspect-video md:aspect-auto relative">
            <img 
              src={thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'} 
              alt={title} 
              className="w-full h-full object-cover"
            />
            {progress >= 100 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-400" />
              </div>
            )}
          </div>
          
          <div className="flex flex-col justify-between p-4 md:w-2/3">
            <div>
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              
              <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{duration}</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  <span>{progressText}</span>
                </div>
              </div>
              
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">Your Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-end">
        <Button variant="ghost" asChild>
          <Link to={`/course/${id}`} className="flex items-center text-purple-600">
            Continue Learning
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProgressCard;
