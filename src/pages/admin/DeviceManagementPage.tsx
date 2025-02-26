import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Avatar
} from '@mui/material';
import { Device, mockDevices } from '../../services/mockData';
import DevicesIcon from '@mui/icons-material/Devices';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const DeviceManagementPage: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const rowsPerPage = 5;

  // 处理状态筛选变化
  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setFilterStatus(event.target.value);
    setPage(1);
  };

  // 处理类型筛选变化
  const handleTypeFilterChange = (event: SelectChangeEvent) => {
    setFilterType(event.target.value);
    setPage(1);
  };

  // 处理搜索变化
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  // 筛选设备
  const filteredDevices = devices.filter(device => {
    const matchesStatus = filterStatus === 'all' || device.status === filterStatus;
    const matchesType = filterType === 'all' || device.type === filterType;
    const matchesSearch = device.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesType && matchesSearch;
  });

  // 计算分页
  const totalPages = Math.ceil(filteredDevices.length / rowsPerPage);
  const displayedDevices = filteredDevices.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // 处理页面变化
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // 打开设备详情对话框
  const handleOpenDetails = (device: Device) => {
    setSelectedDevice(device);
    setOpenDialog(true);
  };

  // 关闭设备详情对话框
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // 禁用设备
  const handleDisableDevice = (deviceId: string) => {
    setDevices(prevDevices =>
      prevDevices.map(device =>
        device.id === deviceId
          ? { ...device, status: 'disabled' }
          : device
      )
    );
  };

  // 获取设备状态的显示样式
  const getStatusChip = (status: string) => {
    switch (status) {
      case 'active':
        return <Chip label="活跃" color="success" size="small" />;
      case 'inactive':
        return <Chip label="非活跃" color="warning" size="small" />;
      case 'disabled':
        return <Chip label="已禁用" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  // 获取设备类型的唯一值列表
  const deviceTypes = Array.from(new Set(devices.map(device => device.type)));

  return (
    <Container maxWidth="lg">
      <Paper 
        elevation={3} 
        sx={{ 
          mt: 4, 
          mb: 4, 
          p: 3, 
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(45deg, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0.1) 100%)',
            zIndex: 0
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center' }}>
          <Avatar 
            sx={{ 
              bgcolor: 'primary.dark', 
              width: 56, 
              height: 56, 
              mr: 2,
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}
          >
            <DevicesIcon fontSize="large" />
          </Avatar>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 700, 
                  background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  letterSpacing: '0.5px',
                  mr: 1
                }}
              >
                设备管理
              </Typography>
              <Chip 
                icon={<AdminPanelSettingsIcon />} 
                label="管理员" 
                color="primary" 
                size="small"
                sx={{ 
                  fontWeight: 600,
                  mb: 1
                }}
              />
            </Box>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 500, 
                color: '#555',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              管理和监控所有设备
              <Box 
                component="span" 
                sx={{ 
                  display: 'inline-block', 
                  ml: 1,
                  px: 1.5, 
                  py: 0.5, 
                  bgcolor: 'rgba(21, 101, 192, 0.1)', 
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
              >
                {filteredDevices.length} 个设备
              </Box>
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* 筛选和搜索 */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <FilterListIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>筛选条件</Typography>
        </Box>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
              <TextField
                fullWidth
                label="搜索设备"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>状态</InputLabel>
              <Select
                value={filterStatus}
                label="状态"
                onChange={handleStatusFilterChange}
              >
                <MenuItem value="all">全部</MenuItem>
                <MenuItem value="active">活跃</MenuItem>
                <MenuItem value="inactive">非活跃</MenuItem>
                <MenuItem value="disabled">已禁用</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>类型</InputLabel>
              <Select
                value={filterType}
                label="类型"
                onChange={handleTypeFilterChange}
              >
                <MenuItem value="all">全部</MenuItem>
                {deviceTypes.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="body2" color="text.secondary">
              共 {filteredDevices.length} 个设备
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* 设备表格 */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>设备ID</TableCell>
              <TableCell>状态</TableCell>
              <TableCell>类型</TableCell>
              <TableCell>接入时间</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedDevices.map((device) => (
              <TableRow key={device.id}>
                <TableCell>{device.id}</TableCell>
                <TableCell>{getStatusChip(device.status)}</TableCell>
                <TableCell>{device.type}</TableCell>
                <TableCell>{new Date(device.connectionTime).toLocaleString()}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => handleOpenDetails(device)}
                    sx={{ mr: 1 }}
                  >
                    详情
                  </Button>
                  {device.status !== 'disabled' && (
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDisableDevice(device.id)}
                    >
                      禁用
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 分页 */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      {/* 设备详情对话框 */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedDevice && (
          <>
            <DialogTitle>
              设备详情 - {selectedDevice.id}
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">设备ID</Typography>
                  <Typography variant="body1" gutterBottom>{selectedDevice.id}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">状态</Typography>
                  <Box sx={{ mt: 0.5, mb: 1 }}>{getStatusChip(selectedDevice.status)}</Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">类型</Typography>
                  <Typography variant="body1" gutterBottom>{selectedDevice.type}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">接入时间</Typography>
                  <Typography variant="body1" gutterBottom>
                    {new Date(selectedDevice.connectionTime).toLocaleString()}
                  </Typography>
                </Grid>
                
                {selectedDevice.details && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>详细信息</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">型号</Typography>
                      <Typography variant="body1" gutterBottom>{selectedDevice.details.model}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">序列号</Typography>
                      <Typography variant="body1" gutterBottom>{selectedDevice.details.serialNumber}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">位置</Typography>
                      <Typography variant="body1" gutterBottom>{selectedDevice.details.location}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2">最后维护时间</Typography>
                      <Typography variant="body1" gutterBottom>{selectedDevice.details.lastMaintenance}</Typography>
                    </Grid>
                  </>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              {selectedDevice.status !== 'disabled' && (
                <Button 
                  color="error" 
                  onClick={() => {
                    handleDisableDevice(selectedDevice.id);
                    handleCloseDialog();
                  }}
                >
                  禁用设备
                </Button>
              )}
              <Button onClick={handleCloseDialog}>关闭</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default DeviceManagementPage; 