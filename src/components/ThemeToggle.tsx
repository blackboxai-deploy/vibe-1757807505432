'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled>
        <span className="h-4 w-4">○</span>
      </Button>
    );
  }

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
    } else if (theme === 'light') {
      setTheme('system');
    } else {
      setTheme('dark');
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'dark':
        return '🌙';
      case 'light':
        return '☀️';
      default:
        return '🖥️';
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'dark':
        return 'Dark mode';
      case 'light':
        return 'Light mode';
      default:
        return 'System mode';
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      title={getThemeLabel()}
      className="relative"
    >
      <span className="text-lg">{getThemeIcon()}</span>
    </Button>
  );
};