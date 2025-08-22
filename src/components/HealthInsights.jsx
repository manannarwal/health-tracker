import { TrendingUp, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useHealthData } from '@/contexts/HealthDataContext';

export default function HealthInsights() {
  const { healthMetrics, stats } = useHealthData();

  // Generate insights based on latest health data
  const generateInsights = () => {
    const insights = [];

    // BMI insights
    if (stats.currentBMI) {
      const bmi = stats.currentBMI;
      const category = stats.bmiCategory;
      
      if (category === 'Normal weight') {
        insights.push({
          type: 'success',
          icon: CheckCircle,
          title: 'BMI Status',
          message: `Your BMI of ${bmi.toFixed(1)} indicates a healthy weight range.`
        });
      } else if (category === 'Overweight') {
        insights.push({
          type: 'warning',
          icon: AlertCircle,
          title: 'BMI Status',
          message: `Your BMI of ${bmi.toFixed(1)} indicates overweight. Consider consulting with a healthcare provider.`
        });
      } else if (category === 'Underweight') {
        insights.push({
          type: 'warning',
          icon: AlertCircle,
          title: 'BMI Status',
          message: `Your BMI of ${bmi.toFixed(1)} indicates underweight. Consider consulting with a healthcare provider.`
        });
      } else if (category === 'Obese') {
        insights.push({
          type: 'alert',
          icon: AlertCircle,
          title: 'BMI Status',
          message: `Your BMI of ${bmi.toFixed(1)} indicates obesity. Please consult with a healthcare provider.`
        });
      }
    }

    // Blood pressure insights
    if (stats.latestBloodPressure) {
      const bp = stats.latestBloodPressure.split('/');
      const systolic = parseInt(bp[0]);
      const diastolic = parseInt(bp[1]);

      if (systolic >= 140 || diastolic >= 90) {
        insights.push({
          type: 'alert',
          icon: AlertCircle,
          title: 'Blood Pressure',
          message: `Your blood pressure (${stats.latestBloodPressure}) is elevated. Please consult your doctor.`
        });
      } else if (systolic >= 120 || diastolic >= 80) {
        insights.push({
          type: 'warning',
          icon: AlertCircle,
          title: 'Blood Pressure',
          message: `Your blood pressure (${stats.latestBloodPressure}) is in the elevated range.`
        });
      } else {
        insights.push({
          type: 'success',
          icon: CheckCircle,
          title: 'Blood Pressure',
          message: `Your blood pressure (${stats.latestBloodPressure}) is in the normal range.`
        });
      }
    }

    // Blood sugar insights
    const latestGlucose = healthMetrics.find(m => m.type === 'bloodSugar');
    if (latestGlucose) {
      const glucose = latestGlucose.value;
      
      if (glucose >= 126) {
        insights.push({
          type: 'alert',
          icon: AlertCircle,
          title: 'Blood Sugar',
          message: `Your glucose level (${glucose} mg/dL) is high. Please consult your doctor.`
        });
      } else if (glucose >= 100) {
        insights.push({
          type: 'warning',
          icon: AlertCircle,
          title: 'Blood Sugar',
          message: `Your glucose level (${glucose} mg/dL) is elevated.`
        });
      } else if (glucose >= 70) {
        insights.push({
          type: 'success',
          icon: CheckCircle,
          title: 'Blood Sugar',
          message: `Your glucose level (${glucose} mg/dL) is in the normal range.`
        });
      }
    }

    // Recent activity insight
    if (healthMetrics.length > 0) {
      const recentCount = healthMetrics.filter(m => {
        const metricDate = new Date(m.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return metricDate >= weekAgo;
      }).length;

      if (recentCount >= 3) {
        insights.push({
          type: 'success',
          icon: TrendingUp,
          title: 'Health Tracking',
          message: `Great job! You've logged ${recentCount} health measurements this week.`
        });
      } else if (recentCount === 0) {
        insights.push({
          type: 'info',
          icon: Info,
          title: 'Health Tracking',
          message: 'No recent measurements logged. Consider tracking your health metrics regularly.'
        });
      }
    }

    return insights;
  };

  const insights = generateInsights();

  const getInsightColor = (type) => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'alert': return 'text-red-600 bg-red-50 border-red-200';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Health Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.length > 0 ? (
          insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}
              >
                <div className="flex items-start gap-3">
                  <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">{insight.title}</h4>
                    <p className="text-sm mt-1">{insight.message}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Insights Available</h3>
            <p className="text-gray-600">
              Add some health measurements to get personalized insights about your health data.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}