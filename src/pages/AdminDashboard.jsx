import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Chip,
  CircularProgress,
  Divider,
  Alert,
  AlertTitle,
  IconButton
} from '@mui/material';
import axios from 'axios';
import RefreshIcon from '@mui/icons-material/Refresh';

const AdminDashboard = () => {
  const [coupons, setCoupons] = useState([]);
  const [open, setOpen] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState({ show: false, message: '', details: '', type: '' });
  const [actionSuccess, setActionSuccess] = useState({ show: false, message: '' });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      const response = await axios.get('http://localhost:5000/api/admin/coupons', {
        withCredentials: true
      });
      setCoupons(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching coupons:', error);
      setError('Failed to load coupons. Please check your network connection and try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleAddCoupon = async () => {
    if (!newCode.trim()) {
      return;
    }
    
    try {
      await axios.post('http://localhost:5000/api/admin/coupons', { code: newCode }, {
        withCredentials: true
      });
      setOpen(false);
      setNewCode('');
      fetchCoupons();
      setActionSuccess({
        show: true,
        message: `Coupon "${newCode}" was added successfully!`
      });
      setTimeout(() => setActionSuccess({ show: false, message: '' }), 5000);
    } catch (error) {
      console.error('Error adding coupon:', error);
      setActionError({
        show: true, 
        type: 'add',
        message: 'Failed to add coupon',
        details: error.response?.data?.message || 'The code may already exist or be invalid.'
      });
      setTimeout(() => setActionError({ show: false, message: '', details: '', type: '' }), 5000);
    }
  };

  const handleToggleStatus = async (id, currentStatus, code) => {
    try {
      await axios.patch(`http://localhost:5000/api/admin/coupons/${id}/toggle`, {}, {
        withCredentials: true
      });
      fetchCoupons();
      setActionSuccess({
        show: true,
        message: `Coupon "${code}" was ${currentStatus ? 'disabled' : 'enabled'} successfully!`
      });
      setTimeout(() => setActionSuccess({ show: false, message: '' }), 5000);
    } catch (error) {
      console.error('Error toggling coupon status:', error);
      setActionError({
        show: true,
        type: 'toggle',
        message: `Failed to ${currentStatus ? 'disable' : 'enable'} coupon`,
        details: 'The server could not process your request. Please try again or check your connection.'
      });
      setTimeout(() => setActionError({ show: false, message: '', details: '', type: '' }), 5000);
    }
  };

  return (
    <Box sx={{ 
      width: '100%',
      minHeight: '100vh', 
      bgcolor: 'background.default',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      py: 6
    }}>
      <Container maxWidth="lg" sx={{ width: '100%', px: { xs: 2, sm: 3, md: 4 } }}>
        {actionError.show && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
            }}
            onClose={() => setActionError({ show: false, message: '', details: '', type: '' })}
          >
            <AlertTitle>{actionError.message}</AlertTitle>
            {actionError.details}
            {actionError.type === 'add' && (
              <Typography variant="body2" sx={{ mt: 1, fontSize: '0.875rem' }}>
                Try a different coupon code or check if it already exists.
              </Typography>
            )}
          </Alert>
        )}
        
        {actionSuccess.show && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
            }}
            onClose={() => setActionSuccess({ show: false, message: '' })}
          >
            <AlertTitle>Success</AlertTitle>
            {actionSuccess.message}
          </Alert>
        )}
        
        <Paper elevation={2} sx={{ 
          p: { xs: 3, md: 5 }, 
          mb: 4, 
          borderRadius: 2,
          background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)'
          }
        }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' }, 
            gap: { xs: 2, sm: 0 },
            mb: 4 
          }}>
            <Typography variant="h4" sx={{ 
              background: 'linear-gradient(90deg, #1a365d 0%, #2563eb 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700
            }}>
              Coupon Dashboard
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', sm: 'auto' } }}>
              <Button 
                variant="outlined"
                onClick={fetchCoupons}
                disabled={refreshing}
                startIcon={<RefreshIcon />}
                sx={{
                  py: 1.2,
                  borderRadius: 1.5,
                  width: { xs: '50%', sm: 'auto' }
                }}
              >
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
              <Button 
                variant="contained" 
                onClick={() => setOpen(true)}
                sx={{
                  py: 1.2,
                  width: { xs: '50%', sm: 'auto' },
                  background: 'linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #1d4ed8 0%, #1e40af 100%)'
                  },
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)'
                  },
                  borderRadius: 1.5
                }}
              >
                Add New Coupon
              </Button>
            </Box>
          </Box>
          
          {loading && coupons.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ my: 2 }}>
              <AlertTitle>Could not load coupons</AlertTitle>
              {error}
              <Button 
                variant="text" 
                onClick={fetchCoupons} 
                sx={{ mt: 1, textTransform: 'none' }}
              >
                Try Again
              </Button>
            </Alert>
          ) : (
            <TableContainer component={Paper} elevation={0} sx={{ 
              borderRadius: 2,
              boxShadow: 'none',
              border: '1px solid rgba(0, 0, 0, 0.08)'
            }}>
              <Table>
                <TableHead sx={{ bgcolor: 'rgba(59, 130, 246, 0.04)' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, width: '40%', py: 2 }}>Coupon Code</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: '20%' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: '20%' }}>Claims</TableCell>
                    <TableCell sx={{ fontWeight: 600, width: '20%' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {coupons.map(coupon => (
                    <TableRow key={coupon._id} hover sx={{
                      '&:hover': {
                        bgcolor: 'rgba(59, 130, 246, 0.02)'
                      }
                    }}>
                      <TableCell sx={{ py: 2, fontFamily: 'monospace', fontSize: '1rem', fontWeight: 500 }}>
                        {coupon.code}
                      </TableCell>
                      <TableCell>
                        <Box sx={{
                          display: 'inline-block',
                          py: 0.5,
                          px: 1.5,
                          borderRadius: 1,
                          fontSize: '0.8rem',
                          fontWeight: 'medium',
                          backgroundColor: coupon.isActive ? 'rgba(46, 160, 67, 0.1)' : 'rgba(234, 67, 53, 0.1)',
                          color: coupon.isActive ? 'rgb(22, 125, 46)' : 'rgb(205, 43, 49)'
                        }}>
                          {coupon.isActive ? 'Active' : 'Inactive'}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 500,
                          bgcolor: 'rgba(59, 130, 246, 0.1)',
                          color: 'rgb(29, 78, 216)',
                          borderRadius: '50%',
                          width: 32,
                          height: 32
                        }}>
                          {coupon.claimedBy.length}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Button 
                          onClick={() => handleToggleStatus(coupon._id, coupon.isActive, coupon.code)}
                          variant="outlined"
                          color={coupon.isActive ? 'error' : 'success'}
                          size="small"
                          sx={{
                            borderRadius: 1.5,
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            px: 2,
                            width: '100%',
                            maxWidth: 120,
                            transition: 'transform 0.2s, background-color 0.2s',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              background: 'linear-gradient(90deg, #1d4ed8 0%, #1e40af 100%)'
                            }
                          }}
                        >
                          {coupon.isActive ? 'Disable' : 'Enable'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {coupons.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} sx={{ textAlign: 'center', py: 6 }}>
                        <Typography sx={{ color: 'text.secondary', mb: 2, fontSize: '1.1rem' }}>
                          No coupons available
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                          Create your first coupon to start the promotion
                        </Typography>
                        <Button 
                          variant="contained" 
                          onClick={() => setOpen(true)}
                          sx={{
                            py: 1,
                            px: 3,
                            background: 'linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)',
                            '&:hover': {
                              background: 'linear-gradient(90deg, #1d4ed8 0%, #1e40af 100%)'
                            }
                          }}
                        >
                          Add First Coupon
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        <Dialog 
          open={open} 
          onClose={() => setOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 2,
              maxWidth: 450
            }
          }}
        >
          <DialogTitle sx={{ 
            pb: 1,
            pt: 3,
            fontWeight: 600
          }}>
            Add New Coupon
          </DialogTitle>
          <DialogContent sx={{ pt: 2, pb: 3, px: 3 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Coupon Code"
              fullWidth
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              placeholder="e.g., SUMMER25"
              helperText="Enter a unique code for your coupon (alphanumeric only)"
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button 
              onClick={() => setOpen(false)}
              sx={{ color: 'text.secondary' }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddCoupon} 
              variant="contained"
              disabled={!newCode.trim()}
              sx={{
                px: 3,
                background: 'linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #1d4ed8 0%, #1e40af 100%)'
                }
              }}
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminDashboard; 