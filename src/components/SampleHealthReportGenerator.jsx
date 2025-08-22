import { useState } from 'react';
import { Download, Beaker } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SampleHealthReportGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSampleReport = () => {
    setIsGenerating(true);
    
    const sampleReport = `
HEALTH REPORT - ${new Date().toLocaleDateString()}

Blood Pressure: 125/82 mmHg
Heart Rate: 74 bpm
Weight: 72.5 kg
Fasting Glucose: 92 mg/dL
Total Cholesterol: 185 mg/dL
HDL Cholesterol: 58 mg/dL  
LDL Cholesterol: 105 mg/dL

Second Reading:
Blood Pressure: 120/78 mmHg
Heart Rate: 68 bpm
    `.trim();

    const blob = new Blob([sampleReport], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sample-health-report-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => setIsGenerating(false), 1000);
  };

  return (
    <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-900/10 mb-4">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Beaker className="h-4 w-4 text-blue-600" />
          Test Data Extraction
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Button
          onClick={generateSampleReport}
          disabled={isGenerating}
          variant="outline"
          size="sm"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
              Generating...
            </>
          ) : (
            <>
              <Download className="mr-2 h-3 w-3" />
              Generate Test Report
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
