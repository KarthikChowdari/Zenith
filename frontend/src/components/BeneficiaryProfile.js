/**
 * BeneficiaryProfile Component for Project Uday
 * Displays comprehensive beneficiary information and profile details
 */

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Person,
  Work,
  AttachMoney,
  CreditCard,
  ElectricBolt,
  Phone,
  CalendarToday,
  TrendingUp,
} from '@mui/icons-material';

const BeneficiaryProfile = ({ beneficiaryData, score, riskCategory, explanation }) => {
  if (!beneficiaryData) {
    return (
      <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
        <Typography variant="h6" color="textSecondary">
          No beneficiary data available
        </Typography>
      </Paper>
    );
  }
  
  // Helper function to format employment type
  const getEmploymentType = (type) => {
    switch (type) {
      case 0: return { label: 'Unemployed', color: 'error' };
      case 1: return { label: 'Self-employed', color: 'warning' };
      case 2: return { label: 'Salaried', color: 'success' };
      default: return { label: 'Unknown', color: 'default' };
    }
  };
  
  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Helper function to get status color
  const getStatusColor = (status) => {
    return status === 1 ? 'success' : 'error';
  };
  
  // Helper function to get status text
  const getStatusText = (status) => {
    return status === 1 ? 'Yes' : 'No';
  };
  
  const employment = getEmploymentType(beneficiaryData.employment_type);
  
  // Generate initials for avatar
  const getInitials = (id) => {
    return `B${id}`;
  };
  
  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
        Beneficiary Profile
      </Typography>
      
      {/* Header section with avatar and basic info */}
      <Box display="flex" alignItems="center" mb={3}>
        <Avatar
          sx={{
            width: 60,
            height: 60,
            bgcolor: 'primary.main',
            fontSize: '1.5rem',
            fontWeight: 'bold',
          }}
        >
          {getInitials(beneficiaryData.beneficiary_id || 'ID')}
        </Avatar>
        
        <Box ml={2} flex={1}>
          <Typography variant="h6" fontWeight="bold">
            Beneficiary #{beneficiaryData.beneficiary_id || 'Unknown'}
          </Typography>
          
          <Box display="flex" gap={1} mt={1} flexWrap="wrap">
            <Chip
              label={employment.label}
              color={employment.color}
              size="small"
              variant="outlined"
            />
            
            <Chip
              label={beneficiaryData.is_high_need === 1 ? 'High Need' : 'Low Need'}
              color={beneficiaryData.is_high_need === 1 ? 'secondary' : 'default'}
              size="small"
              variant="outlined"
            />
          </Box>
        </Box>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      {/* Detailed information */}
      <List dense>
        {/* Age */}
        <ListItem>
          <ListItemIcon>
            <Person color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="Age"
            secondary={`${beneficiaryData.age || 'Unknown'} years`}
          />
        </ListItem>
        
        {/* Employment */}
        <ListItem>
          <ListItemIcon>
            <Work color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="Employment"
            secondary={employment.label}
          />
        </ListItem>
        
        {/* Monthly Income */}
        <ListItem>
          <ListItemIcon>
            <AttachMoney color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="Monthly Income"
            secondary={formatCurrency(beneficiaryData.monthly_income || 0)}
          />
        </ListItem>
        
        {/* Loan Repayment Status */}
        <ListItem>
          <ListItemIcon>
            <CreditCard color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="Loan Repayment History"
            secondary={
              <Chip
                label={getStatusText(beneficiaryData.loan_repayment_status)}
                color={getStatusColor(beneficiaryData.loan_repayment_status)}
                size="small"
              />
            }
          />
        </ListItem>
        
        {/* Loan Tenure */}
        <ListItem>
          <ListItemIcon>
            <CalendarToday color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="Loan Tenure"
            secondary={`${beneficiaryData.loan_tenure_months || 0} months`}
          />
        </ListItem>
        
        {/* Electricity Bill Payment */}
        <ListItem>
          <ListItemIcon>
            <ElectricBolt color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="Utility Bill Payments"
            secondary={
              <Chip
                label={getStatusText(beneficiaryData.electricity_bill_paid_on_time)}
                color={getStatusColor(beneficiaryData.electricity_bill_paid_on_time)}
                size="small"
              />
            }
          />
        </ListItem>
        
        {/* Mobile Recharge Frequency */}
        <ListItem>
          <ListItemIcon>
            <Phone color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="Mobile Recharge Frequency"
            secondary={`${beneficiaryData.mobile_recharge_frequency || 0} times/month`}
          />
        </ListItem>
      </List>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Current Status Summary */}
      <Box>
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="primary">
          Current Assessment
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box textAlign="center" p={1} bgcolor="grey.50" borderRadius={1}>
              <Typography variant="h5" fontWeight="bold" color="primary">
                {score}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Uday Score
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={6}>
            <Box textAlign="center" p={1} bgcolor="grey.50" borderRadius={1}>
              <Typography variant="body2" fontWeight="bold">
                {riskCategory?.split(' - ')[0] || 'Unknown'}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Risk Level
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
      
      {/* AI Explanation */}
      {explanation && (
        <Box mt={2}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="primary">
            <TrendingUp sx={{ verticalAlign: 'middle', mr: 1 }} />
            AI Analysis
          </Typography>
          
          <Box
            p={2}
            bgcolor="primary.50"
            borderRadius={1}
            border="1px solid"
            borderColor="primary.200"
          >
            <Typography variant="body2" lineHeight={1.6}>
              {explanation}
            </Typography>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default BeneficiaryProfile;