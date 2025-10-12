/**
 * DashboardPage Component for Project Uday
 * Main dashboard with two-column layout showcasing all features
 */

import React, { useState, useEffect } from 'react';
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

// Import components
import ScoreGauge from '../components/ScoreGauge';
import RiskMatrix from '../components/RiskMatrix';
import BeneficiaryProfile from '../components/BeneficiaryProfile';
import ScoreSimulator from '../components/ScoreSimulator';

// Import API functions
import { getBeneficiary, getAllBeneficiaries } from '../api/api';

const DashboardPage = () => {
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
  
  // Load all beneficiaries on component mount
  useEffect(() => {
    loadBeneficiariesList();
  }, []);
  
  // Load specific beneficiary when selection changes
  useEffect(() => {
    if (selectedBeneficiaryId) {
      loadBeneficiaryData(selectedBeneficiaryId);
    }
  }, [selectedBeneficiaryId]);
  
  // Load beneficiaries list
  const loadBeneficiariesList = async () => {
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
  };
  
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
  
  // Check if Insta-Loan should be enabled
  const isInstaLoanEligible = () => {
    return riskCategory === 'Low Risk - High Need';
  };
  
  // Handle Insta-Loan approval
  const handleInstaLoan = () => {
    alert(`🎉 Insta-Loan Approved for Beneficiary #${selectedBeneficiaryId}!\n\nLoan Details:\n• Amount: ₹50,000\n• Interest Rate: 8.5% p.a.\n• Tenure: 12 months\n• Processing: Instant`);
  };
  
  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* App Bar */}
      <AppBar position="static" elevation={2}>
        <Toolbar>
          <DashboardIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Project Uday - Dynamic Credit Scoring Dashboard
          </Typography>
          
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
          >
            Refresh
          </Button>
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
                          <strong>Congratulations!</strong> This beneficiary qualifies for instant loan approval.
                        </Alert>
                      )}
                      
                      {!isInstaLoanEligible() && (
                        <Alert severity="info" sx={{ mb: 2 }}>
                          This beneficiary needs to improve their profile to qualify for instant loans.
                          Use the simulator to see what changes would help.
                        </Alert>
                      )}
                    </Box>
                    
                    <Button
                      variant="contained"
                      color="success"
                      size="large"
                      fullWidth
                      disabled={!isInstaLoanEligible()}
                      onClick={handleInstaLoan}
                      startIcon={<MonetizationOn />}
                      sx={{ fontWeight: 'bold' }}
                    >
                      {isInstaLoanEligible() ? 'Approve Insta-Loan' : 'Insta-Loan Not Available'}
                    </Button>
                    
                    {isInstaLoanEligible() && (
                      <Typography variant="caption" color="textSecondary" display="block" textAlign="center" mt={1}>
                        Instant approval • ₹50,000 • 8.5% p.a. • 12 months
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
          Project Uday - Dynamic Credit Scoring & Guidance System | 
          Powered by AI & Machine Learning | 
          Built for Social Impact
        </Typography>
      </Box>
    </Box>
  );
};

export default DashboardPage;