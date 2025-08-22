import { FileText, Upload, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FileUploadComponent from './FileUploadComponent';
import ReportsManagement from './ReportsManagement';
import { useHealthData } from '@/contexts/HealthDataContext';

export default function ReportsPage() {
  const { uploadedReports } = useHealthData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Health Reports</h1>
        <p className="text-muted-foreground">
          Upload, manage, and organize your health documents and lab reports
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uploadedReports.length}</div>
            <p className="text-xs text-muted-foreground">
              Documents uploaded
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(() => {
                const totalSize = uploadedReports.reduce((sum, report) => sum + (report.fileSize || 0), 0);
                const mb = totalSize / (1024 * 1024);
                return mb < 1 ? `${Math.round(totalSize / 1024)} KB` : `${mb.toFixed(1)} MB`;
              })()}
            </div>
            <p className="text-xs text-muted-foreground">
              Total file size
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Uploads</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(() => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return uploadedReports.filter(r => {
                  const uploadDate = new Date(r.uploadedAt || r.uploadDate);
                  return uploadDate > weekAgo;
                }).length;
              })()}
            </div>
            <p className="text-xs text-muted-foreground">
              Last 7 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="upload" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upload">Upload Reports</TabsTrigger>
          <TabsTrigger value="manage">Manage Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Health Reports</CardTitle>
              <CardDescription>
                Upload your health documents, lab reports, and medical records. Only PDF files are supported.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploadComponent />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="manage" className="space-y-4">
          <ReportsManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
