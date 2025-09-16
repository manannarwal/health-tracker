import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, Shield, TrendingUp, Users, Heart, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { login, isLoading } = useAuth();

  useEffect(() => {
    const renderGoogleButton = () => {
      // Check if Google is available
      if (!window.google) {
        console.log('Google Identity Services not loaded yet');
        return false;
      }

      const buttonContainer = document.getElementById('google-signin-button');
      if (!buttonContainer) {
        console.log('Button container not found');
        return false;
      }

      try {
        // Clear any existing content
        buttonContainer.innerHTML = '';
        
        window.google.accounts.id.renderButton(buttonContainer, {
          theme: 'outline',
          size: 'large',
          width: 350,
          text: 'signin_with',
        });
        
        console.log('Google sign-in button rendered successfully');
        
        // Hide fallback button since Google button rendered successfully
        const fallback = document.getElementById('custom-signin-fallback');
        if (fallback) {
          fallback.style.display = 'none';
        }
        
        return true;
      } catch (error) {
        console.error('Failed to render Google sign-in button:', error);
        return false;
      }
    };

    // Try to render immediately if Google is already loaded
    if (window.google && !isLoading) {
      if (renderGoogleButton()) {
        return; // Successfully rendered
      }
    }

    // Set up polling to wait for Google to load
    const maxAttempts = 10;
    let attempts = 0;
    
    const pollForGoogle = () => {
      attempts++;
      console.log(`Attempting to render Google button, attempt ${attempts}`);
      
      if (renderGoogleButton()) {
        return; // Success
      }
      
      if (attempts < maxAttempts) {
        setTimeout(pollForGoogle, 500);
      } else {
        console.log('Max attempts reached, showing fallback button');
        // Show fallback button if we can't render Google button
        const fallback = document.getElementById('custom-signin-fallback');
        if (fallback) {
          fallback.style.display = 'block';
        }
      }
    };

    // Start polling after a short delay
    setTimeout(pollForGoogle, 100);
  }, [isLoading]);

  const handleCustomLogin = () => {
    login();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left side - App information */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Activity className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">
                Health Tracker
              </h1>
            </div>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Your comprehensive health monitoring platform. Track metrics, analyze trends, and take control of your wellness journey.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Heart className="h-6 w-6 text-red-500 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground">Health Metrics</h3>
                <p className="text-muted-foreground text-sm">Track glucose, cholesterol, blood pressure, and more</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingUp className="h-6 w-6 text-green-500 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground">Smart Analytics</h3>
                <p className="text-muted-foreground text-sm">Visualize trends and get insights</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="h-6 w-6 text-blue-500 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground">PDF Reports</h3>
                <p className="text-muted-foreground text-sm">Upload and extract data from lab reports</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="h-6 w-6 text-purple-500 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground">Secure & Private</h3>
                <p className="text-muted-foreground text-sm">Your data is encrypted and protected</p>
              </div>
            </div>
          </div>

          {/* Testimonial or stats */}
          <div className="bg-muted/30 p-6 rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-indigo-600" />
              <span className="text-indigo-800 font-medium">Join thousands of users</span>
            </div>
            <p className="text-indigo-700">
              "Health Tracker helped me monitor my diabetes more effectively and understand my health patterns better."
            </p>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md shadow-xl border-0">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <p className="text-muted-foreground">
                Sign in to your account to access your health dashboard
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Google Sign-In Button Container */}
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div id="google-signin-button" className="google-signin-button min-h-[44px]"></div>
                </div>
                
                {/* Custom styled button as backup - show if Google button fails to render */}
                <div className="text-center" id="custom-signin-fallback" style={{display: 'none'}}>
                  <Button
                    onClick={handleCustomLogin}
                    className="w-full bg-background hover:bg-muted text-foreground border border-border shadow-sm"
                    disabled={isLoading}
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    {isLoading ? 'Signing in...' : 'Continue with Google'}
                  </Button>
                </div>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-muted-foreground">Secure Authentication</span>
                </div>
              </div>

              {/* Security notice */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Your data is encrypted and secure</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  By signing in, you agree to our terms of service and privacy policy.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}