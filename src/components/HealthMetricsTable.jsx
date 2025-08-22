import { useState } from 'react';
import { Search, Filter, SortAsc, SortDesc, Calendar, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useHealthData } from '@/contexts/HealthDataContext';
import { formatDate, getRelativeTime } from '@/utils/healthDataUtils';
import HealthMetricCard from './HealthMetricCard';

export default function HealthMetricsTable() {
  const { healthMetrics } = useHealthData();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'

  // Filter and sort metrics
  const filteredAndSortedMetrics = healthMetrics
    .filter(metric => {
      const matchesSearch = metric.notes?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          getMetricDisplayName(metric.type).toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || metric.type === typeFilter;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'type':
          aValue = getMetricDisplayName(a.type);
          bValue = getMetricDisplayName(b.type);
          break;
        case 'value':
          aValue = getNumericValue(a);
          bValue = getNumericValue(b);
          break;
        default:
          aValue = a[sortBy];
          bValue = b[sortBy];
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  // Helper functions
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

  const getNumericValue = (metric) => {
    switch (metric.type) {
      case 'bloodPressure':
        return metric.systolic;
      case 'bloodSugar':
      case 'weight':
      case 'heartRate':
        return metric.value;
      case 'cholesterol':
        return metric.total;
      default:
        return 0;
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Health Metrics</CardTitle>
            <CardDescription>
              Manage and view all your health data ({filteredAndSortedMetrics.length} of {healthMetrics.length} entries)
            </CardDescription>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'cards' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('cards')}
            >
              Cards
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              Table
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search metrics and notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="bloodPressure">Blood Pressure</SelectItem>
              <SelectItem value="bloodSugar">Blood Sugar</SelectItem>
              <SelectItem value="cholesterol">Cholesterol</SelectItem>
              <SelectItem value="weight">Weight</SelectItem>
              <SelectItem value="heartRate">Heart Rate</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
              {sortOrder === 'asc' ? <SortAsc className="h-4 w-4 mr-2" /> : <SortDesc className="h-4 w-4 mr-2" />}
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="type">Type</SelectItem>
              <SelectItem value="value">Value</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Content */}
        {filteredAndSortedMetrics.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {healthMetrics.length === 0 
                ? 'No health metrics found. Add your first metric above!' 
                : 'No metrics match your search criteria.'}
            </p>
          </div>
        ) : viewMode === 'cards' ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedMetrics.map((metric) => (
              <HealthMetricCard key={metric.id} metric={metric} />
            ))}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50" 
                    onClick={() => handleSort('type')}
                  >
                    Type {sortBy === 'type' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50" 
                    onClick={() => handleSort('value')}
                  >
                    Value {sortBy === 'value' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50" 
                    onClick={() => handleSort('date')}
                  >
                    Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedMetrics.map((metric) => (
                  <TableRow key={metric.id}>
                    <TableCell className="font-medium">
                      {getMetricDisplayName(metric.type)}
                    </TableCell>
                    <TableCell>{formatMetricValue(metric)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">{formatDate(metric.date)}</span>
                        <span className="text-xs text-muted-foreground">
                          {getRelativeTime(metric.date)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      {metric.notes && (
                        <p className="text-sm text-muted-foreground truncate">
                          {metric.notes}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
