// Health data extraction utilities for PDF parsing and pattern recognition

// Comprehensive health metric patterns for realistic medical reports
export const healthPatterns = {
  // Blood pressure
  bloodPressure: {
    patterns: [
      /(?:blood\s*pressure|bp|systolic|diastolic)[\s:]*(\d{2,3})[\s\/\-]+(\d{2,3})(?:\s*mmhg)?/gi,
      /(\d{2,3})\s*\/\s*(\d{2,3})\s*(?:mmhg|blood\s*pressure|bp)/gi,
      /systolic[\s:]*(\d{2,3})[\s\w]*diastolic[\s:]*(\d{2,3})/gi
    ],
    type: 'bloodPressure',
    processor: (matches) => {
      if (matches && matches.length >= 3) {
        const systolic = parseInt(matches[1]);
        const diastolic = parseInt(matches[2]);
        if (systolic >= 70 && systolic <= 250 && diastolic >= 40 && diastolic <= 150) {
          return { systolic, diastolic, unit: 'mmHg' };
        }
      }
      return null;
    }
  },

  // Glucose tests - comprehensive patterns for different glucose types
  glucose: {
    patterns: [
      /(?:fasting\s*)?(?:blood\s*)?glucose[\s:]*(\d{2,3}\.?\d*)(?:\s*mg\/dl)?/gi,
      /glucose[\s,]*fasting[\s:]*(\d{2,3}\.?\d*)/gi,
      /glucose[\s,]*(?:serum|plasma)[\s:]*(\d{2,3}\.?\d*)/gi
    ],
    type: 'glucose',
    processor: (matches) => {
      if (matches && matches.length >= 2) {
        const value = parseFloat(matches[1]);
        if (value >= 30 && value <= 600) {
          return { value, unit: 'mg/dL' };
        }
      }
      return null;
    }
  },

  fastingGlucose: {
    patterns: [
      /fasting\s*glucose[\s:]*(\d{2,3}\.?\d*)/gi,
      /glucose[\s,]*fasting[\s:]*(\d{2,3}\.?\d*)/gi,
      /fbs[\s:]*(\d{2,3}\.?\d*)/gi
    ],
    type: 'fastingGlucose',
    processor: (matches) => {
      if (matches && matches.length >= 2) {
        const value = parseFloat(matches[1]);
        if (value >= 30 && value <= 600) {
          return { value, unit: 'mg/dL' };
        }
      }
      return null;
    }
  },

  randomGlucose: {
    patterns: [
      /random\s*glucose[\s:]*(\d{2,3}\.?\d*)/gi,
      /glucose[\s,]*random[\s:]*(\d{2,3}\.?\d*)/gi,
      /rbs[\s:]*(\d{2,3}\.?\d*)/gi
    ],
    type: 'randomGlucose',
    processor: (matches) => {
      if (matches && matches.length >= 2) {
        const value = parseFloat(matches[1]);
        if (value >= 30 && value <= 600) {
          return { value, unit: 'mg/dL' };
        }
      }
      return null;
    }
  },

  // HbA1c - Glycosylated Hemoglobin
  hba1c: {
    patterns: [
      /(?:hba1c|hb\s*a1c|glycosylated\s*hemoglobin|glycosylated\s*hb)[\s:]*(\d{1,2}\.?\d*)(?:\s*%)?/gi,
      /hemoglobin\s*a1c[\s:]*(\d{1,2}\.?\d*)/gi,
      /a1c[\s:]*(\d{1,2}\.?\d*)/gi
    ],
    type: 'hba1c',
    processor: (matches) => {
      if (matches && matches.length >= 2) {
        const value = parseFloat(matches[1]);
        if (value >= 3 && value <= 20) {
          return { value, unit: '%' };
        }
      }
      return null;
    }
  },

  // Comprehensive Lipid Profile
  totalCholesterol: {
    patterns: [
      /total\s*cholesterol[\s:]*(\d{2,3}\.?\d*)(?:\s*mg\/dl)?/gi,
      /cholesterol[\s,]*total[\s:]*(\d{2,3}\.?\d*)/gi,
      /serum\s*cholesterol[\s:]*(\d{2,3}\.?\d*)/gi
    ],
    type: 'totalCholesterol',
    processor: (matches) => {
      if (matches && matches.length >= 2) {
        const value = parseFloat(matches[1]);
        if (value >= 100 && value <= 500) {
          return { value, unit: 'mg/dL' };
        }
      }
      return null;
    }
  },

  triglycerides: {
    patterns: [
      /(?:serum\s*)?triglycerides[\s:]*(\d{2,3}\.?\d*)(?:\s*mg\/dl)?/gi,
      /triglyceride[\s:]*(\d{2,3}\.?\d*)/gi,
      /tg[\s:]*(\d{2,3}\.?\d*)/gi
    ],
    type: 'triglycerides',
    processor: (matches) => {
      if (matches && matches.length >= 2) {
        const value = parseFloat(matches[1]);
        if (value >= 30 && value <= 1000) {
          return { value, unit: 'mg/dL' };
        }
      }
      return null;
    }
  },

  hdlCholesterol: {
    patterns: [
      /(?:serum\s*)?hdl[\s\-]*cholesterol[\s:]*(\d{1,3}\.?\d*)(?:\s*mg\/dl)?/gi,
      /hdl[\s:]*(\d{1,3}\.?\d*)/gi,
      /high\s*density\s*lipoprotein[\s:]*(\d{1,3}\.?\d*)/gi
    ],
    type: 'hdlCholesterol',
    processor: (matches) => {
      if (matches && matches.length >= 2) {
        const value = parseFloat(matches[1]);
        if (value >= 20 && value <= 100) {
          return { value, unit: 'mg/dL' };
        }
      }
      return null;
    }
  },

  ldlCholesterol: {
    patterns: [
      /(?:serum\s*)?ldl[\s\-]*cholesterol[\s:]*(\d{1,3}\.?\d*)(?:\s*mg\/dl)?/gi,
      /ldl[\s:]*(\d{1,3}\.?\d*)/gi,
      /low\s*density\s*lipoprotein[\s:]*(\d{1,3}\.?\d*)/gi
    ],
    type: 'ldlCholesterol',
    processor: (matches) => {
      if (matches && matches.length >= 2) {
        const value = parseFloat(matches[1]);
        if (value >= 50 && value <= 400) {
          return { value, unit: 'mg/dL' };
        }
      }
      return null;
    }
  },

  vldlCholesterol: {
    patterns: [
      /(?:serum\s*)?vldl[\s\-]*cholesterol[\s:]*(\d{1,3}\.?\d*)(?:\s*mg\/dl)?/gi,
      /vldl[\s:]*(\d{1,3}\.?\d*)/gi,
      /very\s*low\s*density\s*lipoprotein[\s:]*(\d{1,3}\.?\d*)/gi
    ],
    type: 'vldlCholesterol',
    processor: (matches) => {
      if (matches && matches.length >= 2) {
        const value = parseFloat(matches[1]);
        if (value >= 5 && value <= 100) {
          return { value, unit: 'mg/dL' };
        }
      }
      return null;
    }
  },

  // Thyroid Function Tests
  tsh: {
    patterns: [
      /(?:thyroid\s*stimulating\s*hormone|tsh)[\s:]*(\d{1,2}\.?\d*)(?:\s*(?:miu\/l|μiu\/ml|uiu\/ml))?/gi,
      /tsh[\s:]*(\d{1,2}\.?\d*)/gi,
      /s\.?\s*tsh[\s:]*(\d{1,2}\.?\d*)/gi
    ],
    type: 'tsh',
    processor: (matches) => {
      if (matches && matches.length >= 2) {
        const value = parseFloat(matches[1]);
        if (value >= 0.1 && value <= 50) {
          return { value, unit: 'mIU/L' };
        }
      }
      return null;
    }
  },

  t3: {
    patterns: [
      /(?:total\s*)?t3[\s:]*(\d{1,2}\.?\d*)(?:\s*(?:ng\/ml|nmol\/l))?/gi,
      /triiodothyronine[\s:]*(\d{1,2}\.?\d*)/gi,
      /t3[\s,]*total[\s:]*(\d{1,2}\.?\d*)/gi
    ],
    type: 't3',
    processor: (matches) => {
      if (matches && matches.length >= 2) {
        const value = parseFloat(matches[1]);
        if (value >= 0.5 && value <= 5) {
          return { value, unit: 'ng/mL' };
        }
      }
      return null;
    }
  },

  t4: {
    patterns: [
      /(?:total\s*)?t4[\s:]*(\d{1,2}\.?\d*)(?:\s*(?:μg\/dl|ug\/dl))?/gi,
      /thyroxine[\s:]*(\d{1,2}\.?\d*)/gi,
      /t4[\s,]*total[\s:]*(\d{1,2}\.?\d*)/gi
    ],
    type: 't4',
    processor: (matches) => {
      if (matches && matches.length >= 2) {
        const value = parseFloat(matches[1]);
        if (value >= 5 && value <= 25) {
          return { value, unit: 'μg/dL' };
        }
      }
      return null;
    }
  },

  freeT4: {
    patterns: [
      /free\s*t4[\s:]*(\d{1,2}\.?\d*)(?:\s*(?:ng\/dl|pmol\/l))?/gi,
      /ft4[\s:]*(\d{1,2}\.?\d*)/gi,
      /t4[\s,]*free[\s:]*(\d{1,2}\.?\d*)/gi
    ],
    type: 'freeT4',
    processor: (matches) => {
      if (matches && matches.length >= 2) {
        const value = parseFloat(matches[1]);
        if (value >= 0.8 && value <= 2.8) {
          return { value, unit: 'ng/dL' };
        }
      }
      return null;
    }
  },

  // Vitamin D (25-Hydroxy)
  vitaminD: {
    patterns: [
      /vitamin\s*d[\s,]*(?:25[\s\-]*hydroxy|total)[\s:]*(\d{1,3}\.?\d*)(?:\s*(?:ng\/ml|nmol\/l))?/gi,
      /25[\s\-]*(?:oh|hydroxy)[\s\-]*(?:vitamin\s*)?d[\s:]*(\d{1,3}\.?\d*)/gi,
      /calcidiol[\s:]*(\d{1,3}\.?\d*)/gi,
      /vitamin\s*d3[\s:]*(\d{1,3}\.?\d*)/gi
    ],
    type: 'vitaminD',
    processor: (matches) => {
      if (matches && matches.length >= 2) {
        const value = parseFloat(matches[1]);
        if (value >= 5 && value <= 200) {
          return { value, unit: 'ng/mL' };
        }
      }
      return null;
    }
  },

  // Vitamin B12
  vitaminB12: {
    patterns: [
      /vitamin\s*b[\s\-]*12[\s:]*(\d{2,4}\.?\d*)(?:\s*(?:pg\/ml|pmol\/l))?/gi,
      /b12[\s:]*(\d{2,4}\.?\d*)/gi,
      /cobalamin[\s:]*(\d{2,4}\.?\d*)/gi,
      /cyanocobalamin[\s:]*(\d{2,4}\.?\d*)/gi
    ],
    type: 'vitaminB12',
    processor: (matches) => {
      if (matches && matches.length >= 2) {
        const value = parseFloat(matches[1]);
        if (value >= 100 && value <= 2000) {
          return { value, unit: 'pg/mL' };
        }
      }
      return null;
    }
  },

  // Keep existing patterns for backward compatibility
  bloodSugar: {
    patterns: [
      /(?:blood\s*sugar|glucose|blood\s*glucose)[\s:]*(\d{2,3}\.?\d*)(?:\s*mg\/dl)?/gi,
      /glucose[\s:]*(\d{2,3}\.?\d*)/gi,
      /(\d{2,3}\.?\d*)\s*mg\/dl(?:\s*glucose|blood\s*sugar)?/gi
    ],
    type: 'bloodSugar',
    processor: (matches) => {
      if (matches && matches.length >= 2) {
        const value = parseFloat(matches[1]);
        if (value >= 30 && value <= 500) {
          return { value, unit: 'mg/dL' };
        }
      }
      return null;
    }
  },

  // Legacy cholesterol pattern (keeping for backward compatibility)
  cholesterol: {
    patterns: [
      /(?:total\s*)?cholesterol[\s:]*(\d{2,3}\.?\d*)(?:\s*mg\/dl)?/gi,
      /hdl[\s:]*(\d{1,3}\.?\d*)(?:\s*mg\/dl)?/gi,
      /ldl[\s:]*(\d{1,3}\.?\d*)(?:\s*mg\/dl)?/gi
    ],
    type: 'cholesterol',
    processor: (matches, text) => {
      const result = {};
      
      // Look for total cholesterol
      const totalMatch = text.match(/(?:total\s*)?cholesterol[\s:]*(\d{2,3}\.?\d*)/gi);
      if (totalMatch) {
        const value = parseFloat(totalMatch[0].replace(/[^\d.]/g, ''));
        if (value >= 100 && value <= 400) result.total = value;
      }
      
      // Look for HDL
      const hdlMatch = text.match(/hdl[\s:]*(\d{1,3}\.?\d*)/gi);
      if (hdlMatch) {
        const value = parseFloat(hdlMatch[0].replace(/[^\d.]/g, ''));
        if (value >= 20 && value <= 100) result.hdl = value;
      }
      
      // Look for LDL
      const ldlMatch = text.match(/ldl[\s:]*(\d{1,3}\.?\d*)/gi);
      if (ldlMatch) {
        const value = parseFloat(ldlMatch[0].replace(/[^\d.]/g, ''));
        if (value >= 50 && value <= 300) result.ldl = value;
      }
      
      if (Object.keys(result).length > 0) {
        result.unit = 'mg/dL';
        return result;
      }
      
      return null;
    }
  },

  weight: {
    patterns: [
      /(?:weight|wt|body\s*weight)[\s:]*(\d{2,3}\.?\d*)(?:\s*(?:kg|kgs|kilograms?))?/gi,
      /(\d{2,3}\.?\d*)\s*(?:kg|kgs|kilograms?)(?:\s*weight)?/gi
    ],
    type: 'weight',
    unit: 'kg',
    processor: (matches) => {
      if (matches && matches.length >= 2) {
        const value = parseFloat(matches[1]);
        if (value >= 20 && value <= 300) {
          return { value, unit: 'kg' };
        }
      }
      return null;
    }
  },

  heartRate: {
    patterns: [
      /(?:heart\s*rate|hr|pulse|bpm)[\s:]*(\d{2,3})(?:\s*bpm)?/gi,
      /(\d{2,3})\s*bpm(?:\s*heart\s*rate|pulse)?/gi,
      /pulse[\s:]*(\d{2,3})/gi
    ],
    type: 'heartRate',
    unit: 'bpm',
    processor: (matches) => {
      if (matches && matches.length >= 2) {
        const value = parseInt(matches[1]);
        if (value >= 30 && value <= 220) {
          return { value, unit: 'bpm' };
        }
      }
      return null;
    }
  },

  height: {
    patterns: [
      /(?:height|ht)[\s:]*(\d{2,3}\.?\d*)(?:\s*(?:cm|cms|centimeters?))?/gi,
      /(\d{2,3}\.?\d*)\s*(?:cm|cms|centimeters?)(?:\s*height)?/gi
    ],
    type: 'height',
    unit: 'cm',
    processor: (matches) => {
      if (matches && matches.length >= 2) {
        const value = parseFloat(matches[1]);
        if (value >= 100 && value <= 250) {
          return { value, unit: 'cm' };
        }
      }
      return null;
    }
  },

  temperature: {
    patterns: [
      /(?:temperature|temp|body\s*temp)[\s:]*(\d{2,3}\.?\d*)(?:\s*(?:°c|°f|celsius|fahrenheit|c|f))?/gi,
      /(\d{2,3}\.?\d*)\s*(?:°c|°f|celsius|fahrenheit)(?:\s*temperature)?/gi
    ],
    type: 'temperature',
    unit: '°C',
    processor: (matches) => {
      if (matches && matches.length >= 2) {
        let value = parseFloat(matches[1]);
        // Convert Fahrenheit to Celsius if needed
        if (value > 50) {
          value = (value - 32) * 5/9;
        }
        if (value >= 30 && value <= 45) {
          return { value: parseFloat(value.toFixed(1)), unit: '°C' };
        }
      }
      return null;
    }
  },

  hemoglobin: {
    patterns: [
      /(?:hemoglobin|haemoglobin|hb|hgb)[\s:]*(\d{1,2}\.?\d*)(?:\s*(?:g\/dl|gm\/dl|g\/l))?/gi,
      /hb[\s:]*(\d{1,2}\.?\d*)/gi,
      /(\d{1,2}\.?\d*)\s*(?:g\/dl|gm\/dl)(?:\s*hemoglobin|hb)?/gi
    ],
    type: 'hemoglobin',
    unit: 'g/dL',
    processor: (matches) => {
      if (matches && matches.length >= 2) {
        const value = parseFloat(matches[1]);
        if (value >= 5 && value <= 20) {
          return { value, unit: 'g/dL' };
        }
      }
      return null;
    }
  },

  wbc: {
    patterns: [
      /(?:white\s*blood\s*cells?|wbc|leucocytes?)[\s:]*(\d{1,6}\.?\d*)(?:\s*(?:\/μl|per\s*μl|\/ul|per\s*ul|cells\/μl))?/gi,
      /wbc[\s:]*(\d{1,6}\.?\d*)/gi,
      /(\d{1,6}\.?\d*)\s*(?:\/μl|per\s*μl|\/ul|per\s*ul)(?:\s*wbc|white\s*blood\s*cells?)?/gi
    ],
    type: 'wbc',
    unit: '/μL',
    processor: (matches) => {
      if (matches && matches.length >= 2) {
        const value = parseFloat(matches[1]);
        if (value >= 1000 && value <= 50000) {
          return { value, unit: '/μL' };
        }
      }
      return null;
    }
  },

  platelets: {
    patterns: [
      /(?:platelets?|platelet\s*count|plt)[\s:]*(\d{2,6}\.?\d*)(?:\s*(?:\/μl|per\s*μl|\/ul|per\s*ul|cells\/μl))?/gi,
      /plt[\s:]*(\d{2,6}\.?\d*)/gi,
      /(\d{2,6}\.?\d*)\s*(?:\/μl|per\s*μl|\/ul|per\s*ul)(?:\s*platelets?|plt)?/gi
    ],
    type: 'platelets',
    unit: '/μL',
    processor: (matches) => {
      if (matches && matches.length >= 2) {
        const value = parseFloat(matches[1]);
        if (value >= 10000 && value <= 1000000) {
          return { value, unit: '/μL' };
        }
      }
      return null;
    }
  },

  creatinine: {
    patterns: [
      /(?:creatinine|creat|cr)[\s:]*(\d{1,2}\.?\d*)(?:\s*(?:mg\/dl|mg\/l|μmol\/l))?/gi,
      /creat[\s:]*(\d{1,2}\.?\d*)/gi,
      /(\d{1,2}\.?\d*)\s*(?:mg\/dl|mg\/l)(?:\s*creatinine|creat)?/gi
    ],
    type: 'creatinine',
    unit: 'mg/dL',
    processor: (matches) => {
      if (matches && matches.length >= 2) {
        const value = parseFloat(matches[1]);
        if (value >= 0.3 && value <= 10) {
          return { value, unit: 'mg/dL' };
        }
      }
      return null;
    }
  },

  urea: {
    patterns: [
      /(?:urea|blood\s*urea|bun|blood\s*urea\s*nitrogen)[\s:]*(\d{1,3}\.?\d*)(?:\s*(?:mg\/dl|mg\/l|mmol\/l))?/gi,
      /bun[\s:]*(\d{1,3}\.?\d*)/gi,
      /(\d{1,3}\.?\d*)\s*(?:mg\/dl|mg\/l)(?:\s*urea|bun)?/gi
    ],
    type: 'urea',
    unit: 'mg/dL',
    processor: (matches) => {
      if (matches && matches.length >= 2) {
        const value = parseFloat(matches[1]);
        if (value >= 5 && value <= 100) {
          return { value, unit: 'mg/dL' };
        }
      }
      return null;
    }
  }
};

