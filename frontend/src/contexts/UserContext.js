/**
 * User Context for Project Zenith
 * Manages user authentication, roles, and permissions with enhanced Clerk integration
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { api } from '../api/api';

const UserContext = createContext();

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync Clerk user with database user
  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded) return;
      
      setLoading(true);
      setError(null);

      try {
        if (isSignedIn && user) {
          // Check if user exists in database
          const response = await api.get(`/users/clerk/${user.id}`);
          
          if (response.data.needs_registration) {
            // User doesn't exist, sync them
            const syncData = {
              clerk_user_id: user.id,
              email: user.primaryEmailAddress?.emailAddress,
              first_name: user.firstName || '',
              last_name: user.lastName || '',
            };

            await api.post('/users/sync-clerk', syncData);
            
            // Fetch the newly created user
            const newUserResponse = await api.get(`/users/clerk/${user.id}`);
            setDbUser(newUserResponse.data.user);
          } else {
            // User exists, use the data
            setDbUser(response.data.user);
          }
        } else {
          setDbUser(null);
        }
      } catch (err) {
        console.error('Error syncing user:', err);
        setError('Failed to sync user with database');
        setDbUser(null);
      } finally {
        setLoading(false);
      }
    };

    syncUser();
  }, [user, isLoaded, isSignedIn]);

  // Refresh user data from database
  const refreshUser = async () => {
    if (user?.id) {
      try {
        const response = await api.get(`/users/clerk/${user.id}`);
        setDbUser(response.data.user);
      } catch (err) {
        console.error('Error refreshing user data:', err);
      }
    }
  };

  // Role checking functions
  const hasRole = (role) => {
    return dbUser?.role === role;
  };

  const hasAnyRole = (roles) => {
    return roles.includes(dbUser?.role);
  };

  const hasPermission = (permission) => {
    return dbUser?.permissions?.includes(permission) || false;
  };

  // Convenience role checkers
  const isAdmin = () => hasRole('admin');
  const isLoanOfficer = () => hasRole('loan_officer');
  const isBeneficiary = () => hasRole('beneficiary');
  const isBankManager = () => hasRole('bank_manager');
  const isAuditor = () => hasRole('auditor');

  // Permission checkers
  const canManageUsers = () => hasPermission('manage_users');
  const canManageBeneficiaries = () => hasAnyRole(['admin', 'loan_officer', 'bank_manager']);
  const canViewReports = () => hasAnyRole(['admin', 'loan_officer', 'bank_manager', 'auditor']);
  const canProcessLoans = () => hasAnyRole(['admin', 'loan_officer']);
  const canViewOwnData = () => hasAnyRole(['beneficiary']) || hasPermission('view_own_profile');
  const canViewAllBeneficiaries = () => hasPermission('view_all_beneficiaries');
  const canManageSystemSettings = () => hasPermission('manage_system_settings');

  const value = {
    // User data
    clerkUser: user,
    dbUser,
    isLoaded,
    isSignedIn,
    loading,
    error,

    // Role checking functions
    hasRole,
    hasAnyRole,
    hasPermission,
    isAdmin,
    isLoanOfficer,
    isBeneficiary,
    isBankManager,
    isAuditor,

    // Permission checking functions
    canManageUsers,
    canManageBeneficiaries,
    canViewReports,
    canProcessLoans,
    canViewOwnData,
    canViewAllBeneficiaries,
    canManageSystemSettings,

    // Helper functions
    refreshUser,
    updateUserRole: (newRole) => {
      if (dbUser) {
        const updatedUser = { ...dbUser, role: newRole };
        setDbUser(updatedUser);
        
        // Also update localStorage for persistence
        localStorage.setItem('zenith_user_role', newRole);
      }
    },

    // Helper data
    userDisplayName: dbUser ? `${dbUser.first_name} ${dbUser.last_name}`.trim() : 
                     user?.fullName || user?.primaryEmailAddress?.emailAddress || 'User',
    userRole: dbUser?.role || 'guest',
    userEmail: dbUser?.email || user?.primaryEmailAddress?.emailAddress || '',
    isAuthenticated: isSignedIn && !!dbUser,
    permissions: dbUser?.permissions || []
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;