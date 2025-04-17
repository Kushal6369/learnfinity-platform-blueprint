
import React from 'react';
import { Check, Play, Lock } from 'lucide-react';

type Module = {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  locked?: boolean;
};

type ModuleProgressProps = {
  module: Module;
};

const ModuleProgress = ({ module }: ModuleProgressProps) => {
  const { title, duration, completed, locked = false } = module;

  return (
    <div className="border rounded-lg hover:shadow-sm transition-shadow">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
            completed 
              ? 'bg-green-100 text-green-600' 
              : locked 
                ? 'bg-gray-100 text-gray-400' 
                : 'bg-blue-100 text-blue-600'
          }`}>
            {completed ? (
              <Check className="h-4 w-4" />
            ) : locked ? (
              <Lock className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </div>
          
          <div>
            <h4 className={`font-medium ${locked ? 'text-gray-500' : ''}`}>{title}</h4>
            <p className="text-sm text-gray-500">{duration}</p>
          </div>
        </div>
        
        {!locked && !completed && (
          <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md">
            Start
          </button>
        )}
        
        {!locked && completed && (
          <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md">
            Review
          </button>
        )}
        
        {locked && (
          <span className="text-sm text-gray-500">Locked</span>
        )}
      </div>
    </div>
  );
};

export default ModuleProgress;
