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

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <FocusProvider>
        <Router>
          <FriendConnectionHandler />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/connect/:userId" element={<Friends />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </FocusProvider>
    </ThemeProvider>
  );
}

export default App;
