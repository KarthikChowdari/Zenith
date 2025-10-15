/**
 * DashboardPage Component for Project Zenith
 * Main dashboard with two-column layout showcasing all features
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  AppBar,
  Toolbar,
  Paper,
  Chip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  MonetizationOn,
  Refresh,
  Person,
} from '@mui/icons-material';
import { useUser, UserButton } from '@clerk/clerk-react';

// Import components
import ScoreGauge from '../components/ScoreGauge';
import RiskMatrix from '../components/RiskMatrix';
import BeneficiaryProfile from '../components/BeneficiaryProfile';
import ScoreSimulator from '../components/ScoreSimulator';

// Import API functions
import { getBeneficiary, getAllBeneficiaries } from '../api/api';

const DashboardPage = () => {
  const { user } = useUser();
  
  // State management
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState(1);
  const [beneficiaryData, setBeneficiaryData] = useState(null);
  const [beneficiariesList, setBeneficiariesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Beneficiary details
  const [score, setScore] = useState(0);
  const [riskCategory, setRiskCategory] = useState('');
  const [explanation, setExplanation] = useState('');
  
  // Load beneficiaries list
  const loadBeneficiariesList = useCallback(async () => {
    try {
      const data = await getAllBeneficiaries();
      setBeneficiariesList(data.beneficiaries || []);
      
      // Auto-select first beneficiary if none selected
      if (data.beneficiaries && data.beneficiaries.length > 0 && !selectedBeneficiaryId) {
        setSelectedBeneficiaryId(data.beneficiaries[0].id);
      }
    } catch (err) {
      console.error('Error loading beneficiaries list:', err);
      setError('Failed to load beneficiaries list');
    }
  }, [selectedBeneficiaryId]);
  
  // Load all beneficiaries on component mount
  useEffect(() => {
    loadBeneficiariesList();
  }, [loadBeneficiariesList]);
  
  // Load specific beneficiary when selection changes
  useEffect(() => {
    if (selectedBeneficiaryId) {
      loadBeneficiaryData(selectedBeneficiaryId);
    }
  }, [selectedBeneficiaryId]);
  
  // Load beneficiary data
  const loadBeneficiaryData = async (beneficiaryId) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getBeneficiary(beneficiaryId);
      
      setBeneficiaryData({
        beneficiary_id: data.id,
        ...data.data,
      });
      setScore(data.score);
      setRiskCategory(data.risk_category);
      setExplanation(data.explanation);
      
    } catch (err) {
      console.error('Error loading beneficiary data:', err);
      setError(`Failed to load beneficiary data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle beneficiary selection change
  const handleBeneficiaryChange = (event) => {
    setSelectedBeneficiaryId(event.target.value);
  };
  
  // Handle refresh
  const handleRefresh = () => {
    if (selectedBeneficiaryId) {
      loadBeneficiaryData(selectedBeneficiaryId);
    }
  };
  
  // Check if Insta-Loan should be enabled (dynamic based on score and risk)
  const isInstaLoanEligible = () => {
    // Eligible if score >= 500 OR risk category indicates low risk
    return score >= 500 || riskCategory === 'Low Risk - High Need' || riskCategory === 'Low Risk - Low Need';
  };
  
  // Handle Insta-Loan approval with dynamic backend call
  const handleInstaLoan = async () => {
    if (!selectedBeneficiaryId) return;
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/loans/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          beneficiary_id: selectedBeneficiaryId,
          loan_amount: 50000,  // Default amount, can be made configurable
          tenure_months: 12,
          officer_id: null,
          notes: 'Instant loan approval request'
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Build detailed message based on response
        let message = `${data.approved ? '🎉 ' : '⚠️ '}Loan Application Status: ${data.status.toUpperCase()}\n\n`;
        message += `Eligibility Score: ${data.eligibility_score}/100\n\n`;
        message += `Loan Details:\n`;
        message += `• Requested Amount: ₹${data.loan_amount.toLocaleString()}\n`;
        message += `• Maximum Eligible: ₹${data.max_loan_amount.toLocaleString()}\n`;
        message += `• Interest Rate: ${data.interest_rate}% p.a.\n`;
        message += `• Tenure: ${data.tenure_months} months\n`;
        message += `• EMI: ₹${data.emi.toLocaleString()}/month\n`;
        message += `• Processing Time: ${data.processing_time}\n\n`;
        
        if (data.benefits && data.benefits.length > 0) {
          message += `✅ Benefits:\n`;
          data.benefits.forEach(benefit => {
            message += `  • ${benefit}\n`;
          });
          message += `\n`;
        }
        
        if (data.reasons && data.reasons.length > 0) {
          message += `${data.approved ? '📋' : '❌'} ${data.approved ? 'Notes' : 'Reasons'}:\n`;
          data.reasons.forEach(reason => {
            message += `  • ${reason}\n`;
          });
        }
        
        alert(message);
      } else {
        alert(`Error: ${data.message || 'Failed to process loan application'}`);
      }
    } catch (error) {
      console.error('Error approving loan:', error);
      alert('Failed to process loan application. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* App Bar */}
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <DashboardIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Project Zenith - Dynamic Credit Scoring Dashboard
          </Typography>
          
          {/* User Welcome Message */}
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
              <Typography variant="body2" sx={{ mr: 2 }}>
                Welcome, {user.firstName || user.emailAddresses[0]?.emailAddress}
              </Typography>
            </Box>
          )}
          
          {/* Beneficiary Selector */}
          <FormControl variant="outlined" sx={{ minWidth: 200, mr: 2 }}>
            <InputLabel sx={{ color: 'white' }}>Select Beneficiary</InputLabel>
            <Select
              value={selectedBeneficiaryId}
              onChange={handleBeneficiaryChange}
              label="Select Beneficiary"
              sx={{ 
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
              }}
            >
              {beneficiariesList.map((beneficiary) => (
                <MenuItem key={beneficiary.id} value={beneficiary.id}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Person fontSize="small" />
                    Beneficiary #{beneficiary.id}
                    <Chip
                      label={`Score: ${beneficiary.score}`}
                      size="small"
                      color={beneficiary.score >= 650 ? 'success' : 'warning'}
                      variant="outlined"
                    />
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Button
            color="inherit"
            onClick={handleRefresh}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Refresh />}
            sx={{ mr: 2 }}
          >
            Refresh
          </Button>
          
          {/* User Button from Clerk */}
          <UserButton 
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-8 h-8",
              },
            }}
          />
        </Toolbar>
      </AppBar>
      
      {/* Main Content */}
      <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        {/* Loading State */}
        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ ml: 2 }}>
              Loading beneficiary data...
            </Typography>
          </Box>
        )}
        
        {/* Dashboard Content */}
        {!loading && beneficiaryData && (
          <Grid container spacing={3}>
            {/* Left Column */}
            <Grid item xs={12} lg={6}>
              <Grid container spacing={3}>
                {/* Beneficiary Profile */}
                <Grid item xs={12}>
                  <BeneficiaryProfile
                    beneficiaryData={beneficiaryData}
                    score={score}
                    riskCategory={riskCategory}
                    explanation={explanation}
                  />
                </Grid>
                
                {/* Score Gauge */}
                <Grid item xs={12} md={6}>
                  <ScoreGauge score={score} />
                </Grid>
                
                {/* Risk Matrix */}
                <Grid item xs={12} md={6}>
                  <RiskMatrix riskCategory={riskCategory} score={score} />
                </Grid>
                
                {/* Insta-Loan Section */}
                <Grid item xs={12}>
                  <Paper elevation={3} sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                      <MonetizationOn sx={{ verticalAlign: 'middle', mr: 1 }} />
                      Insta-Loan Eligibility
                    </Typography>
                    
                    <Box mb={2}>
                      <Typography variant="body2" color="textSecondary" paragraph>
                        Instant loan approval for qualified beneficiaries based on AI assessment
                      </Typography>
                      
                      <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Typography variant="body2" fontWeight="bold">
                          Status:
                        </Typography>
                        <Chip
                          label={isInstaLoanEligible() ? 'Eligible' : 'Not Eligible'}
                          color={isInstaLoanEligible() ? 'success' : 'error'}
                          variant="outlined"
                        />
                      </Box>
                      
                      {isInstaLoanEligible() && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                          <strong>Eligible for Instant Loan!</strong> Credit score: {score}/850. 
                          Click below to get detailed loan terms and approval decision.
                        </Alert>
                      )}
                      
                      {!isInstaLoanEligible() && (
                        <Alert severity="info" sx={{ mb: 2 }}>
                          Current credit score: {score}/850. Minimum score of 500 required for instant loans.
                          Use the simulator below to see what changes would help improve eligibility.
                        </Alert>
                      )}
                    </Box>
                    
                    <Button
                      variant="contained"
                      color="success"
                      size="large"
                      fullWidth
                      disabled={!isInstaLoanEligible() || loading}
                      onClick={handleInstaLoan}
                      startIcon={<MonetizationOn />}
                      sx={{ fontWeight: 'bold' }}
                    >
                      {loading ? 'Processing...' : isInstaLoanEligible() ? 'Evaluate Loan Eligibility' : 'Not Eligible - Score Too Low'}
                    </Button>
                    
                    {isInstaLoanEligible() && (
                      <Typography variant="caption" color="textSecondary" display="block" textAlign="center" mt={1}>
                        Request: ₹50,000 • 12 months • Rate based on profile
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
            
            {/* Right Column - Score Simulator */}
            <Grid item xs={12} lg={6}>
              <ScoreSimulator
                currentData={beneficiaryData}
                currentScore={score}
              />
            </Grid>
          </Grid>
        )}
        
        {/* No Data State */}
        {!loading && !beneficiaryData && !error && (
          <Box textAlign="center" py={8}>
            <Typography variant="h4" color="textSecondary" gutterBottom>
              No Data Available
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Please select a beneficiary to view their credit profile and score simulation.
            </Typography>
          </Box>
        )}
      </Container>
      
      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
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

export default DashboardPage;