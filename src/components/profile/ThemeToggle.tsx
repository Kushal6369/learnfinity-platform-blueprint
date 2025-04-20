
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const ThemeToggle = ({ theme, onToggleTheme }: ThemeToggleProps) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-muted-foreground">
        {theme === 'light' ? 'Light' : 'Dark'} Mode
      </span>
      <Toggle
        aria-label="Toggle theme"
        pressed={theme === 'dark'}
        onPressedChange={onToggleTheme}
        className="border border-input"
      >
        {theme === 'light' ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </Toggle>
    </div>
  );
};

export default ThemeToggle;
