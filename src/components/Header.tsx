import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Avatar, 
  Menu, 
  MenuItem, 
  Tooltip, 
  Badge,
  useTheme,
  useMediaQuery,
  Fade,
  Divider,
  alpha,
  ListItemIcon
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HelpIcon from '@mui/icons-material/Help';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LoginIcon from '@mui/icons-material/Login';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useUser();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [displayName, setDisplayName] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  
  // 每当user对象变化时更新显示名称和头像
  useEffect(() => {
    if (user) {
      setDisplayName(user.username);
      setAvatarUrl(user.avatar || '');
    }
  }, [user]);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
    handleMenuClose();
  };
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleNotificationOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };
  
  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };
  
  // 获取用户头像的首字母
  const getUserInitial = () => {
    return displayName.charAt(0).toUpperCase() || 'U';
  };
  
  // 获取用户角色的中文名称
  const getUserRoleName = () => {
    return user?.role === 'admin' ? '管理员' : '用户';
  };
  
  // 随机生成通知数量
  const notificationCount = Math.floor(Math.random() * 5);

  return (
    <>
      {/* 添加一个占位符，解决内容被AppBar遮挡的问题 */}
      <Toolbar />
      
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          background: 'linear-gradient(135deg, #0a2463 0%, #1976d2 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 64, sm: 70 }, px: { xs: 2, sm: 3 } }}>
          <Box 
            component="img" 
            src="/logo192.png" 
            alt="联通数智" 
            sx={{ 
              height: 42, 
              mr: 2,
              display: { xs: 'none', sm: 'block' },
              filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))'
            }} 
          />
          <Typography 
            variant="h5" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: '1.2px',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              background: 'linear-gradient(90deg, #ffffff, #e0e0e0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: { xs: 'none', sm: 'block' }
            }}
          >
            联通数智云平台
          </Typography>
          
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 600,
              letterSpacing: '1px',
              display: { xs: 'block', sm: 'none' }
            }}
          >
            联通数智
          </Typography>
          
          {isAuthenticated ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {!isMobile && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mr: 2,
                    backgroundColor: alpha(theme.palette.common.white, 0.1),
                    borderRadius: '20px',
                    px: 2,
                    py: 0.5
                  }}
                >
                  欢迎, {displayName}
                </Typography>
              )}
              
              <Tooltip title="通知中心">
                <IconButton 
                  color="inherit" 
                  onClick={handleNotificationOpen}
                  sx={{ 
                    mr: 1,
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.1)' }
                  }}
                >
                  <Badge badgeContent={notificationCount} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              
              <Tooltip title="帮助中心">
                <IconButton 
                  color="inherit"
                  sx={{ 
                    mr: 1,
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.1)' }
                  }}
                >
                  <HelpIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="用户菜单">
                <IconButton 
                  onClick={handleMenuOpen}
                  sx={{ 
                    p: 0.5,
                    border: '2px solid rgba(255,255,255,0.7)',
                    ml: 1,
                    transition: 'all 0.2s',
                    '&:hover': {
                      border: '2px solid white',
                      transform: 'scale(1.05)'
                    }
                  }}
                >
                  <Avatar 
                    src={avatarUrl}
                    sx={{ 
                      bgcolor: theme.palette.secondary.main,
                      width: 34,
                      height: 34,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                  >
                    {getUserInitial()}
                  </Avatar>
                </IconButton>
              </Tooltip>
              
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                TransitionComponent={Fade}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    borderRadius: 2,
                    minWidth: 200,
                    overflow: 'visible',
                    mt: 1.5,
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    src={avatarUrl}
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      mr: 1.5,
                      bgcolor: theme.palette.secondary.main
                    }}
                  >
                    {getUserInitial()}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {displayName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {getUserRoleName()}
                    </Typography>
                  </Box>
                </Box>
                <Divider />
                <MenuItem onClick={() => { navigate('/user/profile'); handleMenuClose(); }}>
                  <ListItemIcon>
                    <AccountCircleIcon fontSize="small" />
                  </ListItemIcon>
                  个人资料
                </MenuItem>
                <MenuItem onClick={() => { navigate('/settings'); handleMenuClose(); }}>
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  账户设置
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <ExitToAppIcon fontSize="small" />
                  </ListItemIcon>
                  退出登录
                </MenuItem>
              </Menu>
              
              <Menu
                anchorEl={notificationAnchorEl}
                open={Boolean(notificationAnchorEl)}
                onClose={handleNotificationClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                TransitionComponent={Fade}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    borderRadius: 2,
                    minWidth: 300,
                    overflow: 'visible',
                    mt: 1.5,
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    通知中心
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    您有 {notificationCount} 条未读通知
                  </Typography>
                </Box>
                <Divider />
                {notificationCount > 0 ? (
                  Array.from(new Array(notificationCount)).map((_, index) => (
                    <MenuItem key={index} onClick={handleNotificationClose}>
                      <Box sx={{ width: '100%' }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          系统通知 #{index + 1}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          这是一条系统通知，点击查看详情。
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))
                ) : (
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      暂无通知
                    </Typography>
                  </Box>
                )}
                <Divider />
                <MenuItem onClick={handleNotificationClose}>
                  <Typography variant="body2" sx={{ width: '100%', textAlign: 'center', color: 'primary.main' }}>
                    查看全部通知
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button
              color="inherit"
              startIcon={<LoginIcon />}
              onClick={() => navigate('/login')}
              sx={{ 
                borderRadius: '20px',
                px: 2,
                backgroundColor: alpha(theme.palette.primary.light, 0.1),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.light, 0.2),
                }
              }}
            >
              登录
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header; 