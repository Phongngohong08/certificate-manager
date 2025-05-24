import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Style imports
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import './styles/custom.css';

// Context providers
import { AuthProvider } from './contexts/AuthContext';

// Components
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyPage from './pages/VerifyPage';
import StudentDashboard from './pages/StudentDashboard';
import UniversityDashboard from './pages/UniversityDashboard';
import IssueCertificatePage from './pages/IssueCertificatePage';
import CertificatesListPage from './pages/CertificatesListPage';
import CertificateDetailsPage from './pages/CertificateDetailsPage';
import StudentProfilePage from './pages/StudentProfilePage';
import UniversityProfilePage from './pages/UniversityProfilePage';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Navigation />
          <main className="flex-grow-1 py-3">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify" element={<VerifyPage />} />
              
              {/* Student Routes */}
              <Route path="/student" element={<ProtectedRoute userTypeRequired="student" />}>
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="certificates" element={<CertificatesListPage />} />
                <Route path="certificates/:id" element={<CertificateDetailsPage />} />
                <Route path="profile" element={<StudentProfilePage />} />
              </Route>
              
              {/* University Routes */}
              <Route path="/university" element={<ProtectedRoute userTypeRequired="university" />}>
                <Route path="dashboard" element={<UniversityDashboard />} />
                <Route path="certificates" element={<CertificatesListPage />} />
                <Route path="certificates/:id" element={<CertificateDetailsPage />} />
                <Route path="issue" element={<IssueCertificatePage />} />
                <Route path="profile" element={<UniversityProfilePage />} />
              </Route>
              
              {/* Redirect invalid paths to home */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
