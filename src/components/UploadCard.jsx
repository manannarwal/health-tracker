import { useState } from 'react';
import { Upload, Plus, Calendar, Heart, Droplet, TrendingUp, Scale, Activity, Thermometer, Zap, Users, Beaker } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHealthData } from '@/contexts/HealthDataContext';
import { METRIC_TYPES, validateHealthMetric } from '@/utils/healthDataUtils';
import FileUploadComponent from './FileUploadComponent';

export default function UploadCard() {
  const { addHealthMetric, loading } = useHealthData();
  
  // Form state
  const [formData, setFormData] = useState({
    type: "",
    date: new Date().toISOString().split("T")[0], // Today's date
    systolic: "",
    diastolic: "",
    value: "",
    total: "",
    hdl: "",
    ldl: "",
    notes: ""
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare metric data based on type
      let metricData = {
        type: formData.type,
        date: formData.date,
        notes: formData.notes
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
            unit: "mg/dL"
          };
          break;
        
        case METRIC_TYPES.CHOLESTEROL:
          metricData = {
            ...metricData,
            total: parseInt(formData.total),
            hdl: formData.hdl ? parseInt(formData.hdl) : null,
            ldl: formData.ldl ? parseInt(formData.ldl) : null,
            unit: "mg/dL"
          };
          break;
        
        case METRIC_TYPES.WEIGHT:
          metricData = {
            ...metricData,
            value: parseFloat(formData.value),
            unit: "kg"
          };
          break;
        
        case METRIC_TYPES.HEART_RATE:
          metricData = {
            ...metricData,
            value: parseInt(formData.value),
            unit: "bpm"
          };
          break;
        
        case METRIC_TYPES.HEIGHT:
          metricData = {
            ...metricData,
            value: parseFloat(formData.value),
            unit: "cm"
          };
          break;
        
        case METRIC_TYPES.TEMPERATURE:
          metricData = {
            ...metricData,
            value: parseFloat(formData.value),
            unit: "°C"
          };
          break;
        
        case METRIC_TYPES.HEMOGLOBIN:
          metricData = {
            ...metricData,
            value: parseFloat(formData.value),
            unit: "g/dL"
          };
          break;
        
        case METRIC_TYPES.WBC:
          metricData = {
            ...metricData,
            value: parseInt(formData.value),
            unit: "/μL"
          };
          break;
        
        case METRIC_TYPES.PLATELETS:
          metricData = {
            ...metricData,
            value: parseInt(formData.value),
            unit: "/μL"
          };
          break;
        
        case METRIC_TYPES.CREATININE:
          metricData = {
            ...metricData,
            value: parseFloat(formData.value),
            unit: "mg/dL"
          };
          break;
        
        case METRIC_TYPES.UREA:
          metricData = {
            ...metricData,
            value: parseFloat(formData.value),
            unit: "mg/dL"
          };
          break;

        // Comprehensive new metrics
        case METRIC_TYPES.GLUCOSE:
        case METRIC_TYPES.FASTING_GLUCOSE:
        case METRIC_TYPES.RANDOM_GLUCOSE:
          metricData = {
            ...metricData,
            value: parseFloat(formData.value),
            unit: "mg/dL"
          };
          break;

        case METRIC_TYPES.HBA1C:
          metricData = {
            ...metricData,
            value: parseFloat(formData.value),
            unit: "%"
          };
          break;

        case METRIC_TYPES.TOTAL_CHOLESTEROL:
        case METRIC_TYPES.HDL_CHOLESTEROL:
        case METRIC_TYPES.LDL_CHOLESTEROL:
        case METRIC_TYPES.VLDL_CHOLESTEROL:
          metricData = {
            ...metricData,
            value: parseFloat(formData.value),
            unit: "mg/dL"
          };
          break;

        case METRIC_TYPES.TRIGLYCERIDES:
          metricData = {
            ...metricData,
            value: parseFloat(formData.value),
            unit: "mg/dL"
          };
          break;

        case METRIC_TYPES.TSH:
          metricData = {
            ...metricData,
            value: parseFloat(formData.value),
            unit: "mIU/L"
          };
          break;

        case METRIC_TYPES.T3:
        case METRIC_TYPES.FREE_T3:
          metricData = {
            ...metricData,
            value: parseFloat(formData.value),
            unit: "ng/mL"
          };
          break;

        case METRIC_TYPES.T4:
        case METRIC_TYPES.FREE_T4:
          metricData = {
            ...metricData,
            value: parseFloat(formData.value),
            unit: "μg/dL"
          };
          break;

        case METRIC_TYPES.VITAMIN_D:
          metricData = {
            ...metricData,
            value: parseFloat(formData.value),
            unit: "ng/mL"
          };
          break;

        case METRIC_TYPES.VITAMIN_B12:
          metricData = {
            ...metricData,
            value: parseFloat(formData.value),
            unit: "pg/mL"
          };
          break;
      }

      // Validate the data
      const validation = validateHealthMetric(metricData);
      
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }

      // Add the metric
      addHealthMetric(metricData);

      // Reset form
      setFormData({
        type: "",
        date: new Date().toISOString().split("T")[0],
        systolic: "",
        diastolic: "",
        value: "",
        total: "",
        hdl: "",
        ldl: "",
        notes: ""
      });

      // Show success (you can add a toast notification here later)
      console.log("Health metric added successfully!");

    } catch (error) {
      console.error("Error adding health metric:", error);
      setErrors({ submit: "Failed to add health metric. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get icon for metric type
  const getMetricIcon = (type) => {
    switch (type) {
      case METRIC_TYPES.BLOOD_PRESSURE: return Heart;
      case METRIC_TYPES.BLOOD_SUGAR: return Droplet;
      case METRIC_TYPES.CHOLESTEROL: return TrendingUp;
      case METRIC_TYPES.WEIGHT: return Scale;
      case METRIC_TYPES.HEART_RATE: return Activity;
      default: return Plus;
    }
  };

  // Render form fields based on selected metric type
  const renderMetricFields = () => {
    const IconComponent = getMetricIcon(formData.type);
    
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
                  onChange={(e) => handleInputChange("systolic", e.target.value)}
                  className={errors.systolic ? "border-red-500" : ""}
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
                  onChange={(e) => handleInputChange("diastolic", e.target.value)}
                  className={errors.diastolic ? "border-red-500" : ""}
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
                onChange={(e) => handleInputChange("value", e.target.value)}
                className={errors.value ? "border-red-500" : ""}
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
                  onChange={(e) => handleInputChange("total", e.target.value)}
                  className={errors.total ? "border-red-500" : ""}
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
                    onChange={(e) => handleInputChange("hdl", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ldl">LDL (mg/dL)</Label>
                  <Input
                    id="ldl"
                    type="number"
                    placeholder="100"
                    value={formData.ldl}
                    onChange={(e) => handleInputChange("ldl", e.target.value)}
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
                onChange={(e) => handleInputChange("value", e.target.value)}
                className={errors.value ? "border-red-500" : ""}
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
                onChange={(e) => handleInputChange("value", e.target.value)}
                className={errors.value ? "border-red-500" : ""}
              />
              {errors.value && <p className="text-sm text-red-500">{errors.value}</p>}
            </div>
          </div>
        );

      case METRIC_TYPES.HEIGHT:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-indigo-600">
              <TrendingUp className="h-4 w-4" />
              <span className="font-medium">Height</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                step="0.1"
                placeholder="170"
                value={formData.value}
                onChange={(e) => handleInputChange("value", e.target.value)}
                className={errors.value ? "border-red-500" : ""}
              />
              {errors.value && <p className="text-sm text-red-500">{errors.value}</p>}
            </div>
          </div>
        );

      case METRIC_TYPES.TEMPERATURE:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-red-400">
              <Thermometer className="h-4 w-4" />
              <span className="font-medium">Temperature</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature (°C)</Label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                placeholder="36.5"
                value={formData.value}
                onChange={(e) => handleInputChange("value", e.target.value)}
                className={errors.value ? "border-red-500" : ""}
              />
              {errors.value && <p className="text-sm text-red-500">{errors.value}</p>}
            </div>
          </div>
        );

      case METRIC_TYPES.HEMOGLOBIN:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-red-600">
              <Droplet className="h-4 w-4" />
              <span className="font-medium">Hemoglobin</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hemoglobin">Hemoglobin (g/dL)</Label>
              <Input
                id="hemoglobin"
                type="number"
                step="0.1"
                placeholder="14.5"
                value={formData.value}
                onChange={(e) => handleInputChange("value", e.target.value)}
                className={errors.value ? "border-red-500" : ""}
              />
              {errors.value && <p className="text-sm text-red-500">{errors.value}</p>}
            </div>
          </div>
        );

      case METRIC_TYPES.WBC:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-600">
              <Users className="h-4 w-4" />
              <span className="font-medium">White Blood Cells</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="wbc">WBC Count (/μL)</Label>
              <Input
                id="wbc"
                type="number"
                placeholder="7000"
                value={formData.value}
                onChange={(e) => handleInputChange("value", e.target.value)}
                className={errors.value ? "border-red-500" : ""}
              />
              {errors.value && <p className="text-sm text-red-500">{errors.value}</p>}
            </div>
          </div>
        );

      case METRIC_TYPES.PLATELETS:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-yellow-600">
              <Zap className="h-4 w-4" />
              <span className="font-medium">Platelets</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="platelets">Platelet Count (/μL)</Label>
              <Input
                id="platelets"
                type="number"
                placeholder="250000"
                value={formData.value}
                onChange={(e) => handleInputChange("value", e.target.value)}
                className={errors.value ? "border-red-500" : ""}
              />
              {errors.value && <p className="text-sm text-red-500">{errors.value}</p>}
            </div>
          </div>
        );

      case METRIC_TYPES.CREATININE:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-teal-600">
              <Beaker className="h-4 w-4" />
              <span className="font-medium">Creatinine</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="creatinine">Creatinine (mg/dL)</Label>
              <Input
                id="creatinine"
                type="number"
                step="0.1"
                placeholder="1.2"
                value={formData.value}
                onChange={(e) => handleInputChange("value", e.target.value)}
                className={errors.value ? "border-red-500" : ""}
              />
              {errors.value && <p className="text-sm text-red-500">{errors.value}</p>}
            </div>
          </div>
        );

      case METRIC_TYPES.UREA:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-amber-600">
              <Beaker className="h-4 w-4" />
              <span className="font-medium">Urea</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="urea">Urea (mg/dL)</Label>
              <Input
                id="urea"
                type="number"
                step="0.1"
                placeholder="25"
                value={formData.value}
                onChange={(e) => handleInputChange("value", e.target.value)}
                className={errors.value ? "border-red-500" : ""}
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Add Health Data</CardTitle>
        <CardDescription>
          Upload health reports or enter your health metrics manually
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Report</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>
          
          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-4">
            <FileUploadComponent />
          </TabsContent>
          
          {/* Manual Entry Tab */}
          <TabsContent value="manual" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Metric Type Selection */}
              <div className="space-y-2">
                <Label htmlFor="metricType">Health Metric Type</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                  <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select metric type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={METRIC_TYPES.BLOOD_PRESSURE}>
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        Blood Pressure
                      </div>
                    </SelectItem>
                    <SelectItem value={METRIC_TYPES.BLOOD_SUGAR}>
                      <div className="flex items-center gap-2">
                        <Droplet className="h-4 w-4 text-blue-500" />
                        Blood Sugar
                      </div>
                    </SelectItem>
                    <SelectItem value={METRIC_TYPES.CHOLESTEROL}>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        Cholesterol
                      </div>
                    </SelectItem>
                    <SelectItem value={METRIC_TYPES.WEIGHT}>
                      <div className="flex items-center gap-2">
                        <Scale className="h-4 w-4 text-purple-500" />
                        Weight
                      </div>
                    </SelectItem>
                    <SelectItem value={METRIC_TYPES.HEART_RATE}>
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-orange-500" />
                        Heart Rate
                      </div>
                    </SelectItem>
                    <SelectItem value={METRIC_TYPES.HEIGHT}>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-indigo-500" />
                        Height
                      </div>
                    </SelectItem>
                    <SelectItem value={METRIC_TYPES.TEMPERATURE}>
                      <div className="flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-red-400" />
                        Temperature
                      </div>
                    </SelectItem>
                    <SelectItem value={METRIC_TYPES.HEMOGLOBIN}>
                      <div className="flex items-center gap-2">
                        <Droplet className="h-4 w-4 text-red-600" />
                        Hemoglobin
                      </div>
                    </SelectItem>
                    <SelectItem value={METRIC_TYPES.WBC}>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        White Blood Cells
                      </div>
                    </SelectItem>
                    <SelectItem value={METRIC_TYPES.PLATELETS}>
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-yellow-600" />
                        Platelets
                      </div>
                    </SelectItem>
                    <SelectItem value={METRIC_TYPES.CREATININE}>
                      <div className="flex items-center gap-2">
                        <Beaker className="h-4 w-4 text-teal-600" />
                        Creatinine
                      </div>
                    </SelectItem>
                    <SelectItem value={METRIC_TYPES.UREA}>
                      <div className="flex items-center gap-2">
                        <Beaker className="h-4 w-4 text-amber-600" />
                        Urea
                      </div>
                    </SelectItem>
                    
                    {/* Glucose & Diabetes Profile */}
                    <SelectItem value={METRIC_TYPES.GLUCOSE}>
                      <div className="flex items-center gap-2">
                        <Droplet className="h-4 w-4 text-blue-600" />
                        Glucose
                      </div>
                    </SelectItem>
                    <SelectItem value={METRIC_TYPES.FASTING_GLUCOSE}>
                      <div className="flex items-center gap-2">
                        <Droplet className="h-4 w-4 text-blue-500" />
                        Fasting Glucose
                      </div>
                    </SelectItem>
                    <SelectItem value={METRIC_TYPES.RANDOM_GLUCOSE}>
                      <div className="flex items-center gap-2">
                        <Droplet className="h-4 w-4 text-blue-400" />
                        Random Glucose
                      </div>
                    </SelectItem>
                    <SelectItem value={METRIC_TYPES.HBA1C}>
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-purple-600" />
                        HbA1c (Glycosylated Hemoglobin)
                      </div>
                    </SelectItem>
                    
                    {/* Lipid Profile */}
                    <SelectItem value={METRIC_TYPES.TOTAL_CHOLESTEROL}>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-yellow-600" />
                        Total Cholesterol
                      </div>
                    </SelectItem>
                    <SelectItem value={METRIC_TYPES.TRIGLYCERIDES}>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-orange-600" />
                        Triglycerides
                      </div>
                    </SelectItem>
                    <SelectItem value={METRIC_TYPES.HDL_CHOLESTEROL}>
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-green-600" />
                        HDL Cholesterol
                      </div>
                    </SelectItem>
                    <SelectItem value={METRIC_TYPES.LDL_CHOLESTEROL}>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-red-500" />
                        LDL Cholesterol
                      </div>
                    </SelectItem>
                    <SelectItem value={METRIC_TYPES.VLDL_CHOLESTEROL}>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-red-400" />
                        VLDL Cholesterol
                      </div>
                    </SelectItem>
                    
                    {/* Thyroid Function */}
                    <SelectItem value={METRIC_TYPES.TSH}>
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-indigo-600" />
                        TSH (Thyroid Stimulating Hormone)
                      </div>
                    </SelectItem>
                    <SelectItem value={METRIC_TYPES.T3}>
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-indigo-500" />
                        T3
                      </div>
                    </SelectItem>
                    <SelectItem value={METRIC_TYPES.T4}>
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-indigo-400" />
                        T4
                      </div>
                    </SelectItem>
                    <SelectItem value={METRIC_TYPES.FREE_T4}>
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-indigo-300" />
                        Free T4
                      </div>
                    </SelectItem>
                    
                    {/* Vitamins */}
                    <SelectItem value={METRIC_TYPES.VITAMIN_D}>
                      <div className="flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-yellow-500" />
                        Vitamin D, 25-Hydroxy
                      </div>
                    </SelectItem>
                    <SelectItem value={METRIC_TYPES.VITAMIN_B12}>
                      <div className="flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-pink-500" />
                        Vitamin B12
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
              </div>

              {/* Date Selection */}
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    className={`pl-10 ${errors.date ? "border-red-500" : ""}`}
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
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                  />
                </div>
              )}

              {/* Submit button */}
              {formData.type && (
                <div className="space-y-2">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting || loading}
                  >
                    {isSubmitting ? "Adding..." : "Add Health Metric"}
                  </Button>
                  {errors.submit && <p className="text-sm text-red-500">{errors.submit}</p>}
                </div>
              )}
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
