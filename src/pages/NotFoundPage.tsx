import React from 'react';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Paper
        elevation={3}
        sx={{
          mt: 8,
          p: 4,
          borderRadius: '16px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
        }}
      >
        <Box sx={{ mb: 4 }}>
          <ErrorOutlineIcon sx={{ fontSize: 100, color: 'error.main', opacity: 0.8 }} />
        </Box>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #f44336, #ff9800)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}
        >
          404
        </Typography>
        <Typography variant="h4" gutterBottom>
          页面未找到
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          抱歉，您请求的页面不存在或已被移除。
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate('/')}
          sx={{
            borderRadius: '8px',
            px: 4,
            py: 1.5,
            boxShadow: '0 4px 8px rgba(25, 118, 210, 0.25)'
          }}
        >
          返回首页
        </Button>
      </Paper>
    </Container>
  );
};

export default NotFoundPage; 