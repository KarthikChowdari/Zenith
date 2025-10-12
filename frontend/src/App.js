/**
 * Main App Component for Project Zenith
 * Entry point for the React application with role-based routing and authentication
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// Context Providers
import { UserProvider } from './contexts/UserContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Import pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';

// Import new role-based pages
import AdminDashboard from './pages/admin/AdminDashboard';
import LoanOfficerDashboard from './pages/loan-officer/LoanOfficerDashboard';
import BeneficiaryDashboard from './pages/beneficiary/BeneficiaryDashboard';
import BankManagerDashboard from './pages/bank-manager/BankManagerDashboard';

// Import components
import ProtectedRoute from './components/ProtectedRoute';
import {
  AdminRoute,
  LoanOfficerRoute,
  BeneficiaryRoute,
  BankManagerRoute,
  DashboardRedirect
} from './components/RoleBasedRoute';

// Create custom theme for Project Zenith
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff5983',
      dark: '#9a0036',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    error: {
      main: '#f44336',
      light: '#ef5350',
      dark: '#d32f2f',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 24px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <UserProvider>
          <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              
              {/* Smart Dashboard Redirect */}
              <Route path="/dashboard" element={<DashboardRedirect />} />
              
              {/* Legacy Dashboard (fallback) */}
              <Route 
                path="/legacy-dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Role-Based Dashboard Routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />
              
              <Route 
                path="/officer/dashboard" 
                element={
                  <LoanOfficerRoute>
                    <LoanOfficerDashboard />
                  </LoanOfficerRoute>
                } 
              />
              
              <Route 
                path="/beneficiary/dashboard" 
                element={
                  <BeneficiaryRoute>
                    <BeneficiaryDashboard />
                  </BeneficiaryRoute>
                } 
              />
              
              <Route 
                path="/manager/dashboard" 
                element={
                  <BankManagerRoute>
                    <BankManagerDashboard />
                  </BankManagerRoute>
                } 
              />
              
              {/* Additional Role-Based Routes */}
              <Route 
                path="/admin/*" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />
              
              <Route 
                path="/officer/*" 
                element={
                  <LoanOfficerRoute>
                    <LoanOfficerDashboard />
                  </LoanOfficerRoute>
                } 
              />
              
              <Route 
                path="/beneficiary/*" 
                element={
                  <BeneficiaryRoute>
                    <BeneficiaryDashboard />
                  </BeneficiaryRoute>
                } 
              />
              
              {/* Fallback Route */}
              <Route path="*" element={<DashboardRedirect />} />
            </Routes>
          </div>
        </Router>
      </UserProvider>
    </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;