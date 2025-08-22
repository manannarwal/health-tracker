import { useState } from 'react';
import { Download, FileText, Calendar, Filter, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useHealthData } from '@/contexts/HealthDataContext';
import { formatDate } from '@/utils/healthDataUtils';

export default function HealthExport() {
  const { healthMetrics, uploadedReports } = useHealthData();
  const [exportFormat, setExportFormat] = useState('csv');
  const [dateRange, setDateRange] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedMetrics, setSelectedMetrics] = useState({
    bloodPressure: true,
    bloodSugar: true,
    cholesterol: true,
    weight: true,
    heartRate: true,
  });
  const [includeReports, setIncludeReports] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Filter data based on selections
  const getFilteredData = () => {
    let filteredMetrics = healthMetrics;

    // Filter by metric types
    const enabledTypes = Object.entries(selectedMetrics)
      .filter(([_, enabled]) => enabled)
      .map(([type, _]) => type);
    
    filteredMetrics = filteredMetrics.filter(metric => 
      enabledTypes.includes(metric.type)
    );

    // Filter by date range
    if (dateRange !== 'all') {
      const now = new Date();
      let startFilter;

      switch (dateRange) {
        case '7days':
          startFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30days':
          startFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90days':
          startFilter = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case '1year':
          startFilter = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        case 'custom':
          if (startDate && endDate) {
            startFilter = new Date(startDate);
            const endFilter = new Date(endDate);
            filteredMetrics = filteredMetrics.filter(metric => {
              const metricDate = new Date(metric.date);
              return metricDate >= startFilter && metricDate <= endFilter;
            });
            return filteredMetrics;
          }
          break;
      }

      if (startFilter) {
        filteredMetrics = filteredMetrics.filter(metric => 
          new Date(metric.date) >= startFilter
        );
      }
    }

    return filteredMetrics;
  };

  // Generate CSV data
  const generateCSV = (data) => {
    if (data.length === 0) return '';

    const headers = [
      'Date',
      'Type',
      'Value',
      'Unit',
      'Systolic',
      'Diastolic',
      'Total Cholesterol',
      'HDL',
      'LDL',
      'Notes'
    ];

    const rows = data.map(metric => [
      formatDate(metric.date),
      metric.type,
      metric.value || '',
      metric.unit || '',
      metric.systolic || '',
      metric.diastolic || '',
      metric.total || '',
      metric.hdl || '',
      metric.ldl || '',
      metric.notes || ''
    ]);

    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  };

  // Generate JSON data
  const generateJSON = (data) => {
    return JSON.stringify({
      exportDate: new Date().toISOString(),
      totalRecords: data.length,
      dateRange: dateRange,
      healthMetrics: data,
      ...(includeReports && uploadedReports.length > 0 && {
        reports: uploadedReports.map(report => ({
          id: report.id,
          fileName: report.fileName,
          uploadDate: report.uploadedAt || report.uploadDate,
          fileSize: report.fileSize,
          notes: report.notes
        }))
      })
    }, null, 2);
  };

  // Generate PDF report (basic text format)
  const generatePDFData = (data) => {
    let content = `HEALTH TRACKER REPORT\n`;
    content += `Generated: ${formatDate(new Date().toISOString())}\n`;
    content += `Total Records: ${data.length}\n\n`;

    // Group by type
    const groupedData = data.reduce((acc, metric) => {
      if (!acc[metric.type]) acc[metric.type] = [];
      acc[metric.type].push(metric);
      return acc;
    }, {});

    Object.entries(groupedData).forEach(([type, metrics]) => {
      content += `\n${type.toUpperCase()}\n`;
      content += '='.repeat(type.length) + '\n';
      
      metrics.forEach(metric => {
        content += `${formatDate(metric.date)}: `;
        
        switch (metric.type) {
          case 'bloodPressure':
            content += `${metric.systolic}/${metric.diastolic} mmHg`;
            break;
          case 'bloodSugar':
            content += `${metric.value} mg/dL`;
            break;
          case 'cholesterol':
            content += `Total: ${metric.total} mg/dL`;
            if (metric.hdl) content += `, HDL: ${metric.hdl}`;
            if (metric.ldl) content += `, LDL: ${metric.ldl}`;
            break;
          case 'weight':
            content += `${metric.value} kg`;
            break;
          case 'heartRate':
            content += `${metric.value} bpm`;
            break;
        }
        
        if (metric.notes) content += ` (${metric.notes})`;
        content += '\n';
      });
    });

    return content;
  };

  // Handle export
  const handleExport = async () => {
    setIsExporting(true);

    try {
      const filteredData = getFilteredData();
      
      if (filteredData.length === 0) {
        alert('No data to export with current filters');
        return;
      }

      let content, filename, mimeType;

      switch (exportFormat) {
        case 'csv':
          content = generateCSV(filteredData);
          filename = `health-data-${Date.now()}.csv`;
          mimeType = 'text/csv';
          break;
        case 'json':
          content = generateJSON(filteredData);
          filename = `health-data-${Date.now()}.json`;
          mimeType = 'application/json';
          break;
        case 'txt':
          content = generatePDFData(filteredData);
          filename = `health-report-${Date.now()}.txt`;
          mimeType = 'text/plain';
          break;
        default:
          throw new Error('Unsupported export format');
      }

      // Create and trigger download
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Show success message
      setTimeout(() => {
        alert('Data exported successfully!');
      }, 100);

    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleMetricToggle = (metricType) => {
    setSelectedMetrics(prev => ({
      ...prev,
      [metricType]: !prev[metricType]
    }));
  };

  const filteredData = getFilteredData();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Download className="h-5 w-5 text-blue-600" />
          <CardTitle>Export Health Data</CardTitle>
        </div>
        <CardDescription>
          Export your health data in various formats for backup or sharing with healthcare providers
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Export Format */}
        <div className="space-y-2">
          <Label>Export Format</Label>
          <Select value={exportFormat} onValueChange={setExportFormat}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="csv">CSV (Comma Separated Values)</SelectItem>
              <SelectItem value="json">JSON (JavaScript Object Notation)</SelectItem>
              <SelectItem value="txt">Text Report</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <Label>Date Range</Label>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Custom Date Range */}
        {dateRange === 'custom' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Metric Selection */}
        <div className="space-y-2">
          <Label>Health Metrics to Include</Label>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(selectedMetrics).map(([type, checked]) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type}
                  checked={checked}
                  onCheckedChange={() => handleMetricToggle(type)}
                />
                <Label htmlFor={type} className="text-sm capitalize">
                  {type.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Include Reports */}
        {uploadedReports.length > 0 && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeReports"
              checked={includeReports}
              onCheckedChange={setIncludeReports}
            />
            <Label htmlFor="includeReports">
              Include uploaded reports metadata ({uploadedReports.length} files)
            </Label>
          </div>
        )}

        {/* Preview */}
        <div className="space-y-2">
          <Label>Export Preview</Label>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Records to export:</span>
                <span className="ml-2">{filteredData.length}</span>
              </div>
              <div>
                <span className="font-medium">Format:</span>
                <span className="ml-2 uppercase">{exportFormat}</span>
              </div>
              <div>
                <span className="font-medium">Date range:</span>
                <span className="ml-2">
                  {dateRange === 'custom' && startDate && endDate
                    ? `${formatDate(startDate)} to ${formatDate(endDate)}`
                    : dateRange === 'all' 
                    ? 'All time'
                    : dateRange}
                </span>
              </div>
              <div>
                <span className="font-medium">Metrics:</span>
                <span className="ml-2">
                  {Object.values(selectedMetrics).filter(Boolean).length}/5 selected
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Export Button */}
        <Button
          onClick={handleExport}
          disabled={isExporting || filteredData.length === 0}
          className="w-full"
        >
          {isExporting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Exporting...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Export Health Data
            </>
          )}
        </Button>

        {filteredData.length === 0 && (
          <p className="text-sm text-red-600 text-center">
            No data matches your current filters. Please adjust your selection.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
