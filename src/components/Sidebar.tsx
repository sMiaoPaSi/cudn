import React, { useState } from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider,
  Box,
  Typography,
  ListItemButton,
  Toolbar,
  Collapse,
  Popover,
  Paper
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useTheme } from '@mui/material/styles';

// 导入图标
import HomeIcon from '@mui/icons-material/Home';
import DevicesIcon from '@mui/icons-material/Devices';
import StorageIcon from '@mui/icons-material/Storage';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import HistoryIcon from '@mui/icons-material/History';
import DataObjectIcon from '@mui/icons-material/DataObject';
import CategoryIcon from '@mui/icons-material/Category';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloudIcon from '@mui/icons-material/Cloud';

// 定义侧边栏宽度常量
const DRAWER_WIDTH = 240;

// 定义菜单项类型
interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: SubMenuItem[];
  roles: ('admin' | 'user')[];
}

interface SubMenuItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
}

const Sidebar = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  
  // 状态管理
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  
  // 菜单配置
  const menuItems: MenuItem[] = [
    {
      id: 'home',
      label: '首页',
      icon: <HomeIcon />,
      path: '/home',
      roles: ['admin', 'user']
    },
    {
      id: 'catalog',
      label: '产品目录',
      icon: <ShoppingCartIcon />,
      path: '/user/catalog',
      roles: ['admin', 'user']
    },
    {
      id: 'devices',
      label: '设备中心',
      icon: <DevicesIcon />,
      children: [
        {
          id: 'device-management',
          label: '设备管理',
          path: '/user/devices',
          icon: <DevicesIcon />
        },
        {
          id: 'favorites',
          label: '我的收藏',
          path: '/user/favorites',
          icon: <FavoriteIcon />
        }
      ],
      roles: ['user']
    },
    {
      id: 'data',
      label: '数据中心',
      icon: <StorageIcon />,
      children: [
        {
          id: 'data-sources',
          label: '数据源管理',
          path: '/user/datasources',
          icon: <DataObjectIcon />
        },
        {
          id: 'data-products',
          label: '数据产品管理',
          path: '/user/dataproducts',
          icon: <CategoryIcon />
        },
        {
          id: 'service-gateway',
          label: '服务网关',
          path: '/user/service-gateway',
          icon: <CloudIcon />
        }
      ],
      roles: ['user']
    },
    {
      id: 'delivery',
      label: '交付中心',
      icon: <LocalShippingIcon />,
      children: [
        {
          id: 'subscriptions',
          label: '订阅管理',
          path: '/user/subscriptions',
          icon: <SubscriptionsIcon />
        },
        {
          id: 'subscription-history',
          label: '历史订阅',
          path: '/user/subscription-history',
          icon: <HistoryIcon />
        }
      ],
      roles: ['user']
    },
    {
      id: 'system',
      label: '系统管理',
      icon: <SettingsIcon />,
      path: '/admin/devices',
      roles: ['admin']
    },
    {
      id: 'profile',
      label: '个人资料',
      icon: <PersonIcon />,
      path: '/user/profile',
      roles: ['admin', 'user']
    }
  ];
  
  // 处理菜单点击
  const handleMenuClick = (item: MenuItem) => {
    if (item.path) {
      navigate(item.path);
    }
  };
  
  // 处理子菜单悬浮
  const handleSubMenuHover = (event: React.MouseEvent<HTMLElement>, item: MenuItem) => {
    if (item.children && item.children.length > 0) {
      setAnchorEl(event.currentTarget);
      setActiveMenu(item.id);
    }
  };
  
  // 处理子菜单关闭
  const handleSubMenuClose = () => {
    setAnchorEl(null);
    setActiveMenu(null);
  };
  
  // 处理子菜单项点击
  const handleSubMenuItemClick = (path: string) => {
    navigate(path);
    handleSubMenuClose();
  };
  
  // 检查路径是否匹配当前菜单项或其子菜单
  const isPathActive = (item: MenuItem) => {
    if (item.path && location.pathname === item.path) {
      return true;
    }
    
    if (item.children) {
      return item.children.some(child => location.pathname === child.path);
    }
    
    return false;
  };
  
  // 过滤当前用户可见的菜单项
  const filteredMenuItems = menuItems.filter(item => 
    user?.role ? item.roles.includes(user.role) : false
  );
  
  // 弹出菜单是否打开
  const open = Boolean(anchorEl);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          background: theme.palette.mode === 'light' 
            ? 'linear-gradient(180deg, #f5f7fa 0%, #ffffff 100%)' 
            : 'linear-gradient(180deg, #1a2035 0%, #121212 100%)',
          borderRight: `1px solid ${theme.palette.divider}`,
          boxShadow: '2px 0 10px rgba(0, 0, 0, 0.05)',
          pt: 2
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto', px: 1, mt: 1 }}>
        <List>
          <ListItem sx={{ 
            justifyContent: 'center', 
            mb: 2, 
            borderRadius: 1,
            background: theme.palette.mode === 'light' 
              ? 'rgba(25, 118, 210, 0.08)' 
              : 'rgba(255, 255, 255, 0.05)',
            py: 1
          }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 600,
                color: theme.palette.primary.main
              }}
            >
              用户菜单
            </Typography>
          </ListItem>
          
          {filteredMenuItems.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                onClick={() => handleMenuClick(item)}
                onMouseEnter={(e) => handleSubMenuHover(e, item)}
                selected={isPathActive(item)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.mode === 'light' 
                      ? 'rgba(25, 118, 210, 0.12)' 
                      : 'rgba(255, 255, 255, 0.08)',
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'light' 
                        ? 'rgba(25, 118, 210, 0.18)' 
                        : 'rgba(255, 255, 255, 0.12)',
                    },
                  },
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'light' 
                      ? 'rgba(0, 0, 0, 0.04)' 
                      : 'rgba(255, 255, 255, 0.05)',
                  },
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: 40,
                  color: isPathActive(item)
                    ? theme.palette.primary.main 
                    : theme.palette.text.secondary
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label} 
                  primaryTypographyProps={{ 
                    fontSize: '0.95rem',
                    fontWeight: isPathActive(item) ? 600 : 400
                  }}
                />
                {item.children && item.children.length > 0 && (
                  <ArrowRightIcon fontSize="small" color="action" />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      
      {/* 子菜单弹出框 */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleSubMenuClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        PaperProps={{
          onMouseLeave: handleSubMenuClose,
          sx: {
            mt: 0,
            ml: 1,
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            borderRadius: 2,
            width: 200
          }
        }}
      >
        <Paper sx={{ p: 1 }}>
          <List dense>
            {activeMenu && menuItems.find(item => item.id === activeMenu)?.children?.map((subItem) => (
              <ListItem key={subItem.id} disablePadding>
                <ListItemButton
                  onClick={() => handleSubMenuItemClick(subItem.path)}
                  selected={location.pathname === subItem.path}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.mode === 'light' 
                        ? 'rgba(25, 118, 210, 0.12)' 
                        : 'rgba(255, 255, 255, 0.08)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ 
                    minWidth: 36,
                    color: location.pathname === subItem.path
                      ? theme.palette.primary.main 
                      : theme.palette.text.secondary
                  }}>
                    {subItem.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={subItem.label} 
                    primaryTypographyProps={{ 
                      fontSize: '0.9rem',
                      fontWeight: location.pathname === subItem.path ? 600 : 400
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Popover>
    </Drawer>
  );
};

export default Sidebar; 