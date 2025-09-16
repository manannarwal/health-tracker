import { useState } from 'react';
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import ReportsPage from "./components/ReportsPage";
import AnalyticsPage from "./components/AnalyticsPage";
import ProfilePage from "./components/ProfilePage";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { HealthDataProvider } from "./contexts/HealthDataContext";
import { AuthProvider } from "./contexts/AuthContext";

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
      case 'profile':
        return <ProfilePage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AuthProvider>
      <HealthDataProvider>
        <ProtectedRoute>
          <div className="min-h-screen bg-background flex flex-col">
            <Navbar currentPage={currentPage} onPageChange={setCurrentPage} />
            <main className="flex-1 container mx-auto px-4 py-6">
              {renderCurrentPage()}
            </main>
            <Footer />
          </div>
        </ProtectedRoute>
      </HealthDataProvider>
    </AuthProvider>
  );
}

export default App;
