/**
 * Landing Page for Project Zenith
 * Public page that introduces the system and provides login/signup options
 */

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Chip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  TrendingUp,
  Security,
  Speed,
  Lightbulb,
  Login,
  PersonAdd,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      title: 'Dynamic Credit Scoring',
      description: 'Real-time credit assessment with ML-powered scoring engine that adapts and learns continuously.',
    },
    {
      icon: <Lightbulb sx={{ fontSize: 40 }} />,
      title: 'Score Simulator',
      description: 'Interactive "What-If" tool showing how future actions can improve credit scores.',
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: 'Risk Assessment',
      description: 'Intelligent risk-need matrix for automated loan approval decisions.',
    },
    {
      icon: <Speed sx={{ fontSize: 40 }} />,
      title: 'Instant Processing',
      description: 'Get credit scores and explanations in real-time with our high-performance API.',
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh' }}>
      {/* Navigation Bar */}
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <DashboardIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Project Zenith
          </Typography>
          
          <SignedOut>
            <Button
              color="inherit"
              onClick={() => navigate('/login')}
              startIcon={<Login />}
              sx={{ mr: 1 }}
            >
              Login
            </Button>
            <Button
              color="inherit"
              variant="outlined"
              onClick={() => navigate('/signup')}
              startIcon={<PersonAdd />}
              sx={{ borderColor: 'white', '&:hover': { borderColor: 'white' } }}
            >
              Sign Up
            </Button>
          </SignedOut>
          
          <SignedIn>
            <Button
              color="inherit"
              onClick={() => navigate('/dashboard')}
              sx={{ mr: 2 }}
            >
              Dashboard
            </Button>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          
          
          <Typography variant="h2" fontWeight="bold" gutterBottom>
            Dynamic Credit Scoring & Guidance System
          </Typography>
          
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            AI-powered credit assessment with real-time scoring and personalized financial guidance
          </Typography>
          
          <Box sx={{ mt: 4 }}>
            <SignedOut>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/signup')}
                sx={{
                  mr: 2,
                  backgroundColor: 'white',
                  color: 'primary.main',
                  '&:hover': { backgroundColor: 'grey.100' },
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                }}
                startIcon={<PersonAdd />}
              >
                Get Started
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' },
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                }}
                startIcon={<Login />}
              >
                Login
              </Button>
            </SignedOut>
            
            <SignedIn>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/dashboard')}
                sx={{
                  backgroundColor: 'white',
                  color: 'primary.main',
                  '&:hover': { backgroundColor: 'grey.100' },
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                }}
                startIcon={<DashboardIcon />}
              >
                Go to Dashboard
              </Button>
            </SignedIn>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" textAlign="center" fontWeight="bold" gutterBottom>
          Key Features
        </Typography>
        
        <Typography variant="h6" textAlign="center" color="textSecondary" paragraph sx={{ mb: 6 }}>
          Revolutionizing credit assessment with AI and machine learning
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card elevation={3} sx={{ height: '100%', p: 2 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Box color="primary.main" mr={2}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" fontWeight="bold">
                      {feature.title}
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="textSecondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ backgroundColor: 'grey.100', py: 6 }}>
        <Container maxWidth="md" textAlign="center">
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Ready to Transform Credit Scoring?
          </Typography>
          
          <Typography variant="h6" color="textSecondary" paragraph>
            Join the future of financial inclusion with Project Zenith
          </Typography>
          
          <SignedOut>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/signup')}
              sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
              startIcon={<PersonAdd />}
            >
              Start Free Trial
            </Button>
          </SignedOut>
          
          <SignedIn>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/dashboard')}
              sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
              startIcon={<DashboardIcon />}
            >
              Access Dashboard
            </Button>
          </SignedIn>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          backgroundColor: 'grey.900',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Typography variant="body2">
          Project Zenith - Dynamic Credit Scoring & Guidance System | 
          Powered by AI & Machine Learning | 
          Built for Social Impact
        </Typography>
      </Box>
    </Box>
  );
};

export default LandingPage;