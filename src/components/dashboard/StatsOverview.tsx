
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Award, BookOpen, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

type StatCardProps = {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  iconColor?: string;
  iconBgColor?: string;
};

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  iconColor = 'text-purple-500',
  iconBgColor = 'bg-purple-100'
}: StatCardProps) => {
  return (
    <Card>
      <CardContent className="p-6 flex items-start gap-4">
        <div className={cn('p-3 rounded-lg', iconBgColor)}>
          <Icon className={cn('h-6 w-6', iconColor)} />
        </div>
        <div>
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <div className="text-2xl font-bold mt-1">{value}</div>
          <p className="text-gray-500 text-sm mt-1">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

type StatsOverviewProps = {
  stats: {
    totalHours: number;
    coursesCompleted: number;
    coursesInProgress: number;
    assignmentsCompleted: number;
  };
};

const StatsOverview = ({ stats }: StatsOverviewProps) => {
  const {
    totalHours,
    coursesCompleted,
    coursesInProgress,
    assignmentsCompleted
  } = stats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Learning Hours"
        value={`${totalHours}h`}
        description="Total hours watched"
        icon={Clock}
        iconColor="text-blue-500"
        iconBgColor="bg-blue-100"
      />
      
      <StatCard
        title="Completed"
        value={coursesCompleted}
        description="Courses finished"
        icon={Award}
        iconColor="text-green-500"
        iconBgColor="bg-green-100"
      />
      
      <StatCard
        title="In Progress"
        value={coursesInProgress}
        description="Active courses"
        icon={BookOpen}
        iconColor="text-purple-500"
        iconBgColor="bg-purple-100"
      />
      
      <StatCard
        title="Assignments"
        value={assignmentsCompleted}
        description="Tasks completed"
        icon={CheckSquare}
        iconColor="text-amber-500"
        iconBgColor="bg-amber-100"
      />
    </div>
  );
};

export default StatsOverview;
