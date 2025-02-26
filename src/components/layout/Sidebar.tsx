import React from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Box, 
  Typography 
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

// 导入图标
import DashboardIcon from '@mui/icons-material/Dashboard';
import DevicesIcon from '@mui/icons-material/Devices';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StorageIcon from '@mui/icons-material/Storage';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  drawerWidth: number;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, drawerWidth }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  // 管理员菜单项
  const adminMenuItems = [
    { text: '仪表盘', icon: <DashboardIcon />, path: '/home' },
    { text: '设备管理', icon: <DevicesIcon />, path: '/admin/devices' },
    { text: '产品管理', icon: <InventoryIcon />, path: '/admin/products' },
  ];

  // 用户菜单项
  const userMenuItems = [
    { text: '数据产品', icon: <ShoppingCartIcon />, path: '/user/data-products' },
    { text: '数据源', icon: <StorageIcon />, path: '/user/data-sources' },
    { text: '我的订阅', icon: <SubscriptionsIcon />, path: '/user/subscriptions' },
    { text: '我的收藏', icon: <FavoriteIcon />, path: '/user/favorites' },
    { text: '个人资料', icon: <PersonIcon />, path: '/user/profile' },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    if (window.innerWidth < 600) {
      onClose();
    }
  };

  const menuItems = user?.role === 'admin' ? adminMenuItems : userMenuItems;

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#f5f5f5',
          borderRight: '1px solid #e0e0e0',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          联通数智平台
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            onClick={() => handleNavigate(item.path)}
            sx={{
              backgroundColor: location.pathname === item.path ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
              borderLeft: location.pathname === item.path ? '4px solid #1976d2' : '4px solid transparent',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
              },
              pl: 2,
              cursor: 'pointer'
            }}
          >
            <ListItemIcon sx={{ color: location.pathname === item.path ? '#1976d2' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              sx={{ 
                '& .MuiTypography-root': { 
                  fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                  color: location.pathname === item.path ? '#1976d2' : 'inherit'
                } 
              }} 
            />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar; 