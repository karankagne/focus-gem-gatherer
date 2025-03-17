
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { AlarmClock, Coins, Trophy, User } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Focus', path: '/', icon: <AlarmClock className="w-5 h-5" /> },
    { name: 'Rewards', path: '/rewards', icon: <Coins className="w-5 h-5" /> },
    { name: 'Challenges', path: '/challenges', icon: <Trophy className="w-5 h-5" /> },
    { name: 'Profile', path: '/profile', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <header className="fixed bottom-0 left-0 right-0 z-50 py-2 px-4 backdrop-blur-xl bg-background/80 border-t border-border sm:top-0 sm:bottom-auto sm:border-t-0 sm:border-b animate-fade-in">
      <nav className="max-w-screen-xl mx-auto">
        <ul className="flex items-center justify-between">
          {navItems.map((item) => (
            <li key={item.path} className="w-full">
              <Link 
                to={item.path}
                className={cn(
                  "flex flex-col items-center p-2 rounded-xl transition-all duration-300 hover:text-focus", 
                  location.pathname === item.path 
                    ? "text-focus font-medium" 
                    : "text-muted-foreground"
                )}
              >
                {item.icon}
                <span className="text-xs mt-1">{item.name}</span>
                {location.pathname === item.path && (
                  <span className="absolute bottom-0 sm:top-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-focus animate-pulse" />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