// Extract dates from text
export const extractDates = (text) => {
  const datePatterns = [
    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/g,
    /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/g,
    /(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+(\d{4})/gi,
    /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+(\d{1,2}),?\s+(\d{4})/gi
  ];

  const dates = [];
  
  datePatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      let dateStr;
      
      if (pattern.source.includes('jan|feb')) {
        // Month name format
        const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 
                          'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        const monthIndex = monthNames.findIndex(m => 
          match[1].toLowerCase().startsWith(m) || match[2]?.toLowerCase().startsWith(m)
        );
        
        if (monthIndex >= 0) {
          if (match[3]) {
            dateStr = `${match[3]}-${(monthIndex + 1).toString().padStart(2, '0')}-${match[2].padStart(2, '0')}`;
          } else {
            dateStr = `${match[3]}-${(monthIndex + 1).toString().padStart(2, '0')}-${match[1].padStart(2, '0')}`;
          }
        }
      } else if (match[3] && match[3].length === 4) {
        // Year is third group (MM/DD/YYYY)
        dateStr = `${match[3]}-${match[1].padStart(2, '0')}-${match[2].padStart(2, '0')}`;
      } else if (match[1] && match[1].length === 4) {
        // Year is first group (YYYY/MM/DD)
        dateStr = `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`;
      }
      
      if (dateStr && !isNaN(Date.parse(dateStr))) {
        dates.push(dateStr);
      }
    }
  });

  // Return most recent date or today if none found
  if (dates.length > 0) {
    return dates.sort().reverse()[0];
  }
  
  return new Date().toISOString().split('T')[0];
};

