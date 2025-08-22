// Health metric types
export const METRIC_TYPES = {
  BLOOD_PRESSURE: 'bloodPressure',
  BLOOD_SUGAR: 'bloodSugar',
  CHOLESTEROL: 'cholesterol',
  WEIGHT: 'weight',
  HEIGHT: 'height',
  HEART_RATE: 'heartRate',
  TEMPERATURE: 'temperature',
  HEMOGLOBIN: 'hemoglobin',
  WBC: 'wbc',
  PLATELETS: 'platelets',
  CREATININE: 'creatinine',
  UREA: 'urea',
  BMI: 'bmi'
};

// Data validation functions
export const validateHealthMetric = (metric) => {
  const errors = {};

  if (!metric.type) {
    errors.type = 'Metric type is required';
  }

  if (!metric.date) {
    errors.date = 'Date is required';
  }

  // Type-specific validations
  switch (metric.type) {
    case METRIC_TYPES.BLOOD_PRESSURE:
      const systolicValue = parseFloat(metric.systolic);
      const diastolicValue = parseFloat(metric.diastolic);
      if (!metric.systolic || isNaN(systolicValue) || systolicValue < 50 || systolicValue > 300) {
        errors.systolic = 'Valid systolic pressure (50-300) is required';
      }
      if (!metric.diastolic || isNaN(diastolicValue) || diastolicValue < 30 || diastolicValue > 200) {
        errors.diastolic = 'Valid diastolic pressure (30-200) is required';
      }
      break;

    case METRIC_TYPES.BLOOD_SUGAR:
      const sugarValue = parseFloat(metric.value);
      if (!metric.value || isNaN(sugarValue) || sugarValue < 20 || sugarValue > 800) {
        errors.value = 'Valid blood sugar (20-800 mg/dL) is required';
      }
      break;

    case METRIC_TYPES.CHOLESTEROL:
      const totalChol = parseFloat(metric.total);
      if (!metric.total || isNaN(totalChol) || totalChol < 50 || totalChol > 500) {
        errors.total = 'Valid total cholesterol (50-500 mg/dL) is required';
      }
      break;

    case METRIC_TYPES.WEIGHT:
      const weightValue = parseFloat(metric.value);
      if (!metric.value || isNaN(weightValue) || weightValue < 10 || weightValue > 500) {
        errors.value = 'Valid weight (10-500 kg) is required';
      }
      break;

    case METRIC_TYPES.HEIGHT:
      const heightValue = parseFloat(metric.value);
      if (!metric.value || isNaN(heightValue) || heightValue < 50 || heightValue > 250) {
        errors.value = 'Valid height (50-250 cm) is required';
      }
      break;

    case METRIC_TYPES.HEART_RATE:
      const hrValue = parseFloat(metric.value);
      if (!metric.value || isNaN(hrValue) || hrValue < 30 || hrValue > 250) {
        errors.value = 'Valid heart rate (30-250 bpm) is required';
      }
      break;

    case METRIC_TYPES.TEMPERATURE:
      const tempValue = parseFloat(metric.value);
      if (!metric.value || isNaN(tempValue) || tempValue < 30 || tempValue > 45) {
        errors.value = 'Valid temperature (30-45°C) is required';
      }
      break;

    case METRIC_TYPES.HEMOGLOBIN:
      const hbValue = parseFloat(metric.value);
      if (!metric.value || isNaN(hbValue) || hbValue < 5 || hbValue > 20) {
        errors.value = 'Valid hemoglobin (5-20 g/dL) is required';
      }
      break;

    case METRIC_TYPES.WBC:
      const wbcValue = parseFloat(metric.value);
      if (!metric.value || isNaN(wbcValue) || wbcValue < 1000 || wbcValue > 50000) {
        errors.value = 'Valid WBC count (1000-50000 /μL) is required';
      }
      break;

    case METRIC_TYPES.PLATELETS:
      const plateletValue = parseFloat(metric.value);
      if (!metric.value || isNaN(plateletValue) || plateletValue < 50000 || plateletValue > 1000000) {
        errors.value = 'Valid platelet count (50000-1000000 /μL) is required';
      }
      break;

    case METRIC_TYPES.CREATININE:
      const creatValue = parseFloat(metric.value);
      if (!metric.value || isNaN(creatValue) || creatValue < 0.3 || creatValue > 10) {
        errors.value = 'Valid creatinine (0.3-10 mg/dL) is required';
      }
      break;

    case METRIC_TYPES.UREA:
      const ureaValue = parseFloat(metric.value);
      if (!metric.value || isNaN(ureaValue) || ureaValue < 5 || ureaValue > 200) {
        errors.value = 'Valid urea (5-200 mg/dL) is required';
      }
      break;

    case METRIC_TYPES.BMI:
      const bmiValue = parseFloat(metric.value);
      if (!metric.value || isNaN(bmiValue) || bmiValue < 10 || bmiValue > 60) {
        errors.value = 'Valid BMI (10-60) is required';
      }
      break;

    default:
      errors.type = 'Invalid metric type';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Formatting functions
export const formatMetricValue = (metric) => {
  switch (metric.type) {
    case METRIC_TYPES.BLOOD_PRESSURE:
      return `${metric.systolic}/${metric.diastolic}`;
    case METRIC_TYPES.BLOOD_SUGAR:
      return `${metric.value} mg/dL`;
    case METRIC_TYPES.CHOLESTEROL:
      return `${metric.total} mg/dL`;
    case METRIC_TYPES.WEIGHT:
      return `${metric.value} kg`;
    case METRIC_TYPES.HEIGHT:
      return `${metric.value} cm`;
    case METRIC_TYPES.HEART_RATE:
      return `${metric.value} bpm`;
    case METRIC_TYPES.TEMPERATURE:
      return `${metric.value}°C`;
    case METRIC_TYPES.HEMOGLOBIN:
      return `${metric.value} g/dL`;
    case METRIC_TYPES.WBC:
      return `${metric.value.toLocaleString()} /μL`;
    case METRIC_TYPES.PLATELETS:
      return `${metric.value.toLocaleString()} /μL`;
    case METRIC_TYPES.CREATININE:
      return `${metric.value} mg/dL`;
    case METRIC_TYPES.UREA:
      return `${metric.value} mg/dL`;
    case METRIC_TYPES.BMI:
      return `${metric.value}`;
    default:
      return metric.value;
  }
};

export const getMetricIcon = (type) => {
  switch (type) {
    case METRIC_TYPES.BLOOD_PRESSURE:
      return 'Heart';
    case METRIC_TYPES.BLOOD_SUGAR:
      return 'Droplet';
    case METRIC_TYPES.CHOLESTEROL:
      return 'TrendingUp';
    case METRIC_TYPES.WEIGHT:
      return 'Scale';
    case METRIC_TYPES.HEART_RATE:
      return 'Activity';
    default:
      return 'Circle';
  }
};

// Date utilities
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return 'Yesterday';
  if (diffDays <= 7) return `${diffDays} days ago`;
  if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  return formatDate(dateString);
};

// Calculate BMI from height and weight
export const calculateBMI = (heightCm, weightKg) => {
  if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
    return null;
  }
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(1));
};

// BMI category
export const getBMICategory = (bmi) => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};