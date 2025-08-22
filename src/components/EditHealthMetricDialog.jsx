import { useState, useEffect } from 'react';
import { Calendar, Heart, Droplet, TrendingUp, Scale, Activity } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useHealthData } from '@/contexts/HealthDataContext';
import { METRIC_TYPES, validateHealthMetric } from '@/utils/healthDataUtils';

export default function EditHealthMetricDialog({ metric, open, onOpenChange }) {
  const { updateHealthMetric } = useHealthData();
  
  const [formData, setFormData] = useState({
    type: '',
    date: '',
    systolic: '',
    diastolic: '',
    value: '',
    total: '',
    hdl: '',
    ldl: '',
    notes: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when metric changes
  useEffect(() => {
    if (metric) {
      setFormData({
        type: metric.type || '',
        date: metric.date ? metric.date.split('T')[0] : '',
        systolic: metric.systolic || '',
        diastolic: metric.diastolic || '',
        value: metric.value || '',
        total: metric.total || '',
        hdl: metric.hdl || '',
        ldl: metric.ldl || '',
        notes: metric.notes || ''
      });
    }
  }, [metric]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare metric data based on type
      let metricData = {
        id: metric.id,
        type: formData.type,
        date: formData.date,
        notes: formData.notes,
        createdAt: metric.createdAt // Preserve original creation date
      };

      // Add type-specific data
      switch (formData.type) {
        case METRIC_TYPES.BLOOD_PRESSURE:
          metricData = {
            ...metricData,
            systolic: parseInt(formData.systolic),
            diastolic: parseInt(formData.diastolic)
          };
          break;
        
        case METRIC_TYPES.BLOOD_SUGAR:
          metricData = {
            ...metricData,
            value: parseFloat(formData.value),
            unit: 'mg/dL'
          };
          break;
        
        case METRIC_TYPES.CHOLESTEROL:
          metricData = {
            ...metricData,
            total: parseInt(formData.total),
            hdl: formData.hdl ? parseInt(formData.hdl) : null,
            ldl: formData.ldl ? parseInt(formData.ldl) : null,
            unit: 'mg/dL'
          };
          break;
        
        case METRIC_TYPES.WEIGHT:
          metricData = {
            ...metricData,
            value: parseFloat(formData.value),
            unit: 'kg'
          };
          break;
        
        case METRIC_TYPES.HEART_RATE:
          metricData = {
            ...metricData,
            value: parseInt(formData.value),
            unit: 'bpm'
          };
          break;
      }

      // Validate the data
      const validation = validateHealthMetric(metricData);
      
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }

      // Update the metric
      updateHealthMetric(metricData);

      // Close dialog
      onOpenChange(false);

    } catch (error) {
      console.error('Error updating health metric:', error);
      setErrors({ submit: 'Failed to update health metric. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get display name for metric type
  const getMetricDisplayName = (type) => {
    switch (type) {
      case METRIC_TYPES.BLOOD_PRESSURE: return 'Blood Pressure';
      case METRIC_TYPES.BLOOD_SUGAR: return 'Blood Sugar';
      case METRIC_TYPES.CHOLESTEROL: return 'Cholesterol';
      case METRIC_TYPES.WEIGHT: return 'Weight';
      case METRIC_TYPES.HEART_RATE: return 'Heart Rate';
      default: return 'Health Metric';
    }
  };

  // Render form fields based on metric type
  const renderMetricFields = () => {
    switch (formData.type) {
      case METRIC_TYPES.BLOOD_PRESSURE:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-red-600">
              <Heart className="h-4 w-4" />
              <span className="font-medium">Blood Pressure</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="systolic">Systolic (mmHg)</Label>
                <Input
                  id="systolic"
                  type="number"
                  placeholder="120"
                  value={formData.systolic}
                  onChange={(e) => handleInputChange('systolic', e.target.value)}
                  className={errors.systolic ? 'border-red-500' : ''}
                />
                {errors.systolic && <p className="text-sm text-red-500">{errors.systolic}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="diastolic">Diastolic (mmHg)</Label>
                <Input
                  id="diastolic"
                  type="number"
                  placeholder="80"
                  value={formData.diastolic}
                  onChange={(e) => handleInputChange('diastolic', e.target.value)}
                  className={errors.diastolic ? 'border-red-500' : ''}
                />
                {errors.diastolic && <p className="text-sm text-red-500">{errors.diastolic}</p>}
              </div>
            </div>
          </div>
        );

      case METRIC_TYPES.BLOOD_SUGAR:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-600">
              <Droplet className="h-4 w-4" />
              <span className="font-medium">Blood Sugar</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bloodSugar">Blood Sugar (mg/dL)</Label>
              <Input
                id="bloodSugar"
                type="number"
                placeholder="95"
                value={formData.value}
                onChange={(e) => handleInputChange('value', e.target.value)}
                className={errors.value ? 'border-red-500' : ''}
              />
              {errors.value && <p className="text-sm text-red-500">{errors.value}</p>}
            </div>
          </div>
        );

      case METRIC_TYPES.CHOLESTEROL:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span className="font-medium">Cholesterol</span>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="totalChol">Total Cholesterol (mg/dL)</Label>
                <Input
                  id="totalChol"
                  type="number"
                  placeholder="180"
                  value={formData.total}
                  onChange={(e) => handleInputChange('total', e.target.value)}
                  className={errors.total ? 'border-red-500' : ''}
                />
                {errors.total && <p className="text-sm text-red-500">{errors.total}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hdl">HDL (mg/dL)</Label>
                  <Input
                    id="hdl"
                    type="number"
                    placeholder="50"
                    value={formData.hdl}
                    onChange={(e) => handleInputChange('hdl', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ldl">LDL (mg/dL)</Label>
                  <Input
                    id="ldl"
                    type="number"
                    placeholder="100"
                    value={formData.ldl}
                    onChange={(e) => handleInputChange('ldl', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case METRIC_TYPES.WEIGHT:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-purple-600">
              <Scale className="h-4 w-4" />
              <span className="font-medium">Weight</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="70.5"
                value={formData.value}
                onChange={(e) => handleInputChange('value', e.target.value)}
                className={errors.value ? 'border-red-500' : ''}
              />
              {errors.value && <p className="text-sm text-red-500">{errors.value}</p>}
            </div>
          </div>
        );

      case METRIC_TYPES.HEART_RATE:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-orange-600">
              <Activity className="h-4 w-4" />
              <span className="font-medium">Heart Rate</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
              <Input
                id="heartRate"
                type="number"
                placeholder="72"
                value={formData.value}
                onChange={(e) => handleInputChange('value', e.target.value)}
                className={errors.value ? 'border-red-500' : ''}
              />
              {errors.value && <p className="text-sm text-red-500">{errors.value}</p>}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit {getMetricDisplayName(formData.type)}</DialogTitle>
          <DialogDescription>
            Update your health metric information below.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className={`pl-10 ${errors.date ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
          </div>

          {/* Dynamic metric fields */}
          {formData.type && renderMetricFields()}

          {/* Notes field */}
          {formData.type && (
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                placeholder="Any additional notes..."
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update'}
            </Button>
          </div>
          
          {errors.submit && <p className="text-sm text-red-500">{errors.submit}</p>}
        </form>
      </DialogContent>
    </Dialog>
  );
}
