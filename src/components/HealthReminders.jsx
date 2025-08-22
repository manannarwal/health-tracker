import { useState, useEffect } from 'react';
import { Bell, Plus, Calendar, Clock, AlertCircle, CheckCircle, X, Edit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

export default function HealthReminders() {
  const [reminders, setReminders] = useState([]);
  const [isAddingReminder, setIsAddingReminder] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [newReminder, setNewReminder] = useState({
    title: '',
    type: 'medication',
    frequency: 'daily',
    time: '09:00',
    startDate: new Date().toISOString().split('T')[0],
    notes: '',
    isActive: true
  });

  // Load reminders from localStorage on component mount
  useEffect(() => {
    const savedReminders = localStorage.getItem('healthReminders');
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    }
  }, []);

  // Save reminders to localStorage whenever reminders change
  useEffect(() => {
    localStorage.setItem('healthReminders', JSON.stringify(reminders));
  }, [reminders]);

  // Check for due reminders and show notifications
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const currentDate = now.toISOString().split('T')[0];

      reminders.forEach(reminder => {
        if (reminder.isActive && shouldShowReminder(reminder, currentDate, currentTime)) {
          // Show browser notification if supported
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`Health Reminder: ${reminder.title}`, {
              body: reminder.notes || `Time for your ${reminder.type}`,
              icon: '/favicon.ico',
              tag: reminder.id
            });
          }
        }
      });
    };

    // Check reminders every minute
    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [reminders]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const shouldShowReminder = (reminder, currentDate, currentTime) => {
    const reminderDate = new Date(reminder.startDate);
    const today = new Date(currentDate);
    
    // Check if reminder should be active today based on frequency
    let shouldShowToday = false;
    
    switch (reminder.frequency) {
      case 'daily':
        shouldShowToday = today >= reminderDate;
        break;
      case 'weekly':
        const daysDiff = Math.floor((today - reminderDate) / (1000 * 60 * 60 * 24));
        shouldShowToday = daysDiff >= 0 && daysDiff % 7 === 0;
        break;
      case 'monthly':
        shouldShowToday = today.getDate() === reminderDate.getDate() && today >= reminderDate;
        break;
      case 'once':
        shouldShowToday = currentDate === reminder.startDate;
        break;
    }

    return shouldShowToday && currentTime === reminder.time;
  };

  const addReminder = () => {
    const reminder = {
      ...newReminder,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    setReminders(prev => [...prev, reminder]);
    setNewReminder({
      title: '',
      type: 'medication',
      frequency: 'daily',
      time: '09:00',
      startDate: new Date().toISOString().split('T')[0],
      notes: '',
      isActive: true
    });
    setIsAddingReminder(false);
  };

  const updateReminder = (id, updates) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === id ? { ...reminder, ...updates } : reminder
    ));
  };

  const deleteReminder = (id) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
  };

  const toggleReminder = (id) => {
    updateReminder(id, { isActive: !reminders.find(r => r.id === id).isActive });
  };

  const getNextReminderTime = (reminder) => {
    const now = new Date();
    const [hours, minutes] = reminder.time.split(':').map(Number);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    
    if (today <= now) {
      today.setDate(today.getDate() + 1);
    }
    
    return today.toLocaleString();
  };

  const reminderTypes = [
    { value: 'medication', label: 'Medication', icon: '💊' },
    { value: 'appointment', label: 'Appointment', icon: '🏥' },
    { value: 'exercise', label: 'Exercise', icon: '🏃' },
    { value: 'checkup', label: 'Health Check', icon: '📋' },
    { value: 'diet', label: 'Diet/Nutrition', icon: '🥗' },
    { value: 'other', label: 'Other', icon: '⚕️' }
  ];

  const frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'once', label: 'One-time' }
  ];

  const activeReminders = reminders.filter(r => r.isActive);
  const upcomingReminders = reminders.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Health Reminders</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Set up automated reminders for medications, appointments, and health activities
          </p>
        </div>
        
        <Dialog open={isAddingReminder} onOpenChange={setIsAddingReminder}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Reminder
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Health Reminder</DialogTitle>
              <DialogDescription>
                Set up a new reminder for your health routine
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Reminder Title</Label>
                <Input
                  id="title"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Take blood pressure medication"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={newReminder.type} onValueChange={(value) => setNewReminder(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {reminderTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          <span className="flex items-center gap-2">
                            <span>{type.icon}</span>
                            {type.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Select value={newReminder.frequency} onValueChange={(value) => setNewReminder(prev => ({ ...prev, frequency: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencyOptions.map(freq => (
                        <SelectItem key={freq.value} value={freq.value}>
                          {freq.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newReminder.time}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newReminder.startDate}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input
                  id="notes"
                  value={newReminder.notes}
                  onChange={(e) => setNewReminder(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional details or instructions"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={addReminder} disabled={!newReminder.title.trim()}>
                  Create Reminder
                </Button>
                <Button variant="outline" onClick={() => setIsAddingReminder(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Bell className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{activeReminders.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Active Reminders</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {reminders.filter(r => r.frequency === 'daily').length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Daily Reminders</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{upcomingReminders.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Upcoming Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reminders List */}
      <Card>
        <CardHeader>
          <CardTitle>All Reminders</CardTitle>
          <CardDescription>
            Manage your health reminders and their schedules
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reminders.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Reminders Set
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Create your first health reminder to stay on track with your health routine
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reminders.map(reminder => (
                <div
                  key={reminder.id}
                  className={`p-4 border rounded-lg ${
                    reminder.isActive 
                      ? 'border-green-200 bg-green-50 dark:bg-green-900/20' 
                      : 'border-gray-200 bg-gray-50 dark:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg">
                          {reminderTypes.find(t => t.value === reminder.type)?.icon || '⚕️'}
                        </span>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {reminder.title}
                        </h3>
                        <Badge variant={reminder.isActive ? 'default' : 'secondary'}>
                          {reminder.isActive ? 'Active' : 'Paused'}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {reminder.time} • {reminder.frequency}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Started {new Date(reminder.startDate).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {reminder.notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                          {reminder.notes}
                        </p>
                      )}
                      
                      {reminder.isActive && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                          Next: {getNextReminderTime(reminder)}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleReminder(reminder.id)}
                      >
                        {reminder.isActive ? 'Pause' : 'Resume'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteReminder(reminder.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Status */}
      {typeof window !== 'undefined' && 'Notification' in window && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {Notification.permission === 'granted' ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                )}
                <span className="text-sm font-medium">
                  Browser Notifications: {
                    Notification.permission === 'granted' ? 'Enabled' :
                    Notification.permission === 'denied' ? 'Blocked' : 'Not Set'
                  }
                </span>
              </div>
              
              {Notification.permission !== 'granted' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => Notification.requestPermission()}
                >
                  Enable Notifications
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
