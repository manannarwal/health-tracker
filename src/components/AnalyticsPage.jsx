import { useState } from 'react';
import { BarChart3, TrendingUp, FileText, Download, Brain, Target, Bell } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useHealthData } from '@/contexts/HealthDataContext';
import HealthTrendsChart from '@/components/HealthTrendsChart';
import HealthInsights from '@/components/HealthInsights';
import HealthExport from '@/components/HealthExport';
import HealthReminders from '@/components/HealthReminders';

export default function AnalyticsPage() {
  const { healthMetrics, statistics } = useHealthData();
  const [activeTab, setActiveTab] = useState('trends');

  // Quick stats for the overview
  const quickStats = [
    {
      icon: BarChart3,
      title: "Total Records",
      value: healthMetrics.length,
      description: "Health metrics tracked",
      color: "text-blue-600"
    },
    {
      icon: TrendingUp,
      title: "This Month",
      value: healthMetrics.filter(m => {
        const metricDate = new Date(m.date);
        const now = new Date();
        return metricDate.getMonth() === now.getMonth() && 
               metricDate.getFullYear() === now.getFullYear();
      }).length,
      description: "New entries this month",
      color: "text-green-600"
    },
    {
      icon: Target,
      title: "Metric Types",
      value: new Set(healthMetrics.map(m => m.type)).size,
      description: "Different health metrics",
      color: "text-purple-600"
    },
    {
      icon: Brain,
      title: "Data Quality",
      value: `${Math.round((healthMetrics.filter(m => m.notes && m.notes.trim()).length / Math.max(healthMetrics.length, 1)) * 100)}%`,
      description: "Records with notes",
      color: "text-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Health Analytics
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Comprehensive analysis and insights from your health data
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {stat.description}
                    </p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Analytics Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full lg:w-fit grid-cols-1 lg:grid-cols-4 gap-2">
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Trends & Charts
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Insights
            </TabsTrigger>
            <TabsTrigger value="reminders" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Reminders
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Health Trends Visualization
                </CardTitle>
                <CardDescription>
                  Interactive charts showing your health metrics over time with trend analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HealthTrendsChart />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <HealthInsights />
          </TabsContent>

          <TabsContent value="reminders" className="space-y-6">
            <HealthReminders />
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <HealthExport />
          </TabsContent>
        </Tabs>

        {/* Data Summary Card */}
        {healthMetrics.length === 0 && (
          <Card className="mt-8">
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Health Data Available
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Start adding health metrics to see detailed analytics and insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Card className="p-4 text-left">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Add Manual Entries
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Go to Dashboard and use the "Add New Metric" form to enter your health data
                  </p>
                </Card>
                <Card className="p-4 text-left">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Upload Reports
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Upload PDF reports and lab results for automatic data extraction
                  </p>
                </Card>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer Info */}
        <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Analytics are updated in real-time based on your health data entries.
            <br />
            All data is stored locally in your browser for privacy and security.
          </p>
        </div>
      </div>
    </div>
  );
}
