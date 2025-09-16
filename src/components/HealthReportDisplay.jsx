import { useState } from 'react';
import { Edit2, Save, X, FileText, TrendingUp, Activity, Heart, Droplet, Thermometer, Eye, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatMetricValue, formatDate, METRIC_TYPES } from '@/utils/healthDataUtils';
import { useHealthData } from '@/contexts/HealthDataContext';

// Reference ranges for comprehensive health metrics
const REFERENCE_RANGES = {
  // Glucose & Diabetes
  [METRIC_TYPES.GLUCOSE]: { min: 70, max: 100, unit: 'mg/dL', fasting: true },
  [METRIC_TYPES.FASTING_GLUCOSE]: { min: 70, max: 100, unit: 'mg/dL' },
  [METRIC_TYPES.RANDOM_GLUCOSE]: { min: 70, max: 140, unit: 'mg/dL' },
  [METRIC_TYPES.HBA1C]: { min: 4.0, max: 5.6, unit: '%' },
  
  // Lipid Profile
  [METRIC_TYPES.TOTAL_CHOLESTEROL]: { min: 0, max: 200, unit: 'mg/dL' },
  [METRIC_TYPES.TRIGLYCERIDES]: { min: 0, max: 150, unit: 'mg/dL' },
  [METRIC_TYPES.HDL_CHOLESTEROL]: { min: 40, max: 999, unit: 'mg/dL', higher: true },
  [METRIC_TYPES.LDL_CHOLESTEROL]: { min: 0, max: 100, unit: 'mg/dL' },
  [METRIC_TYPES.VLDL_CHOLESTEROL]: { min: 5, max: 30, unit: 'mg/dL' },
  
  // Thyroid
  [METRIC_TYPES.TSH]: { min: 0.27, max: 4.2, unit: 'mIU/L' },
  [METRIC_TYPES.T3]: { min: 2.3, max: 4.2, unit: 'pg/mL' },
  [METRIC_TYPES.T4]: { min: 4.5, max: 12.0, unit: 'μg/dL' },
  
  // Vitamins
  [METRIC_TYPES.VITAMIN_D]: { min: 30, max: 100, unit: 'ng/mL' },
  [METRIC_TYPES.VITAMIN_B12]: { min: 300, max: 900, unit: 'pg/mL' },
  
  // CBC
  [METRIC_TYPES.HEMOGLOBIN]: { min: 12.0, max: 15.5, unit: 'g/dL' },
  [METRIC_TYPES.WBC]: { min: 4000, max: 11000, unit: '/μL' },
  [METRIC_TYPES.PLATELETS]: { min: 150000, max: 450000, unit: '/μL' },
  
  // Kidney function
  [METRIC_TYPES.CREATININE]: { min: 0.6, max: 1.3, unit: 'mg/dL' },
  [METRIC_TYPES.UREA]: { min: 7, max: 20, unit: 'mg/dL' },
};

const getStatusColor = (value, type) => {
  const range = REFERENCE_RANGES[type];
  if (!range || !value) return 'bg-gray-100 text-gray-800';
  
  const numValue = parseFloat(value);
  
  if (range.higher) {
    // Higher is better (like HDL)
    if (numValue >= range.min) return 'bg-green-100 text-green-800';
    return 'bg-yellow-100 text-yellow-800';
  } else {
    // Within range is better
    if (numValue >= range.min && numValue <= range.max) return 'bg-green-100 text-green-800';
    if (numValue < range.min) return 'bg-blue-100 text-blue-800';
    return 'bg-red-100 text-red-800';
  }
};

const getStatusText = (value, type) => {
  const range = REFERENCE_RANGES[type];
  if (!range || !value) return 'Unknown';
  
  const numValue = parseFloat(value);
  
  if (range.higher) {
    return numValue >= range.min ? 'Normal' : 'Low';
  } else {
    if (numValue >= range.min && numValue <= range.max) return 'Normal';
    if (numValue < range.min) return 'Low';
    return 'High';
  }
};

