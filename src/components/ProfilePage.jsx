import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { User, Mail, Settings, Save, Edit3, Camera } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export default function ProfilePage() {
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    profileImage: '',
    preferences: {
      theme: 'light',
      notifications: true,
      dataRetention: 'monthly'
    }
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        profileImage: user.picture || '',
        preferences: {
          theme: 'light',
          notifications: true,
          dataRetention: 'monthly'
        }
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Update user context immediately
      if (updateUserProfile) {
        await updateUserProfile(profileData);
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original user data
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        profileImage: user.picture || '',
        preferences: {
          theme: 'light',
          notifications: true,
          dataRetention: 'monthly'
        }
      });
    }
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">User Not Found</h2>
          <p className="text-muted-foreground">Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">User Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="relative mx-auto">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profileData.profileImage} alt={profileData.name} />
                    <AvatarFallback className="text-2xl">
                      {profileData.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <button className="absolute -bottom-1 -right-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-2 shadow-lg transition-colors">
                      <Camera className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <h2 className="text-xl font-semibold text-foreground mt-4">{profileData.name}</h2>
                <p className="text-muted-foreground">{profileData.email}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Member since {new Date().getFullYear()}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Account verified</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
                  <p className="text-sm text-muted-foreground">Update your basic profile information</p>
                </div>
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      size="sm"
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      size="sm"
                      disabled={isSaving}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Full Name
                    </label>
                    {isEditing ? (
                      <Input
                        value={profileData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <p className="py-2 text-foreground">{profileData.name || 'Not provided'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Email Address
                    </label>
                    <p className="py-2 text-muted-foreground">{profileData.email} (from Google)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-foreground">Preferences</h3>
                <p className="text-sm text-muted-foreground">Customize your app experience</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-foreground">
                        Theme Preference
                      </label>
                      <p className="text-sm text-muted-foreground">Choose your preferred app theme</p>
                    </div>
                    {isEditing ? (
                      <select
                        value={profileData.preferences.theme}
                        onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                        className="px-3 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring text-foreground"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="system">System</option>
                      </select>
                    ) : (
                      <span className="text-foreground capitalize">{profileData.preferences.theme}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-foreground">
                        Notifications
                      </label>
                      <p className="text-sm text-muted-foreground">Receive health reminders and updates</p>
                    </div>
                    {isEditing ? (
                      <input
                        type="checkbox"
                        checked={profileData.preferences.notifications}
                        onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
                        className="h-4 w-4 text-primary focus:ring-ring border-border rounded"
                      />
                    ) : (
                      <span className="text-foreground">
                        {profileData.preferences.notifications ? 'Enabled' : 'Disabled'}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-foreground">
                        Data Retention
                      </label>
                      <p className="text-sm text-muted-foreground">How long to keep your health data</p>
                    </div>
                    {isEditing ? (
                      <select
                        value={profileData.preferences.dataRetention}
                        onChange={(e) => handlePreferenceChange('dataRetention', e.target.value)}
                        className="px-3 py-2 bg-background border border-border rounded-md focus:ring-2 focus:ring-ring focus:border-ring text-foreground"
                      >
                        <option value="weekly">1 Week</option>
                        <option value="monthly">1 Month</option>
                        <option value="yearly">1 Year</option>
                        <option value="forever">Forever</option>
                      </select>
                    ) : (
                      <span className="text-foreground capitalize">{profileData.preferences.dataRetention}</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-foreground">Account Actions</h3>
                <p className="text-sm text-muted-foreground">Manage your account and data</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" className="flex-1">
                    Export Data
                  </Button>
                  <Button variant="outline" className="flex-1 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
                    Delete Account
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Account deletion is permanent and cannot be undone. All your health data will be removed.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}