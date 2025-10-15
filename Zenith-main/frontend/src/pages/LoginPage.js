/**
 * Login Page for Project Zenith
 * Provides authentication interface for users
 */

import React from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
} from '@mui/material';
import {
  SignIn,
  SignedIn,
  SignedOut,
  useUser,
} from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Dashboard as DashboardIcon } from '@mui/icons-material';

const LoginPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  // Redirect to dashboard if already signed in
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 3,
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <SignedOut>
            {/* Header */}
            <Box mb={4}>
              <DashboardIcon
                sx={{
                  fontSize: 60,
                  color: 'primary.main',
                  mb: 2,
                }}
              />
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Project Zenith
              </Typography>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Dynamic Credit Scoring System
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Sign in to access the credit scoring dashboard
              </Typography>
            </Box>

            {/* Clerk Sign In Component */}
            <Box display="flex" justifyContent="center">
              <SignIn
                appearance={{
                  elements: {
                    rootBox: {
                      width: '100%',
                    },
                    card: {
                      boxShadow: 'none',
                      border: 'none',
                    },
                  },
                }}
                redirectUrl="/dashboard"
                signUpUrl="/signup"
              />
            </Box>
          </SignedOut>

          <SignedIn>
            <Box>
              <Typography variant="h5" gutterBottom>
                Welcome back!
              </Typography>
              <Typography variant="body1" color="textSecondary" paragraph>
                Redirecting to dashboard...
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/dashboard')}
                startIcon={<DashboardIcon />}
              >
                Go to Dashboard
              </Button>
            </Box>
          </SignedIn>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;