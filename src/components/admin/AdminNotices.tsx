
import React from 'react';
import { Bell, Check, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

// Demo notices for the admin dashboard
const demoNotices = [
  {
    id: 1,
    title: 'System Update Scheduled',
    description: 'A system update is scheduled for April 30, 2025, at 2:00 AM UTC. Expect 30 minutes of downtime.',
    priority: 'high',
    type: 'system',
    isRead: false,
    date: '2025-04-18T08:30:00Z'
  },
  {
    id: 2,
    title: '3 New User Registrations Pending Approval',
    description: 'Three new instructor applications require your review and approval.',
    priority: 'medium',
    type: 'user',
    isRead: false,
    date: '2025-04-20T14:15:00Z'
  },
  {
    id: 3,
    title: 'Course Content Review Required',
    description: 'A newly uploaded course "Advanced Machine Learning" needs content review.',
    priority: 'low',
    type: 'content',
    isRead: true,
    date: '2025-04-19T09:45:00Z'
  }
];

const AdminNotices = () => {
  const markAsRead = (id: number) => {
    toast.success(`Notice #${id} marked as read`);
    // In a real app, this would update the database
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Administrative Notices
        </CardTitle>
        <Badge variant="outline" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Last updated: 2hr ago
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {demoNotices.map((notice) => (
            <div 
              key={notice.id} 
              className={`p-4 rounded-lg border ${notice.isRead ? 'bg-gray-50 dark:bg-gray-900/30' : 'bg-white dark:bg-gray-800'}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h4 className={`font-medium ${notice.isRead ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                    {notice.title}
                  </h4>
                  {!notice.isRead && (
                    <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                  )}
                </div>
                <Badge className={`${getPriorityStyles(notice.priority)} capitalize`}>
                  {notice.priority}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                {notice.description}
              </p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">
                  {formatDate(notice.date)}
                </span>
                {!notice.isRead && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => markAsRead(notice.id)} 
                    className="flex items-center text-xs h-7 px-2 text-blue-600 hover:text-blue-700"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Mark as read
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminNotices;
