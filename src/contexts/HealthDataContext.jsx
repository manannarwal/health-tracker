import { createContext, useContext, useReducer, useEffect } from 'react';
import { calculateBMI, getBMICategory } from '../utils/healthDataUtils';

const HealthDataContext = createContext();

// Initial state structure
const initialState = {
  healthMetrics: [],
  uploadedReports: [],
  stats: {
    totalReports: 0,
    latestBloodPressure: null,
    latestBloodSugar: null,
    latestCholesterol: null,
    latestHeight: null,
    latestWeight: null,
    currentBMI: null,
    bmiCategory: null,
  },
  loading: false,
  error: null,
};

// Action types
export const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  ADD_HEALTH_METRIC: 'ADD_HEALTH_METRIC',
  UPDATE_HEALTH_METRIC: 'UPDATE_HEALTH_METRIC',
  DELETE_HEALTH_METRIC: 'DELETE_HEALTH_METRIC',
  ADD_REPORT: 'ADD_REPORT',
  DELETE_REPORT: 'DELETE_REPORT',
  LOAD_DATA: 'LOAD_DATA',
  CALCULATE_STATS: 'CALCULATE_STATS',
};

// Reducer function
function healthDataReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case ACTIONS.ADD_HEALTH_METRIC:
      return {
        ...state,
        healthMetrics: [...state.healthMetrics, action.payload],
        error: null,
      };
    
    case ACTIONS.UPDATE_HEALTH_METRIC:
      return {
        ...state,
        healthMetrics: state.healthMetrics.map(metric =>
          metric.id === action.payload.id ? action.payload : metric
        ),
        error: null,
      };
    
    case ACTIONS.DELETE_HEALTH_METRIC:
      return {
        ...state,
        healthMetrics: state.healthMetrics.filter(metric => metric.id !== action.payload),
        error: null,
      };
    
    case ACTIONS.ADD_REPORT:
      return {
        ...state,
        uploadedReports: [...state.uploadedReports, action.payload],
        error: null,
      };
    
    case ACTIONS.DELETE_REPORT:
      return {
        ...state,
        uploadedReports: state.uploadedReports.filter(report => report.id !== action.payload),
        error: null,
      };
    
    case ACTIONS.LOAD_DATA:
      return {
        ...state,
        healthMetrics: action.payload.healthMetrics || [],
        uploadedReports: action.payload.uploadedReports || [],
        loading: false,
      };
    
    case ACTIONS.CALCULATE_STATS:
      const metrics = state.healthMetrics;
      const latestMetrics = getLatestMetrics(metrics);
      
      return {
        ...state,
        stats: {
          totalReports: state.uploadedReports.length,
          latestBloodPressure: latestMetrics.bloodPressure,
          latestBloodSugar: latestMetrics.bloodSugar,
          latestCholesterol: latestMetrics.cholesterol,
          latestHeight: latestMetrics.height,
          latestWeight: latestMetrics.weight,
          currentBMI: latestMetrics.bmi,
          bmiCategory: latestMetrics.bmiCategory,
        },
      };
    
    default:
      return state;
  }
}

// Helper function to get latest metrics
function getLatestMetrics(metrics) {
  const sortedMetrics = metrics.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  const latestBP = sortedMetrics.find(m => m.type === 'bloodPressure');
  const latestBS = sortedMetrics.find(m => m.type === 'bloodSugar');
  const latestChol = sortedMetrics.find(m => m.type === 'cholesterol');
  const latestHeight = sortedMetrics.find(m => m.type === 'height');
  const latestWeight = sortedMetrics.find(m => m.type === 'weight');
  
  // Calculate BMI if both height and weight are available
  let bmi = null;
  let bmiCategory = null;
  if (latestHeight && latestWeight) {
    const heightValue = parseFloat(latestHeight.value);
    const weightValue = parseFloat(latestWeight.value);
    if (!isNaN(heightValue) && !isNaN(weightValue)) {
      bmi = calculateBMI(heightValue, weightValue);
      if (bmi) {
        bmiCategory = getBMICategory(bmi);
      }
    }
  }
  
  return {
    bloodPressure: latestBP ? `${latestBP.systolic}/${latestBP.diastolic}` : null,
    bloodSugar: latestBS ? `${latestBS.value} mg/dL` : null,
    cholesterol: latestChol ? `${latestChol.total} mg/dL` : null,
    height: latestHeight ? `${latestHeight.value} cm` : null,
    weight: latestWeight ? `${latestWeight.value} kg` : null,
    bmi,
    bmiCategory,
  };
}

// Context Provider Component
export function HealthDataProvider({ children }) {
  const [state, dispatch] = useReducer(healthDataReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadStoredData = () => {
      try {
        const storedData = localStorage.getItem('healthTrackerData');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          dispatch({ type: ACTIONS.LOAD_DATA, payload: parsedData });
          dispatch({ type: ACTIONS.CALCULATE_STATS });
        }
      } catch (error) {
        console.error('Error loading stored data:', error);
        dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to load stored data' });
      }
    };

    loadStoredData();
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    try {
      const dataToStore = {
        healthMetrics: state.healthMetrics,
        uploadedReports: state.uploadedReports,
      };
      localStorage.setItem('healthTrackerData', JSON.stringify(dataToStore));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }, [state.healthMetrics, state.uploadedReports]);

  // Action creators
  const actions = {
    addHealthMetric: (metric) => {
      const newMetric = {
        id: Date.now().toString(),
        ...metric,
        date: metric.date || new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: ACTIONS.ADD_HEALTH_METRIC, payload: newMetric });
      dispatch({ type: ACTIONS.CALCULATE_STATS });
    },

    updateHealthMetric: (metric) => {
      dispatch({ type: ACTIONS.UPDATE_HEALTH_METRIC, payload: metric });
      dispatch({ type: ACTIONS.CALCULATE_STATS });
    },

    deleteHealthMetric: (id) => {
      dispatch({ type: ACTIONS.DELETE_HEALTH_METRIC, payload: id });
      dispatch({ type: ACTIONS.CALCULATE_STATS });
    },

    addReport: (report) => {
      const newReport = {
        id: Date.now().toString(),
        ...report,
        uploadedAt: new Date().toISOString(),
      };
      dispatch({ type: ACTIONS.ADD_REPORT, payload: newReport });
      dispatch({ type: ACTIONS.CALCULATE_STATS });
    },

    deleteReport: (id) => {
      dispatch({ type: ACTIONS.DELETE_REPORT, payload: id });
      dispatch({ type: ACTIONS.CALCULATE_STATS });
    },

    setLoading: (loading) => {
      dispatch({ type: ACTIONS.SET_LOADING, payload: loading });
    },

    setError: (error) => {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error });
    },
  };

  return (
    <HealthDataContext.Provider value={{ ...state, ...actions }}>
      {children}
    </HealthDataContext.Provider>
  );
}

// Custom hook to use health data context
export function useHealthData() {
  const context = useContext(HealthDataContext);
  if (!context) {
    throw new Error('useHealthData must be used within a HealthDataProvider');
  }
  return context;
}