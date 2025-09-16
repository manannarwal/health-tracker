import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize Google Identity Services
  useEffect(() => {
    const initializeGoogleAuth = () => {
      console.log('Initializing Google Auth...');
      if (window.google) {
        try {
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });
          console.log('Google Auth initialized successfully');
        } catch (error) {
          console.error('Error initializing Google Auth:', error);
        }
      } else {
        console.error('Google Identity Services not available');
      }
    };

    // Check if script is already loaded
    if (window.google) {
      initializeGoogleAuth();
    } else {
      // Load Google Identity Services script
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          console.log('Google Identity Services script loaded');
          initializeGoogleAuth();
        };
        script.onerror = () => {
          console.error('Failed to load Google Identity Services script');
        };
        document.head.appendChild(script);
      }
    }

    // Check for existing session
    checkExistingSession();

    // No cleanup needed as we want to keep the script loaded
  }, []);

  const checkExistingSession = () => {
    try {
      const savedUser = localStorage.getItem('health-tracker-user');
      const savedToken = localStorage.getItem('health-tracker-token');
      
      if (savedUser && savedToken) {
        const userData = JSON.parse(savedUser);
        const decoded = jwtDecode(savedToken);
        
        // Check if token is still valid (not expired)
        if (decoded.exp * 1000 > Date.now()) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          // Token expired, clear storage
          localStorage.removeItem('health-tracker-user');
          localStorage.removeItem('health-tracker-token');
        }
      }
    } catch (error) {
      console.error('Error checking existing session:', error);
      localStorage.removeItem('health-tracker-user');
      localStorage.removeItem('health-tracker-token');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCredentialResponse = (response) => {
    console.log('Google credential response received:', response);
    try {
      const decoded = jwtDecode(response.credential);
      console.log('Decoded JWT:', decoded);
      
      const userData = {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
        given_name: decoded.given_name,
        family_name: decoded.family_name,
      };

      console.log('User data extracted:', userData);

      // Save to localStorage
      localStorage.setItem('health-tracker-user', JSON.stringify(userData));
      localStorage.setItem('health-tracker-token', response.credential);

      setUser(userData);
      setIsAuthenticated(true);
      setIsLoading(false);
      
      console.log('User authentication completed successfully');
    } catch (error) {
      console.error('Error handling credential response:', error);
      setIsLoading(false);
    }
  };

  const login = () => {
    if (window.google) {
      window.google.accounts.id.prompt();
    }
  };

  const loginWithPopup = () => {
    if (window.google) {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          console.log('Google One Tap not displayed');
        }
      });
    }
  };

  const logout = () => {
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
    
    // Clear user data and localStorage
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('health-tracker-user');
    localStorage.removeItem('health-tracker-token');
    
    // Optional: Revoke Google tokens
    if (window.google && user) {
      window.google.accounts.id.revoke(user.email, (done) => {
        console.log('Google account access revoked');
      });
    }
  };

  const updateUserProfile = (profileData) => {
    try {
      const updatedUser = {
        ...user,
        name: profileData.name,
        // Note: email and picture come from Google and can't be changed
        preferences: profileData.preferences
      };

      // Update localStorage
      localStorage.setItem('health-tracker-user', JSON.stringify(updatedUser));
      
      // Update state
      setUser(updatedUser);
      
      return Promise.resolve(updatedUser);
    } catch (error) {
      console.error('Error updating user profile:', error);
      return Promise.reject(error);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    loginWithPopup,
    logout,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};