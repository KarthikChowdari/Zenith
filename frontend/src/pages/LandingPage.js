import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  TrendingUp,
  Security,
  Speed,
  Lightbulb,
  Login,
  PersonAdd,
  CheckCircle,
  Star,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

const FeatureCard = ({ icon, title, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <Card
        sx={{
          height: '100%',
          background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 12px 32px rgba(33, 150, 243, 0.15)',
          },
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #2196f3 0%, #03a9f4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
              boxShadow: '0 8px 24px rgba(33, 150, 243, 0.3)',
            }}
          >
            {React.cloneElement(icon, {
              sx: { fontSize: 32, color: 'white' },
            })}
          </Box>
          <Typography
            variant="h6"
            fontWeight="700"
            gutterBottom
            sx={{ color: '#1e293b' }}
          >
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.7 }}>
            {description}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const StatItem = ({ value, label, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <Box textAlign="center">
        <Typography
          variant="h3"
          fontWeight="800"
          sx={{
            background: 'linear-gradient(135deg, #fff 0%, #e3f2fd 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
          }}
        >
          {value}
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
          {label}
        </Typography>
      </Box>
    </motion.div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <TrendingUp />,
      title: 'Dynamic Credit Scoring',
      description: 'Real-time credit assessment with ML-powered scoring engine that adapts and learns continuously from financial behaviors and patterns.',
    },
    {
      icon: <Lightbulb />,
      title: 'Score Simulator',
      description: 'Interactive "What-If" tool showing how future actions can improve credit scores with personalized recommendations.',
    },
    {
      icon: <Security />,
      title: 'Risk Assessment',
      description: 'Intelligent risk-need matrix for automated loan approval decisions with comprehensive security measures.',
    },
    {
      icon: <Speed />,
      title: 'Instant Processing',
      description: 'Get credit scores and explanations in real-time with our high-performance API and advanced algorithms.',
    },
  ];

  const benefits = [
    'AI-powered credit analysis',
    'Real-time score updates',
    'Personalized financial guidance',
    'Automated loan processing',
    'Secure data encryption',
    'Comprehensive reporting',
  ];

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <AppBar
        position="fixed"
        elevation={scrolled ? 4 : 0}
        sx={{
          background: scrolled
            ? 'rgba(255, 255, 255, 0.95)'
            : 'rgba(255, 255, 255, 0)',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          transition: 'all 0.3s',
          borderBottom: scrolled ? '1px solid rgba(0,0,0,0.08)' : 'none',
        }}
      >
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #2196f3 0%, #03a9f4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
              }}
            >
              <DashboardIcon sx={{ color: 'white' }} />
            </Box>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 800,
                background: scrolled
                  ? 'linear-gradient(135deg, #2196f3 0%, #03a9f4 100%)'
                  : 'linear-gradient(135deg, #fff 0%, #e3f2fd 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Project Zenith
            </Typography>
          </Box>

          <SignedOut>
            <Button
              onClick={() => navigate('/login')}
              startIcon={<Login />}
              sx={{
                mr: 2,
                color: scrolled ? '#2196f3' : 'white',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: scrolled ? 'rgba(33, 150, 243, 0.08)' : 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Login
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/signup')}
              startIcon={<PersonAdd />}
              sx={{
                background: 'linear-gradient(135deg, #2196f3 0%, #03a9f4 100%)',
                boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
                px: 3,
                '&:hover': {
                  background: 'linear-gradient(135deg, #1976d2 0%, #0288d1 100%)',
                  boxShadow: '0 6px 16px rgba(33, 150, 243, 0.4)',
                },
              }}
            >
              Sign Up
            </Button>
          </SignedOut>

          <SignedIn>
            <Button
              onClick={() => navigate('/dashboard')}
              sx={{
                mr: 2,
                color: scrolled ? '#2196f3' : 'white',
                fontWeight: 600,
              }}
            >
              Dashboard
            </Button>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          position: 'relative',
          background: 'linear-gradient(135deg, #1e88e5 0%, #1976d2 50%, #0288d1 100%)',
          pt: { xs: 15, md: 18 },
          pb: { xs: 10, md: 15 },
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage:
              'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box textAlign="center" sx={{ mb: 6 }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Box sx={{ display: 'inline-block', mb: 3 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      px: 3,
                      py: 1,
                      borderRadius: '50px',
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Star sx={{ fontSize: 18 }} /> Powered by AI & Machine Learning
                  </Typography>
                </Box>
              </motion.div>

              <Typography
                variant="h1"
                fontWeight="800"
                gutterBottom
                sx={{
                  color: 'white',
                  fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                  lineHeight: 1.2,
                  mb: 3,
                }}
              >
                Dynamic Credit Scoring &<br />
                Financial Guidance System
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  color: 'rgba(255, 255, 255, 0.95)',
                  maxWidth: '800px',
                  mx: 'auto',
                  mb: 5,
                  lineHeight: 1.6,
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  fontWeight: 400,
                }}
              >
                AI-powered credit assessment with real-time scoring and personalized
                financial guidance for better lending decisions
              </Typography>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <SignedOut>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/signup')}
                      startIcon={<PersonAdd />}
                      sx={{
                        background: 'white',
                        color: '#2196f3',
                        px: 5,
                        py: 2,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        borderRadius: '12px',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                        '&:hover': {
                          background: '#f5f5f5',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)',
                        },
                      }}
                    >
                      Get Started Free
                    </Button>

                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate('/login')}
                      startIcon={<Login />}
                      sx={{
                        borderColor: 'white',
                        color: 'white',
                        borderWidth: '2px',
                        px: 5,
                        py: 2,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        borderRadius: '12px',
                        '&:hover': {
                          borderWidth: '2px',
                          borderColor: 'white',
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      Login
                    </Button>
                  </SignedOut>

                  <SignedIn>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/dashboard')}
                      startIcon={<DashboardIcon />}
                      sx={{
                        background: 'white',
                        color: '#2196f3',
                        px: 5,
                        py: 2,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        borderRadius: '12px',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                        '&:hover': {
                          background: '#f5f5f5',
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      Go to Dashboard
                    </Button>
                  </SignedIn>
                </Box>
              </motion.div>
            </Box>

            <Grid
              container
              spacing={4}
              justifyContent="center"
              sx={{ mt: 8 }}
            >
              <Grid item xs={6} md={3}>
                <StatItem value="99%" label="Accuracy Rate" delay={0.1} />
              </Grid>
              <Grid item xs={6} md={3}>
                <StatItem value="<1s" label="Processing Time" delay={0.2} />
              </Grid>
              <Grid item xs={6} md={3}>
                <StatItem value="24/7" label="Availability" delay={0.3} />
              </Grid>
              <Grid item xs={6} md={3}>
                <StatItem value="100%" label="Secure" delay={0.4} />
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Box textAlign="center" sx={{ mb: 8 }}>
            <Typography
              variant="h2"
              fontWeight="800"
              gutterBottom
              sx={{
                color: '#1e293b',
                fontSize: { xs: '2rem', md: '2.5rem' },
              }}
            >
              Powerful Features for Modern Lending
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#64748b',
                maxWidth: '700px',
                mx: 'auto',
                fontWeight: 400,
              }}
            >
              Everything you need to make informed lending decisions with confidence
            </Typography>
          </Box>
        </motion.div>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <FeatureCard {...feature} delay={index * 0.1} />
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ bgcolor: '#f8fafc', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Typography
                  variant="h3"
                  fontWeight="800"
                  gutterBottom
                  sx={{ color: '#1e293b' }}
                >
                  Why Choose Project Zenith?
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: '#64748b', mb: 4, lineHeight: 1.8 }}
                >
                  Our platform combines cutting-edge machine learning with
                  comprehensive financial analysis to provide the most accurate
                  credit assessments in the industry.
                </Typography>
                <Grid container spacing={2}>
                  {benefits.map((benefit, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <CheckCircle sx={{ fontSize: 16, color: 'white' }} />
                          </Box>
                          <Typography
                            variant="body1"
                            sx={{ color: '#334155', fontWeight: 600 }}
                          >
                            {benefit}
                          </Typography>
                        </Box>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Box
                  sx={{
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                    background: 'linear-gradient(145deg, #2196f3 0%, #03a9f4 100%)',
                    p: 4,
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      opacity: 0.1,
                      backgroundImage:
                        'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                      backgroundSize: '40px 40px',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'relative',
                      height: 400,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                    }}
                  >
                    <DashboardIcon sx={{ fontSize: 200, opacity: 0.3 }} />
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box
        sx={{
          background: 'linear-gradient(135deg, #1e88e5 0%, #1976d2 50%, #0288d1 100%)',
          py: 8,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.05,
            backgroundImage:
              'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
        <Container maxWidth="md" sx={{ position: 'relative' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Box textAlign="center">
              <Typography
                variant="h3"
                fontWeight="800"
                gutterBottom
                sx={{ color: 'white', mb: 2 }}
              >
                Ready to Transform Your Lending Process?
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: 'rgba(255,255,255,0.9)', mb: 4 }}
              >
                Join thousands of financial institutions using Project Zenith
              </Typography>
              <SignedOut>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/signup')}
                  startIcon={<PersonAdd />}
                  sx={{
                    background: 'white',
                    color: '#2196f3',
                    px: 5,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                    '&:hover': {
                      background: '#f5f5f5',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Start Free Trial
                </Button>
              </SignedOut>
              <SignedIn>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/dashboard')}
                  startIcon={<DashboardIcon />}
                  sx={{
                    background: 'white',
                    color: '#2196f3',
                    px: 5,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    borderRadius: '12px',
                    '&:hover': {
                      background: '#f5f5f5',
                    },
                  }}
                >
                  Access Dashboard
                </Button>
              </SignedIn>
            </Box>
          </motion.div>
        </Container>
      </Box>

      <Box
        component="footer"
        sx={{
          py: 4,
          px: 2,
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #2196f3 0%, #03a9f4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
              }}
            >
              <DashboardIcon sx={{ color: 'white', fontSize: 20 }} />
            </Box>
            <Typography variant="h6" fontWeight="700">
              Project Zenith
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Dynamic Credit Scoring & Guidance System | Powered by AI & Machine
            Learning | Built for Social Impact
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: 'rgba(255,255,255,0.5)', mt: 2 }}
          >
            © 2025 Project Zenith. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
