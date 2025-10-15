/**
 * Enhanced Beneficiary Dashboard for Project Zenith
 * Complete dashboard with 4-section layout as requested
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Paper,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Person as PersonIcon,
  TrendingUp as TrendingUpIcon,
  History as HistoryIcon,
  Assessment as AssessmentIcon,
  AccountCircle as AccountCircleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Timeline as TimelineIcon,
  Home as HomeIcon,
} from '@mui/icons-material';

// Import API functions and components
import { getBeneficiaryByEmail, getScoreHistory } from '../../api/api';
import { useUser } from '@clerk/clerk-react';
import ScoreGauge from '../../components/ScoreGauge';
import BeneficiaryProfile from '../../components/BeneficiaryProfile';
import RiskMatrix from '../../components/RiskMatrix';
import ScoreSimulator from '../../components/ScoreSimulator';
import InstaLoanEligibility from '../../components/InstaLoanEligibility';
import NavigationBar from '../../components/NavigationBar';

// Tab panel component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`beneficiary-tabpanel-${index}`}
      aria-labelledby={`beneficiary-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const BeneficiaryDashboard = () => {
  const { user } = useUser();
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Beneficiary data
  const [beneficiaryData, setBeneficiaryData] = useState(null);
  const [scoreHistory, setScoreHistory] = useState([]);

  // Load beneficiary data
  useEffect(() => {
    const loadData = async () => {
      if (user?.emailAddresses?.[0]?.emailAddress) {
        setLoading(true);
        setError(null);

        try {
          const email = user.emailAddresses[0].emailAddress;
          
          // Load beneficiary profile
          const beneficiary = await getBeneficiaryByEmail(email);
          console.log('Loaded beneficiary data:', beneficiary); // Debug log
          setBeneficiaryData(beneficiary);

          // Load score history if beneficiary exists
          if (beneficiary?.id) {
            try {
              const history = await getScoreHistory(beneficiary.id);
              setScoreHistory(history.history || []);
            } catch (historyErr) {
              console.warn('Score history not available:', historyErr);
              setScoreHistory([]);
            }
          }

        } catch (err) {
          console.error('Error loading beneficiary data:', err);
          setError('Unable to load your profile. Please contact support if this persists.');
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [user]);

  const loadBeneficiaryData = async () => {
    if (user?.emailAddresses?.[0]?.emailAddress) {
      setLoading(true);
      setError(null);

      try {
        const email = user.emailAddresses[0].emailAddress;
        
        // Load beneficiary profile
        const beneficiary = await getBeneficiaryByEmail(email);
        setBeneficiaryData(beneficiary);

        // Load score history if beneficiary exists
        if (beneficiary?.id) {
          try {
            const history = await getScoreHistory(beneficiary.id);
            setScoreHistory(history.history || []);
          } catch (historyErr) {
            console.warn('Score history not available:', historyErr);
            setScoreHistory([]);
          }
        }

      } catch (err) {
        console.error('Error loading beneficiary data:', err);
        setError('Unable to load your profile. Please contact support if this persists.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const getRiskColor = (risk) => {
    switch ((risk || '').toLowerCase()) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getScoreLevel = (score) => {
    if (score >= 750) return { level: 'Excellent', color: 'success', icon: CheckCircleIcon };
    if (score >= 700) return { level: 'Very Good', color: 'success', icon: CheckCircleIcon };
    if (score >= 650) return { level: 'Good', color: 'primary', icon: TrendingUpIcon };
    if (score >= 600) return { level: 'Fair', color: 'warning', icon: WarningIcon };
    return { level: 'Needs Improvement', color: 'error', icon: ErrorIcon };
  };

  const getScoreAdvice = (score) => {
    if (score >= 750) return "Excellent credit score! You qualify for the best loan terms.";
    if (score >= 700) return "Very good credit score. You're eligible for most loan products.";
    if (score >= 650) return "Good credit score. Consider improving it for better loan terms.";
    if (score >= 600) return "Fair credit score. Focus on building your credit history.";
    return "Your credit score needs improvement. Follow our recommendations to boost it.";
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">
          {error}
          <Button color="inherit" size="small" onClick={loadBeneficiaryData} sx={{ ml: 2 }}>
            Retry
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!beneficiaryData) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="info">
          <Typography variant="h6" gutterBottom>
            Profile Not Found
          </Typography>
          <Typography>
            We couldn't find your beneficiary profile. Please contact support to set up your account.
          </Typography>
        </Alert>
      </Container>
    );
  }

  const currentScore = beneficiaryData.credit_score || 0;
  const scoreLevel = getScoreLevel(currentScore);
  const ScoreLevelIcon = scoreLevel.icon;

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Navigation Bar */}
      <NavigationBar />

      <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
        {/* Welcome Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
            Welcome to Your Credit Dashboard
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {beneficiaryData.name || `Beneficiary #${beneficiaryData.beneficiary_id}`}
          </Typography>
          <Chip 
            label={`Score: ${currentScore}`} 
            color={scoreLevel.color} 
            size="large" 
            sx={{ mt: 1, fontSize: '1rem', px: 2 }}
          />
        </Box>

        {/* Main Dashboard Layout */}
        
        {/* Top Row: Beneficiary Profile (Left) + Score Simulator (Right) */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} lg={6}>
            <BeneficiaryProfile
              beneficiaryData={beneficiaryData}
              score={currentScore}
              riskCategory={beneficiaryData?.risk_category}
              explanation={beneficiaryData?.explanation || `This beneficiary has a credit score of ${currentScore} based on their financial history and behavior patterns. The assessment considers factors such as loan repayment history, utility bill payments, employment status, and overall financial stability.`}
            />
          </Grid>
          
          <Grid item xs={12} lg={6}>
            <ScoreSimulator
              currentData={beneficiaryData}
              currentScore={currentScore}
            />
          </Grid>
        </Grid>

        {/* Bottom Row: Score Gauge + Risk Matrix (Left) + Insta Loan Eligibility (Right) */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} lg={6}>
            <Grid container spacing={3} sx={{ height: '100%' }}>
              <Grid item xs={12} md={6}>
                <Box sx={{ height: '100%' }}>
                  <ScoreGauge 
                    score={currentScore} 
                    maxScore={900}
                    minScore={300}
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ height: '100%' }}>
                  <RiskMatrix
                    riskCategory={beneficiaryData?.risk_category}
                    score={beneficiaryData?.credit_score || currentScore}
                  />
                </Box>
              </Grid>
            </Grid>
          </Grid>
          
          <Grid item xs={12} lg={6}>
            <InstaLoanEligibility
              beneficiaryData={beneficiaryData}
              score={currentScore}
            />
          </Grid>
        </Grid>

        {/* Additional Sections - Tabs for extra information */}
        <Paper elevation={3} sx={{ mt: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ px: 2 }}
            >
              <Tab icon={<HistoryIcon />} label="Score History" />
              <Tab icon={<AssessmentIcon />} label="Recommendations" />
              <Tab icon={<TrendingUpIcon />} label="Financial Insights" />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <TabPanel value={currentTab} index={0}>
            {/* Score History */}
            <Typography variant="h6" gutterBottom>
              Credit Score History & Trends
            </Typography>
            {scoreHistory.length > 0 ? (
              <List>
                {scoreHistory.slice(0, 10).map((entry, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemIcon>
                        <TimelineIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={`Score: ${entry.score || 'N/A'}`}
                        secondary={entry.scored_at ? 
                          new Date(entry.scored_at).toLocaleDateString() : 
                          'Unknown date'
                        }
                      />
                      <Chip
                        label={entry.score >= 700 ? 'Excellent' : entry.score >= 600 ? 'Good' : entry.score >= 500 ? 'Fair' : 'Poor'}
                        color={entry.score >= 700 ? 'success' : entry.score >= 600 ? 'primary' : entry.score >= 500 ? 'warning' : 'error'}
                        size="small"
                      />
                    </ListItem>
                    {index < scoreHistory.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Alert severity="info">
                <Typography variant="body1">
                  No score history available yet. Your score will be tracked as it updates over time.
                </Typography>
              </Alert>
            )}
          </TabPanel>

          <TabPanel value={currentTab} index={1}>
            {/* Personalized Recommendations */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="success.main">
                      <CheckCircleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Strengths to Maintain
                    </Typography>
                    <List>
                      {beneficiaryData?.loan_repayment_status === 1 && (
                        <ListItem>
                          <ListItemText
                            primary="Excellent loan repayment history"
                            secondary="Continue making payments on time to maintain your score"
                          />
                        </ListItem>
                      )}
                      {beneficiaryData?.electricity_bill_paid_on_time === 1 && (
                        <ListItem>
                          <ListItemText
                            primary="Timely utility bill payments"
                            secondary="Your consistent bill payments show financial responsibility"
                          />
                        </ListItem>
                      )}
                      {beneficiaryData?.employment_type === 2 && (
                        <ListItem>
                          <ListItemText
                            primary="Stable employment"
                            secondary="Your salaried employment provides income stability"
                          />
                        </ListItem>
                      )}
                      {beneficiaryData?.monthly_income >= 20000 && (
                        <ListItem>
                          <ListItemText
                            primary="Good income level"
                            secondary="Your income supports loan eligibility"
                          />
                        </ListItem>
                      )}
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary.main">
                      <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Areas for Improvement
                    </Typography>
                    <List>
                      {beneficiaryData?.loan_repayment_status === 0 && (
                        <ListItem>
                          <ListItemText
                            primary="Improve loan repayment behavior"
                            secondary="Focus on making all future payments on time"
                          />
                        </ListItem>
                      )}
                      {beneficiaryData?.electricity_bill_paid_on_time === 0 && (
                        <ListItem>
                          <ListItemText
                            primary="Set up automatic bill payments"
                            secondary="Automate utility payments to avoid late fees"
                          />
                        </ListItem>
                      )}
                      {beneficiaryData?.mobile_recharge_frequency < 3 && (
                        <ListItem>
                          <ListItemText
                            primary="Increase mobile recharge frequency"
                            secondary="Regular recharges show active financial behavior"
                          />
                        </ListItem>
                      )}
                      {beneficiaryData?.employment_type === 0 && (
                        <ListItem>
                          <ListItemText
                            primary="Seek stable employment"
                            secondary="Steady income improves creditworthiness"
                          />
                        </ListItem>
                      )}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={currentTab} index={2}>
            {/* Financial Insights */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary" fontWeight="bold">
                      {currentScore}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      Current Credit Score
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(currentScore / 900) * 100}
                      sx={{ mt: 2, height: 8, borderRadius: 4 }}
                      color={scoreLevel.color}
                    />
                    <Typography variant="caption" color="textSecondary" display="block" mt={1}>
                      {scoreLevel.level} Rating
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="success.main" fontWeight="bold">
                      ₹{beneficiaryData?.monthly_income?.toLocaleString() || '0'}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      Monthly Income
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Employment: {
                        beneficiaryData?.employment_type === 2 ? 'Salaried' :
                        beneficiaryData?.employment_type === 1 ? 'Self-employed' :
                        'Unemployed'
                      }
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="warning.main" fontWeight="bold">
                      {beneficiaryData?.risk_category?.split(' - ')[0] || 'Unknown'}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      Risk Level
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Need Level: {beneficiaryData?.is_high_need ? 'High' : 'Low'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
};

export default BeneficiaryDashboard;