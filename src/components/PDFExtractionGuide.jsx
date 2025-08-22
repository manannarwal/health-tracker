import { Brain } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PDFExtractionGuide() {
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg">AI Data Extraction</CardTitle>
        </div>
        <CardDescription>
          Automatically extracts Blood Pressure, Blood Sugar, Cholesterol, Weight, and Heart Rate from PDF reports
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
