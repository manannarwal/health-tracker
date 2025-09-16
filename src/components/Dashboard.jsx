import React from 'react';
import ComprehensiveHealthData from './ComprehensiveHealthData';
import UploadCard from './UploadCard';

export default function Dashboard() {

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Health Dashboard</h1>
        <p className="text-muted-foreground">
          Track and monitor your health metrics in one place
        </p>
      </div>

        <div className="space-y-8">
          {/* Add New Data Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">Add New Data</h2>
              <p className="text-muted-foreground">
                Upload health reports or enter metrics manually
              </p>
            </div>
            <UploadCard />
          </div>

          {/* Health Data Overview Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">Your Health Data</h2>
              <p className="text-muted-foreground">
                View and analyze all your health metrics with filtering options
              </p>
            </div>
            <ComprehensiveHealthData />
          </div>
        </div>
      </div>
  );
}