export default function HealthReportDisplay({ report, onEdit }) {
  const [editMode, setEditMode] = useState(false);
  const [editedMetrics, setEditedMetrics] = useState({});
  const [expandedSections, setExpandedSections] = useState(new Set(['overview']));
  const { updateHealthMetric } = useHealthData();

  // Group metrics by category for better organization
  const groupedMetrics = {
    overview: report.extractedData?.filter(m => 
      [METRIC_TYPES.GLUCOSE, METRIC_TYPES.HBA1C, METRIC_TYPES.TOTAL_CHOLESTEROL, METRIC_TYPES.TSH].includes(m.type)
    ) || [],
    
    glucose: report.extractedData?.filter(m => 
      [METRIC_TYPES.GLUCOSE, METRIC_TYPES.FASTING_GLUCOSE, METRIC_TYPES.RANDOM_GLUCOSE, METRIC_TYPES.HBA1C].includes(m.type)
    ) || [],
    
    lipidProfile: report.extractedData?.filter(m => 
      [METRIC_TYPES.TOTAL_CHOLESTEROL, METRIC_TYPES.TRIGLYCERIDES, METRIC_TYPES.HDL_CHOLESTEROL, 
       METRIC_TYPES.LDL_CHOLESTEROL, METRIC_TYPES.VLDL_CHOLESTEROL].includes(m.type)
    ) || [],
    
    thyroid: report.extractedData?.filter(m => 
      [METRIC_TYPES.TSH, METRIC_TYPES.T3, METRIC_TYPES.T4, METRIC_TYPES.FREE_T3, METRIC_TYPES.FREE_T4].includes(m.type)
    ) || [],
    
    vitamins: report.extractedData?.filter(m => 
      [METRIC_TYPES.VITAMIN_D, METRIC_TYPES.VITAMIN_B12].includes(m.type)
    ) || [],
    
    cbc: report.extractedData?.filter(m => 
      [METRIC_TYPES.HEMOGLOBIN, METRIC_TYPES.WBC, METRIC_TYPES.PLATELETS, METRIC_TYPES.RBC].includes(m.type)
    ) || [],
    
    kidney: report.extractedData?.filter(m => 
      [METRIC_TYPES.CREATININE, METRIC_TYPES.UREA, METRIC_TYPES.BUN].includes(m.type)
    ) || []
  };

  const handleSave = async () => {
    // Update all edited metrics
    for (const [id, newValue] of Object.entries(editedMetrics)) {
      const metric = report.extractedData.find(m => m.id === id);
      if (metric) {
        await updateHealthMetric(id, { ...metric, value: newValue });
      }
    }
    
    setEditMode(false);
    setEditedMetrics({});
    if (onEdit) onEdit();
  };

  const toggleSection = (section) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const MetricRow = ({ metric, showReference = true }) => {
    const isEditing = editMode && editedMetrics.hasOwnProperty(metric.id);
    const currentValue = isEditing ? editedMetrics[metric.id] : metric.value;
    const range = REFERENCE_RANGES[metric.type];

    return (
      <div className="grid grid-cols-12 gap-4 py-3 border-b border-gray-100 hover:bg-gray-50">
        <div className="col-span-4 font-medium text-gray-900">
          {getMetricDisplayName(metric.type)}
        </div>
        
        <div className="col-span-3">
          {editMode ? (
            <Input
              type="number"
              step="0.1"
              value={currentValue || ''}
              onChange={(e) => setEditedMetrics(prev => ({
                ...prev,
                [metric.id]: e.target.value
              }))}
              className="h-8"
            />
          ) : (
            <span className="text-lg font-semibold">{currentValue || 'N/A'}</span>
          )}
          {range && <span className="text-sm text-gray-500 ml-1">{range.unit}</span>}
        </div>
        
        <div className="col-span-2">
          <Badge className={getStatusColor(currentValue, metric.type)}>
            {getStatusText(currentValue, metric.type)}
          </Badge>
        </div>
        
        {showReference && range && (
          <div className="col-span-3 text-sm text-gray-600">
            {range.higher ? `>${range.min}` : `${range.min}-${range.max}`} {range.unit}
            {range.fasting && <span className="text-xs text-blue-600 ml-1">(Fasting)</span>}
          </div>
        )}
      </div>
    );
  };

  const SectionCard = ({ title, icon: Icon, metrics, sectionKey }) => {
    if (!metrics.length) return null;
    const isExpanded = expandedSections.has(sectionKey);
    
    return (
      <Card className="mb-6">
        <CardHeader 
          className="cursor-pointer hover:bg-gray-50" 
          onClick={() => toggleSection(sectionKey)}
        >
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-indigo-600" />
              {title}
              <Badge variant="outline" className="ml-2">{metrics.length}</Badge>
            </div>
            <Eye className={`h-4 w-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </CardTitle>
        </CardHeader>
        
        {isExpanded && (
          <CardContent>
            <div className="grid grid-cols-12 gap-4 pb-2 text-sm font-medium text-gray-600 border-b-2 border-gray-200">
              <div className="col-span-4">Parameter</div>
              <div className="col-span-3">Value</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-3">Reference Range</div>
            </div>
            
            {metrics.map((metric, index) => (
              <MetricRow key={index} metric={metric} />
            ))}
          </CardContent>
        )}
      </Card>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      {/* Report Header */}
      <div className="mb-8 bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg border border-indigo-200">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <FileText className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">Health Report Analysis</h1>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(report.uploadDate)}
              </div>
              <div>File: {report.fileName}</div>
              <div>Parameters: {report.extractedData?.length || 0}</div>
            </div>
          </div>
          
          <div className="flex gap-2">
            {editMode ? (
              <>
                <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-1" />
                  Save Changes
                </Button>
                <Button onClick={() => {setEditMode(false); setEditedMetrics({});}} size="sm" variant="outline">
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setEditMode(true)} size="sm" variant="outline">
                <Edit2 className="h-4 w-4 mr-1" />
                Edit Values
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Report Sections */}
      <div className="space-y-6">
        <SectionCard 
          title="Key Health Indicators" 
          icon={TrendingUp} 
          metrics={groupedMetrics.overview} 
          sectionKey="overview" 
        />
        
        <SectionCard 
          title="Glucose & Diabetes Profile" 
          icon={Droplet} 
          metrics={groupedMetrics.glucose} 
          sectionKey="glucose" 
        />
        
        <SectionCard 
          title="Lipid Profile" 
          icon={Heart} 
          metrics={groupedMetrics.lipidProfile} 
          sectionKey="lipidProfile" 
        />
        
        <SectionCard 
          title="Thyroid Function" 
          icon={Activity} 
          metrics={groupedMetrics.thyroid} 
          sectionKey="thyroid" 
        />
        
        <SectionCard 
          title="Vitamins & Minerals" 
          icon={Thermometer} 
          metrics={groupedMetrics.vitamins} 
          sectionKey="vitamins" 
        />
      </div>
    </div>
  );
}

// Helper function to get display names for metrics
function getMetricDisplayName(type) {
  const displayNames = {
    [METRIC_TYPES.GLUCOSE]: 'Glucose',
    [METRIC_TYPES.FASTING_GLUCOSE]: 'Fasting Glucose',
    [METRIC_TYPES.RANDOM_GLUCOSE]: 'Random Glucose',
    [METRIC_TYPES.HBA1C]: 'HbA1c (Glycosylated Hemoglobin)',
    [METRIC_TYPES.TOTAL_CHOLESTEROL]: 'Total Cholesterol',
    [METRIC_TYPES.TRIGLYCERIDES]: 'Triglycerides',
    [METRIC_TYPES.HDL_CHOLESTEROL]: 'HDL Cholesterol',
    [METRIC_TYPES.LDL_CHOLESTEROL]: 'LDL Cholesterol',
    [METRIC_TYPES.VLDL_CHOLESTEROL]: 'VLDL Cholesterol',
    [METRIC_TYPES.TSH]: 'TSH (Thyroid Stimulating Hormone)',
    [METRIC_TYPES.T3]: 'T3',
    [METRIC_TYPES.T4]: 'T4',
    [METRIC_TYPES.FREE_T3]: 'Free T3',
    [METRIC_TYPES.FREE_T4]: 'Free T4',
    [METRIC_TYPES.VITAMIN_D]: 'Vitamin D, 25-Hydroxy',
    [METRIC_TYPES.VITAMIN_B12]: 'Vitamin B12',
    [METRIC_TYPES.HEMOGLOBIN]: 'Hemoglobin',
    [METRIC_TYPES.WBC]: 'White Blood Cells',
    [METRIC_TYPES.PLATELETS]: 'Platelets',
    [METRIC_TYPES.CREATININE]: 'Creatinine',
    [METRIC_TYPES.UREA]: 'Urea',
  };
  
  return displayNames[type] || type;
}
