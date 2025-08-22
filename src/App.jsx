import { useState } from 'react';
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import ReportsPage from "./components/ReportsPage";
import AnalyticsPage from "./components/AnalyticsPage";
import Footer from "./components/Footer";
import { HealthDataProvider } from "./contexts/HealthDataContext";

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'reports':
        return <ReportsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <HealthDataProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar currentPage={currentPage} onPageChange={setCurrentPage} />
        <main className="flex-1 container mx-auto px-4 py-6">
          {renderCurrentPage()}
        </main>
        <Footer />
      </div>
    </HealthDataProvider>
  );
}

export default App;
