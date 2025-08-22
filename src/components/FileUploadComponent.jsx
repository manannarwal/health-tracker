import { useState, useRef } from 'react';
import { Upload, FileText, X, Eye, Download, Calendar, FileCheck, Brain, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useHealthData } from '@/contexts/HealthDataContext';
import { formatDate } from '@/utils/healthDataUtils';
import { extractTextFromPDF, extractHealthData, validateHealthData } from '@/utils/pdfExtraction';

export default function FileUploadComponent() {
  const { addReport, addHealthMetric } = useHealthData();
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [extractedData, setExtractedData] = useState([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef(null);

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop events
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  // Process uploaded files
  const handleFiles = (files) => {
    const validFiles = files.filter(file => {
      // Check if it's a PDF
      if (file.type !== 'application/pdf') {
        alert(`${file.name} is not a PDF file. Only PDF files are allowed.`);
        return false;
      }
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum file size is 10MB.`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length > 0) {
      processFiles(validFiles);
    }
  };

  // Process and upload files
  const processFiles = async (files) => {
    setIsUploading(true);
    setIsExtracting(true);
    const newFiles = [];
    const allExtractedData = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress(((i + 1) / files.length) * 100);

      try {
        // In a real app, you'd upload to a server here
        // For now, we'll simulate upload and store file info
        await simulateUpload(file);

        const fileData = {
          id: Date.now() + i,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadDate: new Date().toISOString(),
          // In a real app, this would be a URL to the uploaded file
          url: URL.createObjectURL(file),
          // Store the actual file for preview (in real app, this would be a server URL)
          file: file,
          extractedDataCount: 0,
          extractionStatus: 'processing'
        };

        newFiles.push(fileData);
        
        // Extract health data from PDF
        try {
          const extractedText = await extractTextFromPDF(file);
          const healthData = extractHealthData(extractedText, file.name);
          const validatedData = validateHealthData(healthData);
          
          // Update file data with extraction results
          fileData.extractedDataCount = validatedData.length;
          fileData.extractionStatus = validatedData.length > 0 ? 'success' : 'no-data';
          
          // Add extracted health metrics to the system
          validatedData.forEach(data => {
            addHealthMetric(data);
          });
          
          allExtractedData.push(...validatedData);
          
        } catch (extractionError) {
          console.error(`Failed to extract data from ${file.name}:`, extractionError);
          fileData.extractionStatus = 'error';
        }
        
        // Add to context
        addReport({
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          uploadDate: new Date().toISOString(),
          notes: fileData.extractedDataCount > 0 
            ? `Extracted ${fileData.extractedDataCount} health metrics` 
            : 'No health data extracted',
          // In a real app, store the server file path/URL
          filePath: fileData.url,
          extractedDataCount: fileData.extractedDataCount
        });

      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        alert(`Failed to upload ${file.name}. Please try again.`);
      }
    }

    setUploadedFiles(prev => [...prev, ...newFiles]);
    setExtractedData(prev => [...prev, ...allExtractedData]);
    setIsUploading(false);
    setIsExtracting(false);
    setUploadProgress(0);
    
    // Show success message
    if (allExtractedData.length > 0) {
      setTimeout(() => {
        alert(`Successfully extracted ${allExtractedData.length} health metrics from ${files.length} file(s)!`);
      }, 500);
    }
    
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Simulate file upload (replace with actual upload logic)
  const simulateUpload = (file) => {
    return new Promise((resolve) => {
      setTimeout(resolve, 500); // Simulate upload time
    });
  };

  // Remove uploaded file
  const removeFile = (fileId) => {
    setUploadedFiles(prev => {
      const updated = prev.filter(file => file.id !== fileId);
      // Clean up object URL to prevent memory leaks
      const fileToRemove = prev.find(file => file.id === fileId);
      if (fileToRemove && fileToRemove.url) {
        URL.revokeObjectURL(fileToRemove.url);
      }
      return updated;
    });
  };

  // Preview file
  const previewFile = (file) => {
    if (file.url) {
      window.open(file.url, '_blank');
    }
  };

  // Download file
  const downloadFile = (file) => {
    if (file.url) {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-gray-300 hover:border-gray-400"
        } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,application/pdf"
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-900">
            {isUploading ? 'Processing Files...' : 'Upload Health Reports'}
          </p>
          <p className="text-sm text-gray-500">
            {isExtracting ? 'Extracting health data from PDFs...' : 'Drag and drop PDF files here, or click to browse'}
          </p>
          <p className="text-xs text-gray-400">
            PDF files only, max 10MB each • Health data will be automatically extracted
          </p>
        </div>
        
        {isUploading && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {isExtracting ? 'Extracting health data...' : `${Math.round(uploadProgress)}% uploaded`}
            </p>
          </div>
        )}
        
        {!isUploading && (
          <Button variant="outline" className="mt-4" type="button">
            <Brain className="mr-2 h-4 w-4" />
            Choose Files & Extract Data
          </Button>
        )}
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-700">
            Uploaded Files ({uploadedFiles.length})
          </h4>
          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <Card key={file.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex flex-col items-center">
                      <FileCheck className="h-5 w-5 text-green-600 flex-shrink-0" />
                      {file.extractionStatus === 'success' && (
                        <Brain className="h-3 w-3 text-blue-600 mt-1" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{formatFileSize(file.size)}</span>
                        <span>•</span>
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(file.uploadDate)}</span>
                      </div>
                      {file.extractedDataCount > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span className="text-xs text-green-700">
                            {file.extractedDataCount} health metrics extracted
                          </span>
                        </div>
                      )}
                      {file.extractionStatus === 'no-data' && (
                        <div className="flex items-center gap-1 mt-1">
                          <AlertTriangle className="h-3 w-3 text-orange-500" />
                          <span className="text-xs text-orange-600">
                            No health data found
                          </span>
                        </div>
                      )}
                      {file.extractionStatus === 'error' && (
                        <div className="flex items-center gap-1 mt-1">
                          <X className="h-3 w-3 text-red-500" />
                          <span className="text-xs text-red-600">
                            Extraction failed
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => previewFile(file)}
                      className="h-8 w-8 p-0"
                      title="Preview"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => downloadFile(file)}
                      className="h-8 w-8 p-0"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      title="Remove"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Extracted Data Summary */}
      {extractedData.length > 0 && (
        <Card className="p-4 bg-green-50 dark:bg-green-900/20 border-green-200">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-900 dark:text-green-100">
                Health Data Extracted Successfully!
              </h4>
              <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                {extractedData.length} health metrics have been automatically added to your dashboard:
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {Array.from(new Set(extractedData.map(d => d.type))).map(type => (
                  <span 
                    key={type} 
                    className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 text-xs rounded-full"
                  >
                    {type.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </span>
                ))}
              </div>
              <p className="text-xs text-green-600 dark:text-green-300 mt-2">
                Visit your Dashboard to view and manage the extracted health data.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
