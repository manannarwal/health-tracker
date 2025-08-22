import { useState } from 'react';
import { Heart, Droplet, TrendingUp, Scale, Activity, Edit, Trash2, Calendar, StickyNote, MoreVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatDate, getRelativeTime } from '@/utils/healthDataUtils';
import { useHealthData } from '@/contexts/HealthDataContext';
import EditHealthMetricDialog from './EditHealthMetricDialog';

export default function HealthMetricCard({ metric }) {
  const { deleteHealthMetric } = useHealthData();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Get icon and color for metric type
  const getMetricIcon = (type) => {
    switch (type) {
      case 'bloodPressure': return Heart;
      case 'bloodSugar': return Droplet;
      case 'cholesterol': return TrendingUp;
      case 'weight': return Scale;
      case 'heartRate': return Activity;
      default: return Activity;
    }
  };

  const getMetricColor = (type) => {
    switch (type) {
      case 'bloodPressure': return 'text-red-500';
      case 'bloodSugar': return 'text-blue-500';
      case 'cholesterol': return 'text-green-500';
      case 'weight': return 'text-purple-500';
      case 'heartRate': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  const getMetricDisplayName = (type) => {
    switch (type) {
      case 'bloodPressure': return 'Blood Pressure';
      case 'bloodSugar': return 'Blood Sugar';
      case 'cholesterol': return 'Cholesterol';
      case 'weight': return 'Weight';
      case 'heartRate': return 'Heart Rate';
      default: return 'Health Metric';
    }
  };

  const formatMetricValue = (metric) => {
    switch (metric.type) {
      case 'bloodPressure':
        return `${metric.systolic}/${metric.diastolic}`;
      case 'bloodSugar':
        return `${metric.value} mg/dL`;
      case 'cholesterol':
        return `${metric.total} mg/dL`;
      case 'weight':
        return `${metric.value} kg`;
      case 'heartRate':
        return `${metric.value} bpm`;
      default:
        return metric.value;
    }
  };

  const handleDelete = () => {
    deleteHealthMetric(metric.id);
    setShowDeleteDialog(false);
  };

  const IconComponent = getMetricIcon(metric.type);
  const metricColor = getMetricColor(metric.type);
  const displayName = getMetricDisplayName(metric.type);
  const displayValue = formatMetricValue(metric);

  return (
    <>
      <Card className="hover:shadow-md transition-shadow relative group">
        <CardContent className="p-4">
          {/* Header with icon and actions */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <IconComponent className={`h-4 w-4 ${metricColor}`} />
              <span className="font-medium text-sm">{displayName}</span>
            </div>
            
            {/* Actions dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Main value */}
          <div className="mb-3">
            <p className="text-2xl font-bold">{displayValue}</p>
          </div>

          {/* Additional info for cholesterol */}
          {metric.type === 'cholesterol' && (metric.hdl || metric.ldl) && (
            <div className="text-xs text-muted-foreground mb-2 space-y-1">
              {metric.hdl && <div>HDL: {metric.hdl} mg/dL</div>}
              {metric.ldl && <div>LDL: {metric.ldl} mg/dL</div>}
            </div>
          )}

          {/* Date */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Calendar className="h-3 w-3" />
            <span>{getRelativeTime(metric.date)}</span>
            <span className="text-gray-400">•</span>
            <span>{formatDate(metric.date)}</span>
          </div>

          {/* Notes */}
          {metric.notes && (
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <StickyNote className="h-3 w-3 mt-0.5 flex-shrink-0" />
              <p className="italic line-clamp-2">{metric.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {showEditDialog && (
        <EditHealthMetricDialog
          metric={metric}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Health Metric</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {displayName.toLowerCase()} reading from {formatDate(metric.date)}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
