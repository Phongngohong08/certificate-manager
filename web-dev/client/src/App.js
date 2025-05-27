import React from 'react';
import { createBrowserRouter, RouterProvider, Routes, Route, Navigate, Outlet } from 'react-router-dom';

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

// Layout component
const Layout = () => (
  <div className="app-container">
    <Navigation />
    <main className="flex-grow-1 py-3">
      <Outlet />
    </main>
    <Footer />
  </div>
);

// Router configuration with future flags
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <Layout />
      </AuthProvider>
    ),
    children: [
      // Public Routes
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "verify", element: <VerifyPage /> },
      
      // Student Routes
      {
        path: "student",
        element: <ProtectedRoute userTypeRequired="student" />,
        children: [
          { path: "dashboard", element: <StudentDashboard /> },
          { path: "certificates", element: <CertificatesListPage /> },
          { path: "certificates/:id", element: <CertificateDetailsPage /> },
          { path: "profile", element: <StudentProfilePage /> },
        ],
      },
      
      // University Routes
      {
        path: "university",
        element: <ProtectedRoute userTypeRequired="university" />,
        children: [
          { path: "dashboard", element: <UniversityDashboard /> },
          { path: "certificates", element: <CertificatesListPage /> },
          { path: "certificates/:id", element: <CertificateDetailsPage /> },
          { path: "issue", element: <IssueCertificatePage /> },
          { path: "profile", element: <UniversityProfilePage /> },
        ],
      },
      
      // Redirect invalid paths to home
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
});

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
