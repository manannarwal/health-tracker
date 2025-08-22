import { Activity, Heart, Droplet, TrendingUp, Scale, Calculator } from "lucide-react";
import StatsCard from "./StatsCard";
import UploadCard from "./UploadCard";
import HealthMetricCard from "./HealthMetricCard";
import HealthMetricsTable from "./HealthMetricsTable";
import ReportsManagement from "./ReportsManagement";
import { useHealthData } from "@/contexts/HealthDataContext";
import { formatDate, getRelativeTime, getMetricIcon } from "@/utils/healthDataUtils";

export default function Dashboard() {
  const { stats, healthMetrics, uploadedReports } = useHealthData();

  // Get recent health metrics (last 6 entries)
  const recentMetrics = healthMetrics
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  // Stats configuration
  const healthStats = [
    {
      title: "Total Reports",
      value: uploadedReports.length.toString(),
      icon: Activity,
      description: "Health reports uploaded",
      trend: `${uploadedReports.length > 0 ? '+' : ''}${uploadedReports.length} total`
    },
    {
      title: "BMI",
      value: stats.currentBMI ? `${stats.currentBMI.toFixed(1)}` : "No data",
      icon: Calculator,
      description: stats.bmiCategory || "Calculate BMI",
      trend: stats.currentBMI ? `${stats.bmiCategory}` : "Add height & weight"
    },
    {
      title: "Weight",
      value: stats.latestWeight || "No data",
      icon: Scale,
      description: "Latest weight",
      trend: stats.latestWeight ? "Recent measurement" : "Add first reading"
    },
    {
      title: "Blood Pressure",
      value: stats.latestBloodPressure || "No data",
      icon: Heart,
      description: "Latest reading",
      trend: stats.latestBloodPressure ? "Recent measurement" : "Add first reading"
    },
    {
      title: "Blood Sugar",
      value: stats.latestBloodSugar || "No data",
      icon: Droplet,
      description: "Latest glucose level",
      trend: stats.latestBloodSugar ? "Recent measurement" : "Add first reading"
    },
    {
      title: "Total Cholesterol",
      value: stats.latestCholesterol || "No data",
      icon: TrendingUp,
      description: "Latest test result",
      trend: stats.latestCholesterol ? "Recent measurement" : "Add first reading"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Health Dashboard</h1>
        <p className="text-muted-foreground">
          Track and monitor your health metrics in one place
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {healthStats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            description={stat.description}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Upload Section */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Add New Data</h2>
          <p className="text-muted-foreground">
            Upload health reports or enter metrics manually
          </p>
        </div>
        <UploadCard />
      </div>

      {/* Recent Activity Section */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Recent Activity</h2>
          <p className="text-muted-foreground">
            Your latest health data entries ({healthMetrics.length} total)
          </p>
        </div>
        
        {recentMetrics.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentMetrics.map((metric) => (
              <HealthMetricCard key={metric.id} metric={metric} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 rounded-lg border border-dashed">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No health data yet</h3>
            <p className="text-gray-500 mb-4">
              Start tracking your health by adding your first metric above
            </p>
          </div>
        )}
      </div>

      {/* All Metrics Management */}
      {healthMetrics.length > 0 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">All Health Data</h2>
            <p className="text-muted-foreground">
              Manage, search, and edit all your health metrics
            </p>
          </div>
          <HealthMetricsTable />
        </div>
      )}

      {/* Reports Management */}
      {uploadedReports.length > 0 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">Health Reports</h2>
            <p className="text-muted-foreground">
              View and manage your uploaded health documents
            </p>
          </div>
          <ReportsManagement />
        </div>
      )}
    </div>
  );
}