// Main extraction function
export const extractHealthData = (text, fileName = '') => {
  const extractedData = [];
  const cleanText = text.toLowerCase().replace(/\s+/g, ' ');
  
  // Try to extract a date for all metrics
  const extractedDate = extractDates(text);
  
  // Process each health metric type
  Object.entries(healthPatterns).forEach(([key, config]) => {
    config.patterns.forEach(pattern => {
      const matches = pattern.exec(cleanText);
      if (matches) {
        let result;
        
        if (config.processor) {
          result = config.processor(matches, cleanText);
        }
        
        if (result) {
          extractedData.push({
            type: config.type,
            date: extractedDate,
            notes: `Extracted from ${fileName}`,
            source: 'pdf-upload',
            ...result
          });
        }
      }
    });
  });

  return extractedData;
};

// Simulate PDF text extraction (in real implementation, you'd use PDF.js or similar)
export const extractTextFromPDF = async (file) => {
  try {
    // For now, we'll create a mock extraction that simulates finding health data
    // In a real implementation, you would use PDF.js or pdf-lib to extract text
    
    const fileName = file.name.toLowerCase();
    
    // Generate mock health data based on common lab report patterns
    let mockText = `
      Health Report - ${new Date().toLocaleDateString()}
      Patient Health Assessment
      
      Blood Pressure: 120/80 mmHg
      Blood Sugar (Fasting): 95 mg/dL
      Total Cholesterol: 180 mg/dL
      HDL Cholesterol: 60 mg/dL
      LDL Cholesterol: 100 mg/dL
      Weight: 70 kg
      Heart Rate: 72 bpm
      
      Report generated on ${new Date().toLocaleDateString()}
    `;
    
    // If filename suggests specific test, customize mock data
    if (fileName.includes('blood') || fileName.includes('lab')) {
      mockText += `
        Hemoglobin: 14.5 g/dL
        White Blood Cell Count: 7500 /μL
        Platelet Count: 250000 /μL
      `;
    }
    
    if (fileName.includes('cardio') || fileName.includes('heart')) {
      mockText += `
        ECG: Normal sinus rhythm
        Resting Heart Rate: 68 bpm
        Blood Pressure (multiple readings):
        Reading 1: 118/76 mmHg
        Reading 2: 122/78 mmHg
      `;
    }
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return mockText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw error;
  }
};

// Validate extracted health data
export const validateHealthData = (data) => {
  const validData = [];
  
  data.forEach(item => {
    let isValid = true;
    
    // Basic validation
    if (!item.type || !item.date) {
      isValid = false;
    }
    
    // Type-specific validation
    switch (item.type) {
      case 'bloodPressure':
        if (!item.systolic || !item.diastolic || 
            item.systolic < 70 || item.systolic > 250 ||
            item.diastolic < 40 || item.diastolic > 150) {
          isValid = false;
        }
        break;
        
      case 'bloodSugar':
        if (!item.value || item.value < 30 || item.value > 500) {
          isValid = false;
        }
        break;
        
      case 'weight':
        if (!item.value || item.value < 20 || item.value > 300) {
          isValid = false;
        }
        break;
        
      case 'heartRate':
        if (!item.value || item.value < 30 || item.value > 220) {
          isValid = false;
        }
        break;
        
      case 'cholesterol':
        if (!item.total && !item.hdl && !item.ldl) {
          isValid = false;
        }
        break;
    }
    
    if (isValid) {
      validData.push({
        ...item,
        id: Date.now() + Math.random()
      });
    }
  });
  
  return validData;
};
