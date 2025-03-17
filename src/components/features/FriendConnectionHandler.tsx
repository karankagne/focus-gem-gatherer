
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const FriendConnectionHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Look for /connect/user-id in the URL path
    const match = location.pathname.match(/\/connect\/([a-zA-Z0-9-]+)/);
    
    if (match && match[1]) {
      const userId = match[1];
      
      // In a real app, we would fetch the user's details from an API
      // and handle the connection process server-side
      
      // Mock connection process
      setTimeout(() => {
        toast.success('Friend request sent!', {
          description: `You've sent a friend request to this user`,
        });
        
        // Redirect to friends page
        navigate('/friends');
      }, 500);
    }
  }, [location, navigate]);

  return null; // This component doesn't render anything
};

export default FriendConnectionHandler;
