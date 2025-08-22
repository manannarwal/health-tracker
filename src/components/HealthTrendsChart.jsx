import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format, parseISO, subDays, isWithinInterval } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useState } from 'react';
import { useHealthData } from '@/contexts/HealthDataContext';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

export default function HealthTrendsChart() {
  const { healthMetrics } = useHealthData();
  const [selectedMetric, setSelectedMetric] = useState('bloodPressure');
  const [timeRange, setTimeRange] = useState('30'); // days

  // Filter metrics by type and time range
  const getFilteredMetrics = (metricType, days) => {
    const endDate = new Date();
    const startDate = subDays(endDate, parseInt(days));
    
    return healthMetrics
      .filter(metric => 
        metric.type === metricType && 
        isWithinInterval(parseISO(metric.date), { start: startDate, end: endDate })
      )
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  // Get chart data for selected metric
  const getChartData = () => {
    const metrics = getFilteredMetrics(selectedMetric, timeRange);
    
    if (metrics.length === 0) {
      return null;
    }

    const labels = metrics.map(metric => format(parseISO(metric.date), 'MMM dd'));
    
    let datasets = [];

    switch (selectedMetric) {
      case 'bloodPressure':
        datasets = [
          {
            label: 'Systolic',
            data: metrics.map(m => m.systolic),
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.1,
          },
          {
            label: 'Diastolic',
            data: metrics.map(m => m.diastolic),
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.1,
          }
        ];
        break;
      
      case 'bloodSugar':
        datasets = [
          {
            label: 'Blood Sugar (mg/dL)',
            data: metrics.map(m => m.value),
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.1,
          }
        ];
        break;
      
      case 'cholesterol':
        datasets = [
          {
            label: 'Total Cholesterol',
            data: metrics.map(m => m.total),
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            tension: 0.1,
          }
        ];
        
        // Add HDL and LDL if available
        const hdlData = metrics.map(m => m.hdl).filter(Boolean);
        const ldlData = metrics.map(m => m.ldl).filter(Boolean);
        
        if (hdlData.length > 0) {
          datasets.push({
            label: 'HDL',
            data: metrics.map(m => m.hdl || null),
            borderColor: 'rgb(168, 85, 247)',
            backgroundColor: 'rgba(168, 85, 247, 0.1)',
            tension: 0.1,
            spanGaps: true,
          });
        }
        
        if (ldlData.length > 0) {
          datasets.push({
            label: 'LDL',
            data: metrics.map(m => m.ldl || null),
            borderColor: 'rgb(249, 115, 22)',
            backgroundColor: 'rgba(249, 115, 22, 0.1)',
            tension: 0.1,
            spanGaps: true,
          });
        }
        break;
      
      case 'weight':
        datasets = [
          {
            label: 'Weight (kg)',
            data: metrics.map(m => m.value),
            borderColor: 'rgb(168, 85, 247)',
            backgroundColor: 'rgba(168, 85, 247, 0.1)',
            tension: 0.1,
          }
        ];
        break;
      
      case 'heartRate':
        datasets = [
          {
            label: 'Heart Rate (bpm)',
            data: metrics.map(m => m.value),
            borderColor: 'rgb(249, 115, 22)',
            backgroundColor: 'rgba(249, 115, 22, 0.1)',
            tension: 0.1,
          }
        ];
        break;
    }

    return { labels, datasets };
  };

  // Calculate trend
  const getTrend = () => {
    const metrics = getFilteredMetrics(selectedMetric, timeRange);
    
    if (metrics.length < 2) return { trend: 'neutral', change: 0, icon: Minus };
    
    let firstValue, lastValue;
    
    switch (selectedMetric) {
      case 'bloodPressure':
        firstValue = metrics[0].systolic;
        lastValue = metrics[metrics.length - 1].systolic;
        break;
      default:
        firstValue = metrics[0].value || metrics[0].total;
        lastValue = metrics[metrics.length - 1].value || metrics[metrics.length - 1].total;
    }
    
    const change = lastValue - firstValue;
    const percentChange = ((change / firstValue) * 100).toFixed(1);
    
    if (change > 0) {
      return { 
        trend: 'up', 
        change: percentChange, 
        icon: TrendingUp,
        color: selectedMetric === 'weight' ? 'text-red-600' : 'text-green-600'
      };
    } else if (change < 0) {
      return { 
        trend: 'down', 
        change: Math.abs(percentChange), 
        icon: TrendingDown,
        color: selectedMetric === 'weight' ? 'text-green-600' : 'text-red-600'
      };
    } else {
      return { trend: 'neutral', change: 0, icon: Minus, color: 'text-gray-600' };
    }
  };

  const chartData = getChartData();
  const trendData = getTrend();
  const TrendIcon = trendData.icon;

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  const getMetricDisplayName = (type) => {
    switch (type) {
      case 'bloodPressure': return 'Blood Pressure';
      case 'bloodSugar': return 'Blood Sugar';
      case 'cholesterol': return 'Cholesterol';
      case 'weight': return 'Weight';
      case 'heartRate': return 'Heart Rate';
      default: return 'Health Metric';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Health Trends</CardTitle>
            <CardDescription>
              Visualize your health metrics over time
            </CardDescription>
          </div>
          
          <div className="flex gap-2">
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bloodPressure">Blood Pressure</SelectItem>
                <SelectItem value="bloodSugar">Blood Sugar</SelectItem>
                <SelectItem value="cholesterol">Cholesterol</SelectItem>
                <SelectItem value="weight">Weight</SelectItem>
                <SelectItem value="heartRate">Heart Rate</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
                <SelectItem value="365">1 year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Trend Indicator */}
        {trendData.change !== 0 && (
          <div className={`flex items-center gap-2 text-sm ${trendData.color}`}>
            <TrendIcon className="h-4 w-4" />
            <span>
              {trendData.change}% {trendData.trend === 'up' ? 'increase' : 'decrease'} 
              over last {timeRange} days
            </span>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {chartData ? (
          <div className="h-[300px]">
            <Line data={chartData} options={options} />
          </div>
        ) : (
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No data available
            </h3>
            <p className="text-gray-500">
              Add some {getMetricDisplayName(selectedMetric).toLowerCase()} readings to see trends
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
