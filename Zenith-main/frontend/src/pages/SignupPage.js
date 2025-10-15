/**
 * Signup Page for Project Zenith
 * Provides user registration interface
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
  SignUp,
  SignedIn,
  SignedOut,
  useUser,
} from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Dashboard as DashboardIcon, PersonAdd } from '@mui/icons-material';

const SignupPage = () => {
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
        background: 'linear-gradient(135deg, #dc004e 0%, #ff5983 100%)',
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
              <PersonAdd
                sx={{
                  fontSize: 60,
                  color: 'secondary.main',
                  mb: 2,
                }}
              />
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Join Project Zenith
              </Typography>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Create Your Account
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Get access to the dynamic credit scoring platform
              </Typography>
            </Box>

            {/* Clerk Sign Up Component */}
            <Box display="flex" justifyContent="center">
              <SignUp
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
                signInUrl="/login"
              />
            </Box>
          </SignedOut>

          <SignedIn>
            <Box>
              <Typography variant="h5" gutterBottom>
                Account created successfully!
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

export default SignupPage;