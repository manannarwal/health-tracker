import { useState, useMemo } from 'react';
import { Calendar, Filter, TrendingUp, Search, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHealthData } from '@/contexts/HealthDataContext';
import { formatMetricValue, formatDate, METRIC_TYPES } from '@/utils/healthDataUtils';

// Reference ranges for health status
const REFERENCE_RANGES = {
  [METRIC_TYPES.GLUCOSE]: { min: 70, max: 100, unit: 'mg/dL' },
  [METRIC_TYPES.FASTING_GLUCOSE]: { min: 70, max: 100, unit: 'mg/dL' },
  [METRIC_TYPES.RANDOM_GLUCOSE]: { min: 70, max: 140, unit: 'mg/dL' },
  [METRIC_TYPES.HBA1C]: { min: 4.0, max: 5.6, unit: '%' },
  [METRIC_TYPES.TOTAL_CHOLESTEROL]: { min: 0, max: 200, unit: 'mg/dL' },
  [METRIC_TYPES.TRIGLYCERIDES]: { min: 0, max: 150, unit: 'mg/dL' },
  [METRIC_TYPES.HDL_CHOLESTEROL]: { min: 40, max: 999, unit: 'mg/dL', higher: true },
  [METRIC_TYPES.LDL_CHOLESTEROL]: { min: 0, max: 100, unit: 'mg/dL' },
  [METRIC_TYPES.TSH]: { min: 0.27, max: 4.2, unit: 'mIU/L' },
  [METRIC_TYPES.VITAMIN_D]: { min: 30, max: 100, unit: 'ng/mL' },
  [METRIC_TYPES.HEMOGLOBIN]: { min: 12.0, max: 15.5, unit: 'g/dL' },
  [METRIC_TYPES.BLOOD_PRESSURE]: { systolic: { min: 90, max: 120 }, diastolic: { min: 60, max: 80 } }
};

const getHealthStatus = (metric, type) => {
  const range = REFERENCE_RANGES[type];
  if (!range || !metric.value) return { status: 'Unknown', color: 'bg-muted text-muted-foreground' };

  let isNormal = false;
  
  if (type === METRIC_TYPES.BLOOD_PRESSURE) {
    const systolic = parseFloat(metric.systolic);
    const diastolic = parseFloat(metric.diastolic);
    isNormal = systolic >= range.systolic.min && systolic <= range.systolic.max && 
               diastolic >= range.diastolic.min && diastolic <= range.diastolic.max;
  } else {
    const value = parseFloat(metric.value);
    if (range.higher) {
      isNormal = value >= range.min;
    } else {
      isNormal = value >= range.min && value <= range.max;
    }
  }

  if (isNormal) return { status: 'Normal', color: 'bg-green-100 text-green-800' };
  return { status: 'Abnormal', color: 'bg-red-100 text-red-800' };
};

const getDisplayName = (type) => {
  const names = {
    [METRIC_TYPES.GLUCOSE]: 'Glucose',
    [METRIC_TYPES.FASTING_GLUCOSE]: 'Fasting Glucose',
    [METRIC_TYPES.RANDOM_GLUCOSE]: 'Random Glucose',
    [METRIC_TYPES.HBA1C]: 'HbA1c',
    [METRIC_TYPES.TOTAL_CHOLESTEROL]: 'Total Cholesterol',
    [METRIC_TYPES.TRIGLYCERIDES]: 'Triglycerides',
    [METRIC_TYPES.HDL_CHOLESTEROL]: 'HDL Cholesterol',
    [METRIC_TYPES.LDL_CHOLESTEROL]: 'LDL Cholesterol',
    [METRIC_TYPES.VLDL_CHOLESTEROL]: 'VLDL Cholesterol',
    [METRIC_TYPES.TSH]: 'TSH',
    [METRIC_TYPES.T3]: 'T3',
    [METRIC_TYPES.T4]: 'T4',
    [METRIC_TYPES.FREE_T4]: 'Free T4',
    [METRIC_TYPES.VITAMIN_D]: 'Vitamin D',
    [METRIC_TYPES.VITAMIN_B12]: 'Vitamin B12',
    [METRIC_TYPES.BLOOD_PRESSURE]: 'Blood Pressure',
    [METRIC_TYPES.BLOOD_SUGAR]: 'Blood Sugar',
    [METRIC_TYPES.CHOLESTEROL]: 'Cholesterol',
    [METRIC_TYPES.WEIGHT]: 'Weight',
    [METRIC_TYPES.HEIGHT]: 'Height',
    [METRIC_TYPES.HEART_RATE]: 'Heart Rate',
    [METRIC_TYPES.TEMPERATURE]: 'Temperature',
    [METRIC_TYPES.HEMOGLOBIN]: 'Hemoglobin',
    [METRIC_TYPES.WBC]: 'White Blood Cells',
    [METRIC_TYPES.PLATELETS]: 'Platelets',
    [METRIC_TYPES.CREATININE]: 'Creatinine',
    [METRIC_TYPES.UREA]: 'Urea'
  };
  return names[type] || type.charAt(0).toUpperCase() + type.slice(1);
};

