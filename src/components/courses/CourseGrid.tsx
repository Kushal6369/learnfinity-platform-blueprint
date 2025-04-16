
import React from 'react';
import CourseCard, { CourseType } from './CourseCard';

type CourseGridProps = {
  courses: CourseType[];
  className?: string;
};

const CourseGrid = ({ courses, className }: CourseGridProps) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className || ''}`}>
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};

export default CourseGrid;
