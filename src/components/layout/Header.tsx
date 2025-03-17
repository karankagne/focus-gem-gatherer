
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X, Home, Trophy, User, Users, Hourglass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/ui/theme-provider';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Challenges', path: '/challenges', icon: Trophy },
  { name: 'Friends', path: '/friends', icon: Users },
  { name: 'Rewards', path: '/rewards', icon: Trophy },
  { name: 'Profile', path: '/profile', icon: User },
];

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const isHome = location.pathname === '/';
  
  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`fixed w-full z-50 transition-all bg-background/95 backdrop-blur-sm shadow-sm ${isHome ? 'py-4' : 'py-2'}`}>
      <div className="max-w-screen-md mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <Hourglass className="h-6 w-6 text-focus mr-2" />
          <span className="font-bold text-xl">FocusGem</span>
        </Link>

        {/* Desktop navigation */}
        {!isMobile && (
          <nav className="flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant="ghost"
                  className={`${
                    location.pathname === item.path
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Button>
              </Link>
            ))}
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </nav>
        )}

        {/* Mobile hamburger menu */}
        {isMobile && (
          <div className="flex items-center mr-5">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="mr-1">
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        )}
      </div>

      {/* Mobile navigation */}
      <AnimatePresence>
        {isMobile && isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-14 left-0 w-full bg-background/95 backdrop-blur-md border-b shadow-lg"
          >
            <nav className="flex flex-col max-w-screen-md mx-auto p-4">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} className="w-full">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start mb-2 ${
                      location.pathname === item.path
                        ? 'bg-muted text-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Button>
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