export default function ComprehensiveHealthData() {
  const { healthMetrics } = useHealthData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('latest');
  const [expandedCategories, setExpandedCategories] = useState(new Set(['recent']));

  // Group metrics by category
  const categorizedMetrics = useMemo(() => {
    let filteredMetrics = healthMetrics;

    // Apply search filter
    if (searchTerm) {
      filteredMetrics = healthMetrics.filter(metric => 
        getDisplayName(metric.type).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply time filter
    const now = new Date();
    switch (filterPeriod) {
      case 'latest':
        // Get latest value for each metric type
        const latestMetrics = {};
        filteredMetrics.forEach(metric => {
          const existing = latestMetrics[metric.type];
          if (!existing || new Date(metric.date) > new Date(existing.date)) {
            latestMetrics[metric.type] = metric;
          }
        });
        filteredMetrics = Object.values(latestMetrics);
        break;
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filteredMetrics = filteredMetrics.filter(m => new Date(m.date) >= weekAgo);
        break;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filteredMetrics = filteredMetrics.filter(m => new Date(m.date) >= monthAgo);
        break;
      case 'all':
        // Keep all filtered metrics
        break;
    }

    // Sort by date (newest first)
    filteredMetrics.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Group by categories
    const categories = {
      glucose: {
        title: 'Glucose & Diabetes',
        metrics: filteredMetrics.filter(m => 
          [METRIC_TYPES.GLUCOSE, METRIC_TYPES.FASTING_GLUCOSE, METRIC_TYPES.RANDOM_GLUCOSE, 
           METRIC_TYPES.HBA1C, METRIC_TYPES.BLOOD_SUGAR].includes(m.type)
        )
      },
      lipids: {
        title: 'Lipid Profile',
        metrics: filteredMetrics.filter(m => 
          [METRIC_TYPES.TOTAL_CHOLESTEROL, METRIC_TYPES.TRIGLYCERIDES, METRIC_TYPES.HDL_CHOLESTEROL,
           METRIC_TYPES.LDL_CHOLESTEROL, METRIC_TYPES.VLDL_CHOLESTEROL, METRIC_TYPES.CHOLESTEROL].includes(m.type)
        )
      },
      thyroid: {
        title: 'Thyroid Function',
        metrics: filteredMetrics.filter(m => 
          [METRIC_TYPES.TSH, METRIC_TYPES.T3, METRIC_TYPES.T4, METRIC_TYPES.FREE_T4].includes(m.type)
        )
      },
      vitamins: {
        title: 'Vitamins & Minerals',
        metrics: filteredMetrics.filter(m => 
          [METRIC_TYPES.VITAMIN_D, METRIC_TYPES.VITAMIN_B12].includes(m.type)
        )
      },
      vitals: {
        title: 'Vital Signs',
        metrics: filteredMetrics.filter(m => 
          [METRIC_TYPES.BLOOD_PRESSURE, METRIC_TYPES.HEART_RATE, METRIC_TYPES.TEMPERATURE,
           METRIC_TYPES.WEIGHT, METRIC_TYPES.HEIGHT].includes(m.type)
        )
      },
      blood: {
        title: 'Blood Work',
        metrics: filteredMetrics.filter(m => 
          [METRIC_TYPES.HEMOGLOBIN, METRIC_TYPES.WBC, METRIC_TYPES.PLATELETS].includes(m.type)
        )
      },
      kidney: {
        title: 'Kidney Function',
        metrics: filteredMetrics.filter(m => 
          [METRIC_TYPES.CREATININE, METRIC_TYPES.UREA].includes(m.type)
        )
      }
    };

    return categories;
  }, [healthMetrics, searchTerm, filterPeriod]);

  const toggleCategory = (categoryKey) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryKey)) {
      newExpanded.delete(categoryKey);
    } else {
      newExpanded.add(categoryKey);
    }
    setExpandedCategories(newExpanded);
  };

  const totalMetrics = Object.values(categorizedMetrics).reduce((sum, cat) => sum + cat.metrics.length, 0);

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                Health Data Overview
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {totalMetrics} health parameters found
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search parameters..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Latest Values</SelectItem>
                    <SelectItem value="week">Last Week</SelectItem>
                    <SelectItem value="month">Last Month</SelectItem>
                    <SelectItem value="all">All Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Health Data Categories */}
      {totalMetrics === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No health data found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try adjusting your search criteria.' : 'Upload a health report or add metrics manually to get started.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {Object.entries(categorizedMetrics).map(([categoryKey, category]) => {
            if (category.metrics.length === 0) return null;
            
            const isExpanded = expandedCategories.has(categoryKey);
            
            return (
              <Card key={categoryKey} className="overflow-hidden">
                <CardHeader 
                  className="cursor-pointer hover:bg-muted/50 pb-3"
                  onClick={() => toggleCategory(categoryKey)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                      <Badge variant="outline">{category.metrics.length}</Badge>
                    </div>
                    {isExpanded ? 
                      <ChevronUp className="h-4 w-4 text-muted-foreground" /> : 
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    }
                  </div>
                </CardHeader>
                
                {isExpanded && (
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.metrics.map((metric, index) => {
                        const healthStatus = getHealthStatus(metric, metric.type);
                        const displayValue = formatMetricValue(metric);
                        
                        return (
                          <div key={index} className="p-4 border rounded-lg transition-all duration-200 hover:shadow-lg hover:bg-muted/50 hover:border-primary/20 cursor-pointer">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-sm">
                                {getDisplayName(metric.type)}
                              </h4>
                              <Badge className={healthStatus.color}>
                                {healthStatus.status}
                              </Badge>
                            </div>
                            
                            <div className="text-2xl font-bold text-indigo-600 mb-1">
                              {displayValue}
                            </div>
                            
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(metric.date)}
                            </div>
                            
                            {metric.notes && (
                              <div className="mt-2 text-xs text-muted-foreground italic">
                                {metric.notes}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
