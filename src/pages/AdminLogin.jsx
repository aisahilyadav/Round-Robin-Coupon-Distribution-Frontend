import { useState } from 'react';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography,
  Alert,
  Box 
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/admin/login', credentials, {
        withCredentials: true
      });
      navigate('/admin/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
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
        <Paper sx={{ 
          p: { xs: 4, md: 6 },
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
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
          <Typography variant="h4" gutterBottom sx={{ 
            mb: 3,
            background: 'linear-gradient(90deg, #1a365d 0%, #2563eb 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700
          }}>
            Admin Login
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Username"
              margin="normal"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            />
            <TextField
              fullWidth
              type="password"
              label="Password"
              margin="normal"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
            <Button 
              type="submit"
              variant="contained" 
              fullWidth 
              sx={{ 
                mt: 3,
                py: 1.5,
                background: 'linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #1d4ed8 0%, #1e40af 100%)'
                }
              }}
            >
              Login
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminLogin; 