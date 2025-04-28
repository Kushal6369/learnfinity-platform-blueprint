
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Chatbot = () => {
  return (
    <div className="container mx-auto max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Study Assistant</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome to your personal study assistant. Ask questions about your courses, get help with assignments, or discuss any study-related topics.
          </p>
          {/* ChatbotWidget is already included in the layout */}
        </CardContent>
      </Card>
    </div>
  );
};

export default Chatbot;
