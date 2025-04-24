
import React from 'react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  return (
    <div className="menu shadow-xl">
      <div className="sticky top-0 py-6">
        <h2 className="px-4 mb-8 text-white font-semibold transition-all duration-300">
          <span className="menu-label">Menu</span>
        </h2>
      </div>
    </div>
  );
};

export default Sidebar;
