
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Challenges from './pages/Challenges';
import Rewards from './pages/Rewards';
import Friends from './pages/Friends';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import { Toaster } from '@/components/ui/sonner';
import { FocusProvider } from './contexts/FocusContext';
import { ThemeProvider } from '@/components/ui/theme-provider';
import FriendConnectionHandler from './components/features/FriendConnectionHandler';
import PermissionRequest from './components/features/PermissionRequest';

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <FocusProvider>
        <Router>
          <PermissionRequest />
          <FriendConnectionHandler />
          <div className="pt-safe w-full overflow-x-hidden" style={{ minHeight: '100vh' }}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/challenges" element={<Challenges />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/connect/:userId" element={<Friends />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <footer className="text-center py-4 text-sm text-muted-foreground">
              with ❤️ from Shivkaran Kagne :)
            </footer>
          </div>
        </Router>
        <Toaster />
      </FocusProvider>
    </ThemeProvider>
  );
}

export default App;
