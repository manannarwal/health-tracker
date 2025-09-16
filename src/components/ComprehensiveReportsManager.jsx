import { useState, useEffect } from 'react';
import { FileText, Calendar, Eye, Edit2, Trash2, Download, Filter, Search, Plus, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useHealthData } from '@/contexts/HealthDataContext';
import { formatDate } from '@/utils/healthDataUtils';
import FileUploadComponent from './FileUploadComponent';

export default function ComprehensiveReportsManager() {
  const { uploadedReports, deleteReport } = useHealthData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  // Filter reports based on search and time period
  const filteredReports = uploadedReports.filter(report => {
    const matchesSearch = report.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (report.extractedData?.length || 0).toString().includes(searchTerm);
    
    if (!matchesSearch) return false;

    const reportDate = new Date(report.uploadDate);
    const now = new Date();
    
    switch (filterPeriod) {
      case 'week':
        return (now - reportDate) <= (7 * 24 * 60 * 60 * 1000);
      case 'month':
        return (now - reportDate) <= (30 * 24 * 60 * 60 * 1000);
      case '3months':
        return (now - reportDate) <= (90 * 24 * 60 * 60 * 1000);
      case 'year':
        return (now - reportDate) <= (365 * 24 * 60 * 60 * 1000);
      default:
        return true;
    }
  });

  const handleViewReport = (report) => {
    // Try to open the report in a new tab if we have file data
    if (report.url) {
      // If we have a blob URL, open it directly
      window.open(report.url, '_blank');
    } else if (report.file) {
      // If we have the file object, create a blob URL and open it
      const fileUrl = URL.createObjectURL(report.file);
      window.open(fileUrl, '_blank');
    } else if (report.fileName && report.fileName.toLowerCase().endsWith('.pdf')) {
      // Show a message that the file cannot be opened
      alert('Sorry, this PDF file cannot be opened. The original file may no longer be available.');
    } else {
      // For non-PDF files or if no file data is available, show a message
      alert('Cannot open this report. Only PDF files can be viewed directly.');
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (confirm('Are you sure you want to delete this report?')) {
      await deleteReport(reportId);
    }
  };

  const getParameterCount = (report) => {
    return report.extractedData?.length || 0;
  };

  const getReportStatus = (parameterCount) => {
    if (parameterCount === 0) return { text: 'No Data', color: 'bg-muted text-muted-foreground' };
    if (parameterCount < 5) return { text: 'Basic', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' };
    if (parameterCount < 10) return { text: 'Standard', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' };
    return { text: 'Comprehensive', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300' };
  };

  const getKeyParameters = (report) => {
    if (!report.extractedData || report.extractedData.length === 0) return [];
    
    const keyParams = report.extractedData
      .filter(param => ['glucose', 'totalCholesterol', 'tsh', 'vitaminD', 'hba1c'].includes(param.type))
      .slice(0, 3);
    
    return keyParams;
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Health Reports</h2>
          <p className="text-muted-foreground">Manage and view your comprehensive health reports</p>
        </div>
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Report
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload New Health Report</DialogTitle>
            </DialogHeader>
            <FileUploadComponent onUploadComplete={() => setShowUploadDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by filename or parameter count..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Grid */}
      {filteredReports.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No reports found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm || filterPeriod !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Upload your first health report to get started.'
              }
            </p>
            <Button onClick={() => setShowUploadDialog(true)} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Upload Report
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => {
            const parameterCount = getParameterCount(report);
            const status = getReportStatus(parameterCount);
            const keyParameters = getKeyParameters(report);

            return (
              <Card key={report.id} className="hover:shadow-lg transition-shadow border border-gray-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-indigo-600" />
                      <CardTitle className="text-sm font-medium truncate">
                        {report.fileName}
                      </CardTitle>
                    </div>
                    <Badge className={status.color}>{status.text}</Badge>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(report.uploadDate)}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Parameter Count */}
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-indigo-600">{parameterCount}</div>
                    <div className="text-sm text-gray-500">Health Parameters</div>
                  </div>

                  {/* Key Parameters Preview */}
                  {keyParameters.length > 0 && (
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">Key Parameters:</div>
                      <div className="space-y-1">
                        {keyParameters.map((param, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-600 capitalize">
                              {param.type.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className="font-medium">{param.value}</span>
                          </div>
                        ))}
                        {getParameterCount(report) > 3 && (
                          <div className="text-xs text-muted-foreground">
                            +{getParameterCount(report) - 3} more parameters
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleViewReport(report)}
                      size="sm"
                      className="flex-1"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View Report
                    </Button>
                    <Button
                      onClick={() => handleDeleteReport(report.id)}
                      size="sm"
                      variant="outline"
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
