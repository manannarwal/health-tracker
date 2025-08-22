import { useState } from 'react';
import { FileText, Calendar, Download, Eye, Trash2, Search, Filter, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useHealthData } from '@/contexts/HealthDataContext';
import { formatDate, getRelativeTime } from '@/utils/healthDataUtils';

export default function ReportsManagement() {
  const { uploadedReports, deleteReport } = useHealthData();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('uploadDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Filter and sort reports
  const filteredAndSortedReports = uploadedReports
    .filter(report => 
      report.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (report.notes && report.notes.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'uploadDate':
          aValue = new Date(a.uploadedAt || a.uploadDate);
          bValue = new Date(b.uploadedAt || b.uploadDate);
          break;
        case 'fileName':
          aValue = a.fileName.toLowerCase();
          bValue = b.fileName.toLowerCase();
          break;
        case 'fileSize':
          aValue = a.fileSize || 0;
          bValue = b.fileSize || 0;
          break;
        default:
          aValue = a[sortBy];
          bValue = b[sortBy];
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return 'Unknown size';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Handle delete
  const handleDelete = (report) => {
    setSelectedReport(report);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedReport) {
      deleteReport(selectedReport.id);
      setShowDeleteDialog(false);
      setSelectedReport(null);
    }
  };

  // Handle preview
  const handlePreview = (report) => {
    if (report.filePath) {
      window.open(report.filePath, '_blank');
    } else {
      alert('File preview not available');
    }
  };

  // Handle download
  const handleDownload = (report) => {
    if (report.filePath) {
      const link = document.createElement('a');
      link.href = report.filePath;
      link.download = report.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('File download not available');
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Health Reports</CardTitle>
          <CardDescription>
            Manage your uploaded health reports and documents ({filteredAndSortedReports.length} of {uploadedReports.length})
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search reports and notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uploadDate">Upload Date</SelectItem>
                <SelectItem value="fileName">File Name</SelectItem>
                <SelectItem value="fileSize">File Size</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </Button>
          </div>

          {/* Reports List */}
          {filteredAndSortedReports.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {uploadedReports.length === 0 ? 'No reports uploaded yet' : 'No reports match your search'}
              </h3>
              <p className="text-gray-500">
                {uploadedReports.length === 0 
                  ? 'Upload your first health report to get started' 
                  : 'Try adjusting your search criteria'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAndSortedReports.map((report) => (
                <Card key={report.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">
                            {report.fileName}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <span>{formatFileSize(report.fileSize)}</span>
                            <span>•</span>
                            <Calendar className="h-3 w-3" />
                            <span>{getRelativeTime(report.uploadedAt || report.uploadDate)}</span>
                            <span className="hidden sm:inline">({formatDate(report.uploadedAt || report.uploadDate)})</span>
                          </div>
                          {report.notes && (
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                              {report.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handlePreview(report)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload(report)}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(report)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {/* Quick Stats */}
          {uploadedReports.length > 0 && (
            <div className="border-t pt-4 mt-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">{uploadedReports.length}</p>
                  <p className="text-sm text-gray-500">Total Reports</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {formatFileSize(uploadedReports.reduce((sum, report) => sum + (report.fileSize || 0), 0))}
                  </p>
                  <p className="text-sm text-gray-500">Total Size</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">
                    {uploadedReports.filter(r => {
                      const uploadDate = new Date(r.uploadedAt || r.uploadDate);
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return uploadDate > weekAgo;
                    }).length}
                  </p>
                  <p className="text-sm text-gray-500">This Week</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">
                    {new Set(uploadedReports.map(r => new Date(r.uploadedAt || r.uploadDate).toDateString())).size}
                  </p>
                  <p className="text-sm text-gray-500">Upload Days</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Report</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedReport?.fileName}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
