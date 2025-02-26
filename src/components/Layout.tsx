import React, { ReactNode } from 'react';
import { Box, CssBaseline } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import { useUser } from '../context/UserContext';

interface LayoutProps {
  children: ReactNode;
}

const DRAWER_WIDTH = 240;

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated } = useUser();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Header />
      {isAuthenticated && <Sidebar />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          pt: 4,
          width: { sm: `calc(100% - ${isAuthenticated ? DRAWER_WIDTH : 0}px)` },
          ml: { sm: isAuthenticated ? `${DRAWER_WIDTH}px` : 0 },
          mt: 8,
          backgroundColor: (theme) => 
            theme.palette.mode === 'light' 
              ? theme.palette.grey[50] 
              : theme.palette.grey[900],
          borderRadius: '12px 0 0 0',
          boxShadow: 'inset 0 4px 10px rgba(0, 0, 0, 0.05)',
          overflow: 'auto'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 