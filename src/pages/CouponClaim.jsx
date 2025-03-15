import { useState } from 'react';
import { 
  Button, 
  Container, 
  Paper, 
  Typography, 
  Snackbar, 
  Alert,
  Box,
  AlertTitle,
  Link
} from '@mui/material';
import axios from 'axios';

const CouponClaim = () => {
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info', title: '', actionText: '' });
  const [loading, setLoading] = useState(false);

  const handleClaim = async () => {
    setLoading(true);
    try {
      const response = await axios.post('https://round-robin-coupon-distribution-red.vercel.app/api/coupons/claim', {}, {
        withCredentials: true
      });
      
      setAlert({
        open: true,
        title: '🎉 Success!',
        message: `Your exclusive coupon code is: ${response.data.code}. Use it at checkout for your discount.`,
        severity: 'success',
        actionText: 'Make sure to save or copy this code before closing!'
      });
    } catch (error) {
      const status = error.response?.status;
      let title = '❌ Error';
      let message = error.response?.data?.message || 'Error claiming coupon';
      let actionText = '';
      
      // Handle specific error types
      if (status === 429) {
        title = '⏱️ Rate Limit Exceeded';
        if (message.includes('hours')) {
          // Time restriction message
          message = `${message}. Our system prevents excessive requests to ensure fair distribution.`;
          actionText = `Try again in the time specified. Each IP address is limited to one coupon per day.`;
        } else {
          // Session restriction
          message = `${message}. Each browser session is limited to one coupon per day.`;
          actionText = 'Try using a different browser or device if you need another coupon.';
        }
      } else if (status === 404) {
        title = '😞 No Coupons Available';
        message = 'All coupons have been claimed for now. Please check back later.';
        actionText = 'Our admin will add more coupons soon. Check back in a few hours.';
      } else if (status >= 500) {
        title = '🔧 Server Error';
        message = 'Our servers are experiencing issues. Please try again in a few minutes.';
        actionText = 'If the problem persists, contact our support team at support@example.com';
      }
      
      setAlert({
        open: true,
        title,
        message,
        severity: 'error',
        actionText
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      width: '100%',
      minHeight: '100vh', 
      bgcolor: 'background.default',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Container maxWidth="sm" sx={{ mx: 'auto', width: '100%' }}>
        <Paper 
          sx={{ 
            p: { xs: 4, md: 6 }, 
            textAlign: 'center',
            background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)'
            }
          }}
        >
          <Typography 
            variant="h4" 
            gutterBottom
            sx={{ 
              mb: 3,
              background: 'linear-gradient(90deg, #1a365d 0%, #2563eb 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700
            }}
          >
            Get Your Exclusive Coupon
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 4,
              color: 'text.secondary',
              fontSize: '1.1rem',
              maxWidth: '400px',
              mx: 'auto'
            }}
          >
            Click below to claim your unique discount code. Limited time offer!
          </Typography>
          <Button 
            variant="contained" 
            onClick={handleClaim}
            size="large"
            disabled={loading}
            sx={{
              py: 1.5,
              px: 4,
              fontSize: '1.1rem',
              background: 'linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)',
              '&:hover': {
                background: 'linear-gradient(90deg, #1d4ed8 0%, #1e40af 100%)'
              },
              transition: 'transform 0.2s',
              '&:hover:not(:disabled)': {
                transform: 'translateY(-2px)'
              },
              minWidth: 200
            }}
          >
            {loading ? 'Claiming...' : 'Claim Your Coupon'}
          </Button>
        </Paper>
        <Snackbar 
          open={alert.open} 
          autoHideDuration={alert.severity === 'success' ? 15000 : 8000} 
          onClose={() => setAlert({ ...alert, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            severity={alert.severity}
            sx={{ 
              borderRadius: 2,
              width: '100%',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              maxWidth: 400
            }}
            variant="filled"
            onClose={() => setAlert({ ...alert, open: false })}
          >
            <AlertTitle>{alert.title}</AlertTitle>
            {alert.message}
            {alert.actionText && (
              <Typography 
                variant="body2" 
                sx={{ 
                  mt: 1, 
                  fontSize: '0.875rem',
                  opacity: 0.9,
                  fontStyle: alert.severity === 'success' ? 'normal' : 'italic'
                }}
              >
                {alert.actionText}
              </Typography>
            )}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default CouponClaim;
