import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Divider,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  CircularProgress,
  Badge
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { mockServiceAPIs, ServiceAPI } from '../../services/mockData';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CodeIcon from '@mui/icons-material/Code';
import DescriptionIcon from '@mui/icons-material/Description';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SpeedIcon from '@mui/icons-material/Speed';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import HttpIcon from '@mui/icons-material/Http';
import StorageIcon from '@mui/icons-material/Storage';
import CloudIcon from '@mui/icons-material/Cloud';
import MessageIcon from '@mui/icons-material/Message';
import PaymentIcon from '@mui/icons-material/Payment';
import BarChartIcon from '@mui/icons-material/BarChart';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

// 定义服务网关页面组件
const ServiceGatewayPage: React.FC = () => {
  // 状态管理
  const [services, setServices] = useState<ServiceAPI[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceAPI[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [selectedService, setSelectedService] = useState<ServiceAPI | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // 获取所有服务接口
  useEffect(() => {
    // 模拟API调用延迟
    const timer = setTimeout(() => {
      setServices(mockServiceAPIs);
      setFilteredServices(mockServiceAPIs);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // 处理搜索和筛选
  useEffect(() => {
    let result = [...services];

    // 应用搜索
    if (searchQuery) {
      result = result.filter(
        service =>
          service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          service.endpoint.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 应用分类筛选
    if (categoryFilter !== 'all') {
      result = result.filter(service => service.category === categoryFilter);
    }

    // 应用状态筛选
    if (statusFilter !== 'all') {
      result = result.filter(service => service.status === statusFilter);
    }

    // 应用方法筛选
    if (methodFilter !== 'all') {
      result = result.filter(service => service.method === methodFilter);
    }

    setFilteredServices(result);
  }, [services, searchQuery, categoryFilter, statusFilter, methodFilter]);

  // 处理搜索变化
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // 处理分类筛选变化
  const handleCategoryFilterChange = (event: SelectChangeEvent) => {
    setCategoryFilter(event.target.value);
  };

  // 处理状态筛选变化
  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
  };

  // 处理方法筛选变化
  const handleMethodFilterChange = (event: SelectChangeEvent) => {
    setMethodFilter(event.target.value);
  };

  // 处理查看详情
  const handleViewDetails = (service: ServiceAPI) => {
    setSelectedService(service);
    setOpenDialog(true);
  };

  // 处理关闭详情对话框
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // 处理添加/移除收藏
  const handleToggleFavorite = (serviceId: string) => {
    if (favorites.includes(serviceId)) {
      setFavorites(favorites.filter(id => id !== serviceId));
    } else {
      setFavorites([...favorites, serviceId]);
    }
  };

  // 处理标签页变化
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // 获取服务图标
  const getServiceIcon = (category: string) => {
    switch (category) {
      case '用户服务':
        return <PersonIcon fontSize="large" />;
      case '订单服务':
        return <ShoppingCartIcon fontSize="large" />;
      case '数据服务':
        return <StorageIcon fontSize="large" />;
      case '天气服务':
        return <CloudIcon fontSize="large" />;
      case '消息服务':
        return <MessageIcon fontSize="large" />;
      case '存储服务':
        return <StorageIcon fontSize="large" />;
      case '支付服务':
        return <PaymentIcon fontSize="large" />;
      case '分析服务':
        return <BarChartIcon fontSize="large" />;
      default:
        return <CodeIcon fontSize="large" />;
    }
  };

  // 获取方法颜色
  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return '#4caf50';
      case 'POST':
        return '#2196f3';
      case 'PUT':
        return '#ff9800';
      case 'DELETE':
        return '#f44336';
      default:
        return '#9e9e9e';
    }
  };

  // 获取状态标签
  const getStatusChip = (status: string) => {
    switch (status) {
      case 'active':
        return <Chip label="活跃" color="success" size="small" />;
      case 'deprecated':
        return <Chip label="已弃用" color="error" size="small" />;
      case 'beta':
        return <Chip label="测试版" color="warning" size="small" />;
      default:
        return <Chip label={status} color="default" size="small" />;
    }
  };

  // 获取唯一分类列表
  const getUniqueCategories = () => {
    const categories = services.map(service => service.category);
    return ['all', ...Array.from(new Set(categories))];
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        服务网关
      </Typography>

      <Paper sx={{ p: 3, mb: 4, borderRadius: '12px' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{ mb: 3 }}
        >
          <Tab label="服务超市" />
        </Tabs>

        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="搜索服务名称、描述或端点..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                <InputLabel>分类</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={handleCategoryFilterChange}
                  label="分类"
                >
                  <MenuItem value="all">全部分类</MenuItem>
                  {getUniqueCategories().filter(cat => cat !== 'all').map(category => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                <InputLabel>状态</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  label="状态"
                >
                  <MenuItem value="all">全部状态</MenuItem>
                  <MenuItem value="active">活跃</MenuItem>
                  <MenuItem value="deprecated">已弃用</MenuItem>
                  <MenuItem value="beta">测试版</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                <InputLabel>请求方法</InputLabel>
                <Select
                  value={methodFilter}
                  onChange={handleMethodFilterChange}
                  label="请求方法"
                >
                  <MenuItem value="all">全部方法</MenuItem>
                  <MenuItem value="GET">GET</MenuItem>
                  <MenuItem value="POST">POST</MenuItem>
                  <MenuItem value="PUT">PUT</MenuItem>
                  <MenuItem value="DELETE">DELETE</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      ) : filteredServices.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: 'center', borderRadius: '12px' }}>
          <Typography variant="h6" color="text.secondary">
            没有找到匹配的服务接口
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredServices.map(service => (
            <Grid item xs={12} sm={6} md={4} key={service.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: '12px',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <Box 
                  sx={{ 
                    p: 2, 
                    display: 'flex', 
                    alignItems: 'center',
                    bgcolor: 'primary.light',
                    color: 'white',
                    borderTopLeftRadius: '12px',
                    borderTopRightRadius: '12px'
                  }}
                >
                  <Box sx={{ mr: 2, color: 'white' }}>
                    {getServiceIcon(service.category)}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                      {service.name}
                    </Typography>
                    <Typography variant="body2">
                      {service.category} | 版本: {service.version}
                    </Typography>
                  </Box>
                  <Chip 
                    label={service.method} 
                    sx={{ 
                      bgcolor: getMethodColor(service.method),
                      color: 'white',
                      fontWeight: 'bold'
                    }} 
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: 40, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {service.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <HttpIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: 'grey.100', p: 0.5, borderRadius: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                      {service.endpoint}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Tooltip title="调用次数">
                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                          <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {service.callCount.toLocaleString()}
                          </Typography>
                        </Box>
                      </Tooltip>
                      <Tooltip title="平均响应时间">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <SpeedIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {service.avgResponseTime}ms
                          </Typography>
                        </Box>
                      </Tooltip>
                    </Box>
                    <Box>
                      {getStatusChip(service.status)}
                    </Box>
                  </Box>
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleViewDetails(service)}
                  >
                    查看详情
                  </Button>
                  <IconButton 
                    color={favorites.includes(service.id) ? 'error' : 'default'}
                    onClick={() => handleToggleFavorite(service.id)}
                  >
                    {favorites.includes(service.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* 服务详情对话框 */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedService && (
          <>
            <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center' }}>
              <Box sx={{ mr: 2 }}>
                {getServiceIcon(selectedService.category)}
              </Box>
              <Box>
                <Typography variant="h6">{selectedService.name}</Typography>
                <Typography variant="body2">{selectedService.category} | 版本: {selectedService.version}</Typography>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    接口描述
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {selectedService.description}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      基本信息
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">状态:</Typography>
                        <Box>{getStatusChip(selectedService.status)}</Box>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">请求方法:</Typography>
                        <Chip 
                          label={selectedService.method} 
                          size="small"
                          sx={{ 
                            bgcolor: getMethodColor(selectedService.method),
                            color: 'white'
                          }} 
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">请求格式:</Typography>
                        <Typography variant="body2">{selectedService.requestFormat}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">响应格式:</Typography>
                        <Typography variant="body2">{selectedService.responseFormat}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">创建时间:</Typography>
                        <Typography variant="body2">{new Date(selectedService.createdAt).toLocaleDateString()}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">更新时间:</Typography>
                        <Typography variant="body2">{new Date(selectedService.updatedAt).toLocaleDateString()}</Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      性能指标
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">调用次数:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {selectedService.callCount.toLocaleString()}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">平均响应时间:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {selectedService.avgResponseTime} ms
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      接口地址
                    </Typography>
                    <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, fontFamily: 'monospace' }}>
                      {selectedService.endpoint}
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      参数列表
                    </Typography>
                    {selectedService.parameters && selectedService.parameters.length > 0 ? (
                      <Box sx={{ overflowX: 'auto' }}>
                        <Box sx={{ minWidth: 500, display: 'table', width: '100%' }}>
                          <Box sx={{ display: 'table-header-group', bgcolor: 'grey.100' }}>
                            <Box sx={{ display: 'table-row' }}>
                              <Typography sx={{ display: 'table-cell', p: 1, fontWeight: 'bold' }}>参数名</Typography>
                              <Typography sx={{ display: 'table-cell', p: 1, fontWeight: 'bold' }}>类型</Typography>
                              <Typography sx={{ display: 'table-cell', p: 1, fontWeight: 'bold' }}>是否必填</Typography>
                              <Typography sx={{ display: 'table-cell', p: 1, fontWeight: 'bold' }}>描述</Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'table-row-group' }}>
                            {selectedService.parameters.map((param, index) => (
                              <Box key={index} sx={{ display: 'table-row' }}>
                                <Typography sx={{ display: 'table-cell', p: 1, fontFamily: 'monospace' }}>{param.name}</Typography>
                                <Typography sx={{ display: 'table-cell', p: 1 }}>{param.type}</Typography>
                                <Typography sx={{ display: 'table-cell', p: 1 }}>
                                  {param.required ? 
                                    <Chip label="必填" size="small" color="primary" /> : 
                                    <Chip label="可选" size="small" variant="outlined" />
                                  }
                                </Typography>
                                <Typography sx={{ display: 'table-cell', p: 1 }}>{param.description}</Typography>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        该接口没有参数
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button 
                startIcon={<DescriptionIcon />}
                href={selectedService.documentation} 
                target="_blank"
                color="primary"
              >
                查看文档
              </Button>
              <Button onClick={handleCloseDialog}>关闭</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ServiceGatewayPage; 