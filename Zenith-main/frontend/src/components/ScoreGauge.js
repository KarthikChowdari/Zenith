/**
 * ScoreGauge Component for Project Zenith
 * Displays the Zenith credit score in an interactive gauge format
 */

import React from 'react';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ScoreGauge = ({ score, maxScore = 900, minScore = 300 }) => {
  const theme = useTheme();
  
  // Normalize score to percentage
  const normalizedScore = ((score - minScore) / (maxScore - minScore)) * 100;
  
  // Create data for the gauge
  const gaugeFillPercentage = Math.min(100, Math.max(0, normalizedScore));
  const gaugeEmptyPercentage = 100 - gaugeFillPercentage;
  
  const gaugeData = [
    { name: 'score', value: gaugeFillPercentage },
    { name: 'empty', value: gaugeEmptyPercentage },
  ];
  
  // Determine color based on score
  const getScoreColor = (score) => {
    if (score >= 750) return '#4caf50'; // Green
    if (score >= 650) return '#8bc34a'; // Light Green
    if (score >= 550) return '#ff9800'; // Orange
    if (score >= 450) return '#ff5722'; // Red Orange
    return '#f44336'; // Red
  };
  
  const getScoreLabel = (score) => {
    if (score >= 750) return 'Excellent';
    if (score >= 650) return 'Good';
    if (score >= 550) return 'Fair';
    if (score >= 450) return 'Poor';
    return 'Very Poor';
  };
  
  const scoreColor = getScoreColor(score);
  const scoreLabel = getScoreLabel(score);
  
  const COLORS = [scoreColor, '#e0e0e0'];
  
  return (
    <Paper elevation={3} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
      <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
        Zenith Credit Score
      </Typography>
      
      <Box position="relative" height={200} width="100%">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={gaugeData}
              cx="50%"
              cy="70%"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={90}
              paddingAngle={0}
              dataKey="value"
            >
              {gaugeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Score display in the center */}
        <Box
          position="absolute"
          top="60%"
          left="50%"
          sx={{
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h3"
            component="div"
            fontWeight="bold"
            color={scoreColor}
          >
            {score}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            out of {maxScore}
          </Typography>
        </Box>
      </Box>
      
      {/* Score label and description */}
      <Box mt={2}>
        <Typography
          variant="h6"
          component="div"
          color={scoreColor}
          fontWeight="bold"
          gutterBottom
        >
          {scoreLabel}
        </Typography>
        
        <Typography variant="body2" color="textSecondary" paragraph>
          Your credit score is calculated based on multiple factors including
          loan repayment history, utility payments, and financial behavior.
        </Typography>
        
        {/* Score range indicator */}
        <Box mt={2}>
          <Typography variant="caption" color="textSecondary">
            Score Range: {minScore} - {maxScore}
          </Typography>
          
          {/* Visual score range bar */}
          <Box
            mt={1}
            height={8}
            borderRadius={4}
            bgcolor="grey.200"
            position="relative"
            overflow="hidden"
          >
            <Box
              height="100%"
              bgcolor={scoreColor}
              borderRadius={4}
              width={`${gaugeFillPercentage}%`}
              sx={{ transition: 'width 0.3s ease-in-out' }}
            />
          </Box>
          
          {/* Score benchmarks */}
          <Box
            display="flex"
            justifyContent="space-between"
            mt={1}
            px={1}
          >
            <Typography variant="caption" color="textSecondary">
              {minScore}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Poor
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Fair
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Good
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {maxScore}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default ScoreGauge;