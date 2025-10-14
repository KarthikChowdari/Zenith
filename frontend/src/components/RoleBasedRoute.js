/**
 * Role-Based Route Component for Project Zenith
 * Redirects users to appropriate dashboards based on their roles
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';
import {
  Box,
  CircularProgress,
  Typography,
  Alert,
} from '@mui/material';

const RoleBasedRoute = ({ children, allowedRoles, fallbackPath = '/dashboard' }) => {
  const { dbUser, loading, error, hasAnyRole, isSignedIn, isLoaded } = useUserContext();
  const location = useLocation();

  // Show loading while authentication is being determined
  if (!isLoaded || loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="grey.50"
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  // Redirect to login if not signed in
  if (!isSignedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Show error if there was a problem loading user data
  if (error) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="grey.50"
        p={3}
      >
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading user data: {error}
        </Alert>
        <Typography variant="body2">
          Please try refreshing the page or contact support.
        </Typography>
      </Box>
    );
  }

  // Check if user has required role
  if (allowedRoles && !hasAnyRole(allowedRoles)) {
    return <Navigate to={fallbackPath} replace />;
  }

  // User is authenticated and has the required role
  return children;
};

/**
 * Route component specifically for admin access
 */
export const AdminRoute = ({ children }) => {
  return (
    <RoleBasedRoute allowedRoles={['admin']} fallbackPath="/dashboard">
      {children}
    </RoleBasedRoute>
  );
};

/**
 * Route component for loan officers and admins
 */
export const LoanOfficerRoute = ({ children }) => {
  return (
    <RoleBasedRoute allowedRoles={['admin', 'loan_officer']} fallbackPath="/dashboard">
      {children}
    </RoleBasedRoute>
  );
};

/**
 * Route component for beneficiaries
 */
export const BeneficiaryRoute = ({ children }) => {
  return (
    <RoleBasedRoute allowedRoles={['beneficiary']} fallbackPath="/officer/dashboard">
      {children}
    </RoleBasedRoute>
  );
};

/**
 * Route component for bank managers and admins
 */
export const BankManagerRoute = ({ children }) => {
  return (
    <RoleBasedRoute allowedRoles={['admin', 'bank_manager']} fallbackPath="/dashboard">
      {children}
    </RoleBasedRoute>
  );
};

/**
 * Route component for auditors and admins
 */
export const AuditorRoute = ({ children }) => {
  return (
    <RoleBasedRoute allowedRoles={['admin', 'auditor']} fallbackPath="/dashboard">
      {children}
    </RoleBasedRoute>
  );
};

/**
 * Smart dashboard redirect based on user role
 */
export const DashboardRedirect = () => {
  const { dbUser, loading, isSignedIn, isLoaded } = useUserContext();

  if (!isLoaded || loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on user role
  switch (dbUser?.role) {
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    case 'loan_officer':
      return <Navigate to="/officer/dashboard" replace />;
    case 'beneficiary':
      return <Navigate to="/beneficiary/dashboard" replace />;
    case 'bank_manager':
      return <Navigate to="/manager/dashboard" replace />;
    case 'auditor':
      return <Navigate to="/auditor/dashboard" replace />;
    default:
      // Default to legacy dashboard for unknown/guest roles to avoid accidental beneficiary routing
      return <Navigate to="/legacy-dashboard" replace />;
  }
};

export default RoleBasedRoute;