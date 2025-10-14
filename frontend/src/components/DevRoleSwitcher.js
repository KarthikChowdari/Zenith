/**
 * Development Role Switcher Component
 * TEMPORARY: Only for testing - remove in production
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert,
  Box
} from '@mui/material';
import { useUserContext } from '../contexts/UserContext';

const DevRoleSwitcher = ({ open, onClose }) => {
  const {
    dbUser: user,
    updateUserRole,
    refreshUser,
  } = useUserContext();

  const [selectedRole, setSelectedRole] = useState(user?.role || localStorage.getItem('zenith_user_role') || 'beneficiary');

  const roles = [
    { value: 'admin', label: 'Admin - System Administrator' },
    { value: 'loan_officer', label: 'Loan Officer - Credit Assessment' },
    { value: 'bank_manager', label: 'Bank Manager - Portfolio Management' },
    { value: 'beneficiary', label: 'Beneficiary - Individual User' },
    { value: 'auditor', label: 'Auditor - Compliance & Risk' }
  ];

  const handleRoleChange = () => {
    // Update the user context with new role
    updateUserRole(selectedRole);

    // Persist role in localStorage using the key expected by UserContext
    localStorage.setItem('zenith_user_role', selectedRole);

    // Try to refresh user data from backend/context without full reload
    if (typeof refreshUser === 'function') {
      // best-effort refresh; if it fails the UI will still reflect updateUserRole
      try {
        refreshUser();
      } catch (e) {
        // ignore
      }
    }

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        🔧 Development Role Switcher
      </DialogTitle>
      
      <DialogContent>
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="subtitle2">
            <strong>Development Mode Only</strong>
          </Typography>
          <Typography variant="body2">
            This tool allows you to test different user roles. In production, roles are assigned by administrators.
          </Typography>
        </Alert>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Current User: {user?.firstName} {user?.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Email: {user?.email}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Current Role: <strong>{user?.role || 'beneficiary'}</strong>
          </Typography>
        </Box>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Select Role to Test</InputLabel>
          <Select
            value={selectedRole}
            label="Select Role to Test"
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            {roles.map((role) => (
              <MenuItem key={role.value} value={role.value}>
                {role.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Role Capabilities:</strong>
          </Typography>
          <Typography variant="caption" component="div">
            • <strong>Admin:</strong> User management, system settings, full access<br/>
            • <strong>Loan Officer:</strong> Credit assessment, beneficiary management<br/>
            • <strong>Bank Manager:</strong> Portfolio analytics, performance metrics<br/>
            • <strong>Beneficiary:</strong> Personal profile, credit score viewing<br/>
            • <strong>Auditor:</strong> Compliance reports, audit logs
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={handleRoleChange}
          variant="contained"
          disabled={selectedRole === user?.role}
        >
          Switch to {selectedRole.replace('_', ' ').toUpperCase()}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DevRoleSwitcher;