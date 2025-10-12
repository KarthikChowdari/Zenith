/**
 * ScoreSimulator Component for Project Zenith
 * The "killer feature" - Interactive "What-If" tool for score simulation
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Alert,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  Calculate,
  Lightbulb,
  Timeline,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { simulateScore } from '../api/api';

const ScoreSimulator = ({ currentData, currentScore }) => {
  const [hypotheticalChanges, setHypotheticalChanges] = useState({});
  const [projectedScore, setProjectedScore] = useState(null);
  const [scoreChange, setScoreChange] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Chart data for score journey visualization
  const [chartData, setChartData] = useState([]);
  
  // Reset function
  const resetSimulation = () => {
    setHypotheticalChanges({});
    setProjectedScore(null);
    setScoreChange(0);
    setExplanation('');
    setError(null);
    setChartData([]);
  };
  
  // Handle simulation
  const handleSimulate = async () => {
    if (!currentData || Object.keys(hypotheticalChanges).length === 0) {
      setError('Please make at least one change to simulate');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await simulateScore(currentData, hypotheticalChanges);
      
      setProjectedScore(result.projected_score);
      setScoreChange(result.score_change);
      setExplanation(result.explanation);
      
      // Create chart data for visualization
      const chartData = [
        { month: 'Current', score: currentScore, label: 'Current Score' },
        { month: 'Projected', score: result.projected_score, label: 'Projected Score' },
      ];
      setChartData(chartData);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle parameter changes with proper type validation
  const handleParameterChange = (parameter, value) => {
    // Ensure value is properly typed
    let typedValue = value;
    
    // Convert to appropriate types based on parameter
    if (['loan_repayment_status', 'electricity_bill_paid_on_time', 'is_high_need', 'employment_type'].includes(parameter)) {
      typedValue = parseInt(value, 10);
    } else if (['mobile_recharge_frequency', 'age', 'monthly_income'].includes(parameter)) {
      typedValue = parseInt(value, 10);
    }
    
    // Validate ranges
    if (parameter === 'mobile_recharge_frequency' && (typedValue < 1 || typedValue > 4)) {
      setError('Mobile recharge frequency must be between 1 and 4');
      return;
    }
    
    if (parameter === 'monthly_income' && typedValue < 0) {
      setError('Monthly income must be positive');
      return;
    }
    
    if (parameter === 'age' && (typedValue < 18 || typedValue > 65)) {
      setError('Age must be between 18 and 65');
      return;
    }
    
    setError(null); // Clear any previous errors
    setHypotheticalChanges(prev => ({
      ...prev,
      [parameter]: typedValue,
    }));
  };
  
  // Get improvement suggestions with better default handling
  const getImprovementSuggestions = () => {
    if (!currentData) return [];
    
    const suggestions = [];
    
    // Use safe access with proper defaults
    const loanRepaymentStatus = currentData.loan_repayment_status ?? 0;
    const electricityBillStatus = currentData.electricity_bill_paid_on_time ?? 0;
    const mobileRechargeFreq = currentData.mobile_recharge_frequency ?? 1;
    const employmentType = currentData.employment_type ?? 0;
    
    if (loanRepaymentStatus === 0) {
      suggestions.push({
        parameter: 'loan_repayment_status',
        value: 1,
        title: 'Improve Loan Repayment',
        description: 'Make all future loan payments on time',
        impact: 'High',
      });
    }
    
    if (electricityBillStatus === 0) {
      suggestions.push({
        parameter: 'electricity_bill_paid_on_time',
        value: 1,
        title: 'Pay Utility Bills On Time',
        description: 'Set up automatic bill payments',
        impact: 'Medium',
      });
    }
    
    if (mobileRechargeFreq < 3) {
      suggestions.push({
        parameter: 'mobile_recharge_frequency',
        value: 4,
        title: 'Increase Mobile Recharge Frequency',
        description: 'Recharge more regularly to show stable income',
        impact: 'Low',
      });
    }
    
    if (employmentType === 0) {
      suggestions.push({
        parameter: 'employment_type',
        value: 2,
        title: 'Secure Stable Employment',
        description: 'Find salaried employment for better creditworthiness',
        impact: 'High',
      });
    }
    
    return suggestions.slice(0, 3); // Return top 3 suggestions
  };
  
  const improvementSuggestions = getImprovementSuggestions();
  
  // Apply suggestion
  const applySuggestion = (suggestion) => {
    handleParameterChange(suggestion.parameter, suggestion.value);
  };
  
  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
        <Calculate sx={{ verticalAlign: 'middle', mr: 1 }} />
        Zenith Score Simulator
      </Typography>
      
      <Typography variant="body2" color="textSecondary" paragraph>
        See how future positive actions can improve your credit score
      </Typography>
      
      <Divider sx={{ mb: 3 }} />
      
      {/* Quick Improvement Suggestions */}
      {improvementSuggestions.length > 0 && (
        <Box mb={3}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            <Lightbulb sx={{ verticalAlign: 'middle', mr: 1 }} />
            Quick Suggestions
          </Typography>
          
          <Grid container spacing={1}>
            {improvementSuggestions.map((suggestion, index) => (
              <Grid item xs={12} key={index}>
                <Card variant="outlined" sx={{ cursor: 'pointer' }} onClick={() => applySuggestion(suggestion)}>
                  <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {suggestion.title}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {suggestion.description}
                        </Typography>
                      </Box>
                      <Chip
                        label={suggestion.impact}
                        size="small"
                        color={suggestion.impact === 'High' ? 'error' : suggestion.impact === 'Medium' ? 'warning' : 'default'}
                        variant="outlined"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      
      {/* Simulation Parameters */}
      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
        Simulate Changes
      </Typography>
      
      <Grid container spacing={2} mb={3}>
        {/* Loan Repayment Status */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Loan Repayment Status</InputLabel>
            <Select
              value={hypotheticalChanges.loan_repayment_status !== undefined 
                ? hypotheticalChanges.loan_repayment_status 
                : (currentData?.loan_repayment_status ?? 0)}
              label="Loan Repayment Status"
              onChange={(e) => handleParameterChange('loan_repayment_status', e.target.value)}
            >
              <MenuItem value={0}>Default/Late Payments</MenuItem>
              <MenuItem value={1}>On-Time Payments</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        {/* Electricity Bill Payment */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Utility Bill Payments</InputLabel>
            <Select
              value={hypotheticalChanges.electricity_bill_paid_on_time !== undefined 
                ? hypotheticalChanges.electricity_bill_paid_on_time 
                : (currentData?.electricity_bill_paid_on_time ?? 0)}
              label="Utility Bill Payments"
              onChange={(e) => handleParameterChange('electricity_bill_paid_on_time', e.target.value)}
            >
              <MenuItem value={0}>Late/Missed Payments</MenuItem>
              <MenuItem value={1}>On-Time Payments</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        {/* Mobile Recharge Frequency */}
        <Grid item xs={12}>
          <Typography variant="body2" gutterBottom>
            Mobile Recharge Frequency: {hypotheticalChanges.mobile_recharge_frequency !== undefined 
              ? hypotheticalChanges.mobile_recharge_frequency 
              : (currentData?.mobile_recharge_frequency ?? 1)} times/month
          </Typography>
          <Slider
            value={hypotheticalChanges.mobile_recharge_frequency !== undefined 
              ? hypotheticalChanges.mobile_recharge_frequency 
              : (currentData?.mobile_recharge_frequency ?? 1)}
            min={1}
            max={4}
            step={1}
            marks={[
              { value: 1, label: '1' },
              { value: 2, label: '2' },
              { value: 3, label: '3' },
              { value: 4, label: '4' },
            ]}
            onChange={(e, value) => handleParameterChange('mobile_recharge_frequency', value)}
          />
        </Grid>
        
        {/* Employment Type */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Employment Type</InputLabel>
            <Select
              value={hypotheticalChanges.employment_type !== undefined 
                ? hypotheticalChanges.employment_type 
                : (currentData?.employment_type ?? 0)}
              label="Employment Type"
              onChange={(e) => handleParameterChange('employment_type', e.target.value)}
            >
              <MenuItem value={0}>Unemployed</MenuItem>
              <MenuItem value={1}>Self-employed</MenuItem>
              <MenuItem value={2}>Salaried</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        {/* Monthly Income */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Monthly Income</InputLabel>
            <Select
              value={hypotheticalChanges.monthly_income !== undefined 
                ? hypotheticalChanges.monthly_income 
                : (currentData?.monthly_income ?? 5000)}
              label="Monthly Income"
              onChange={(e) => handleParameterChange('monthly_income', e.target.value)}
            >
              <MenuItem value={5000}>₹5,000</MenuItem>
              <MenuItem value={8000}>₹8,000</MenuItem>
              <MenuItem value={12000}>₹12,000</MenuItem>
              <MenuItem value={15000}>₹15,000</MenuItem>
              <MenuItem value={20000}>₹20,000</MenuItem>
              <MenuItem value={25000}>₹25,000</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      
      {/* Action Buttons */}
      <Box display="flex" gap={2} mb={3}>
        <Button
          variant="contained"
          onClick={handleSimulate}
          disabled={loading || Object.keys(hypotheticalChanges).length === 0}
          startIcon={loading ? <CircularProgress size={20} /> : <TrendingUp />}
        >
          {loading ? 'Simulating...' : 'Simulate New Score'}
        </Button>
        
        <Button
          variant="outlined"
          onClick={resetSimulation}
          disabled={loading}
        >
          Reset
        </Button>
      </Box>
      
      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {/* Results Display */}
      {projectedScore !== null && (
        <Box>
          <Divider sx={{ mb: 2 }} />
          
          {/* Score Change Summary */}
          <Grid container spacing={2} mb={3}>
            <Grid item xs={4}>
              <Box textAlign="center" p={2} bgcolor="grey.50" borderRadius={1}>
                <Typography variant="h6" fontWeight="bold">
                  {currentScore}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Current Score
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={4}>
              <Box textAlign="center" p={2} bgcolor={scoreChange >= 0 ? 'success.50' : 'error.50'} borderRadius={1}>
                <Typography variant="h6" fontWeight="bold" color={scoreChange >= 0 ? 'success.main' : 'error.main'}>
                  {scoreChange >= 0 ? '+' : ''}{scoreChange}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Score Change
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={4}>
              <Box textAlign="center" p={2} bgcolor="primary.50" borderRadius={1}>
                <Typography variant="h6" fontWeight="bold" color="primary.main">
                  {projectedScore}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Projected Score
                </Typography>
              </Box>
            </Grid>
          </Grid>
          
          {/* Score Journey Chart */}
          {chartData.length > 0 && (
            <Box mb={3}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                <Timeline sx={{ verticalAlign: 'middle', mr: 1 }} />
                Score Journey
              </Typography>
              
              <Box height={200}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[300, 900]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#1976d2"
                      strokeWidth={3}
                      dot={{ fill: '#1976d2', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          )}
          
          {/* AI Explanation */}
          {explanation && (
            <Box
              p={2}
              bgcolor="primary.50"
              borderRadius={1}
              border="1px solid"
              borderColor="primary.200"
            >
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="primary">
                AI Analysis
              </Typography>
              <Typography variant="body2" lineHeight={1.6}>
                {explanation}
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default ScoreSimulator;