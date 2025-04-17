
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Clock, Users, Award } from 'lucide-react';
import { CourseType } from '@/components/courses/CourseCard';

type CourseDetailHeaderProps = {
  course: CourseType & {
    description?: string;
    modules?: any[];
    tags?: string[];
    lessons?: number;
    certificate?: boolean;
  };
};

const CourseDetailHeader = ({ course }: CourseDetailHeaderProps) => {
  const { 
    title, 
    description, 
    thumbnailUrl, 
    duration, 
    progress = 0, 
    studentsCount, 
    tags = [], 
    lessons = 0,
    certificate = false
  } = course;

  return (
    <div className="bg-gray-800 text-white rounded-lg overflow-hidden">
      <div className="relative h-64 md:h-72">
        <img 
          src={thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'} 
          alt={title} 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-gray-700 bg-opacity-70 rounded-full text-xs">
                {tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{title}</h1>
          
          <p className="text-gray-200 mb-4 max-w-3xl">
            {description || 'No description available.'}
          </p>
          
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{duration}</span>
            </div>
            
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>{studentsCount} students</span>
            </div>
            
            {lessons > 0 && (
              <div className="flex items-center">
                <span className="font-medium">{lessons} lessons</span>
              </div>
            )}
            
            {certificate && (
              <div className="flex items-center">
                <Award className="h-4 w-4 mr-1" />
                <span>Certificate Included</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-gray-900">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm">{progress}% Complete</span>
        </div>
        <Progress value={progress} className="h-2 bg-gray-700" />
      </div>
    </div>
  );
};

export default CourseDetailHeader;
