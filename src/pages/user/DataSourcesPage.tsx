import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Alert,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Divider,
  FormControlLabel,
  Switch,
  Avatar
} from '@mui/material';
import { DataSource, mockDataSources } from '../../services/mockData';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import StorageIcon from '@mui/icons-material/Storage';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import AddDataSourceForm from '../../components/datasource/AddDataSourceForm';

const DataSourcesPage: React.FC = () => {
  const [dataSources, setDataSources] = useState<DataSource[]>(mockDataSources);
  const [selectedDataSource, setSelectedDataSource] = useState<DataSource | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openTestDialog, setOpenTestDialog] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showConnectionDetails, setShowConnectionDetails] = useState(false);
  
  // 获取所有数据源类型
  const dataSourceTypes = Array.from(new Set(dataSources.map(ds => ds.type)));
  
  // 处理类型筛选变化
  const handleTypeFilterChange = (event: SelectChangeEvent) => {
    setFilterType(event.target.value);
  };
  
  // 处理状态筛选变化
  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setFilterStatus(event.target.value);
  };
  
  // 处理搜索变化
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  // 筛选数据源
  const filteredDataSources = dataSources.filter(dataSource => {
    const matchesType = filterType === 'all' || dataSource.type === filterType;
    const matchesStatus = filterStatus === 'all' || dataSource.status === filterStatus;
    const matchesSearch = dataSource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataSource.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesStatus && matchesSearch;
  });
  
  // 打开数据源详情对话框
  const handleOpenDetails = (dataSource: DataSource) => {
    setSelectedDataSource(dataSource);
    setOpenDialog(true);
  };
  
  // 关闭数据源详情对话框
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  // 打开添加数据源对话框
  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };
  
  // 关闭添加数据源对话框
  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };
  
  // 打开删除确认对话框
  const handleOpenDeleteDialog = (dataSource: DataSource) => {
    setSelectedDataSource(dataSource);
    setOpenDeleteDialog(true);
  };
  
  // 关闭删除确认对话框
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };
  
  // 打开测试连接对话框
  const handleOpenTestDialog = (dataSource: DataSource) => {
    setSelectedDataSource(dataSource);
    setOpenTestDialog(true);
    
    // 模拟测试连接过程
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70%概率成功
      if (success) {
        setSuccessMessage(`数据源 "${dataSource.name}" 连接测试成功！`);
      } else {
        setSuccessMessage(`数据源 "${dataSource.name}" 连接测试失败，请检查连接参数。`);
      }
      setOpenTestDialog(false);
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }, 2000);
  };
  
  // 关闭测试连接对话框
  const handleCloseTestDialog = () => {
    setOpenTestDialog(false);
  };
  
  // 删除数据源
  const handleDeleteDataSource = () => {
    if (!selectedDataSource) return;
    
    setDataSources(dataSources.filter(ds => ds.id !== selectedDataSource.id));
    setOpenDeleteDialog(false);
    
    // 显示成功消息
    setSuccessMessage('数据源删除成功');
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };
  
  // 切换数据源状态
  const handleToggleStatus = (dataSource: DataSource) => {
    const updatedDataSources = dataSources.map(ds => {
      if (ds.id === dataSource.id) {
        return {
          ...ds,
          status: ds.status === 'active' ? 'inactive' : 'active' as 'active' | 'inactive'
        };
      }
      return ds;
    });
    
    setDataSources(updatedDataSources);
    
    // 显示成功消息
    const newStatus = dataSource.status === 'active' ? '禁用' : '启用';
    setSuccessMessage(`数据源 "${dataSource.name}" 已${newStatus}`);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };
  
  // 获取数据源状态的显示样式
  const getStatusChip = (status: string) => {
    switch (status) {
      case 'active':
        return <Chip label="已连接" color="success" size="small" />;
      case 'inactive':
        return <Chip label="已断开" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };
  
  // 获取数据源图片（使用可靠的随机图片服务）
  const getDataSourceImage = (type: string, dataSourceId: string) => {
    // 使用数据源ID作为种子，确保同一数据源每次显示相同图片
    const seed = dataSourceId.charCodeAt(0) + dataSourceId.charCodeAt(dataSourceId.length - 1);
    const imageId = (seed % 1000) + 1;
    
    let typeTerm;
    switch (type) {
      case 'MySQL':
        typeTerm = 'database';
        break;
      case 'PostgreSQL':
        typeTerm = 'postgres';
        break;
      case 'MongoDB':
        typeTerm = 'mongodb';
        break;
      case 'Oracle':
        typeTerm = 'oracle';
        break;
      case 'API':
        typeTerm = 'api';
        break;
      case 'CSV':
        typeTerm = 'file';
        break;
      default:
        typeTerm = 'datasource';
    }
    
    // 使用picsum.photos服务，它提供稳定的随机图片
    return `https://picsum.photos/seed/${typeTerm}${imageId}/300/200`;
  };

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
              bgcolor: 'primary.main', 
              width: 56, 
              height: 56, 
              mr: 2,
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}
          >
            <StorageIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 700, 
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                letterSpacing: '0.5px'
              }}
            >
              数据源管理
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 500, 
                color: '#555',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              管理您的数据源连接
              <Box 
                component="span" 
                sx={{ 
                  display: 'inline-block', 
                  ml: 1,
                  px: 1.5, 
                  py: 0.5, 
                  bgcolor: 'rgba(25, 118, 210, 0.1)', 
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
              >
                {filteredDataSources.length} 个数据源
              </Box>
            </Typography>
          </Box>
        </Box>
      </Paper>

      {successMessage && (
        <Alert 
          severity="success" 
          sx={{ 
            mb: 3, 
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}
        >
          {successMessage}
        </Alert>
      )}

      {/* 操作按钮 */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
          sx={{ 
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(25, 118, 210, 0.25)'
          }}
        >
          添加数据源
        </Button>
      </Box>

      {/* 筛选和搜索 */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <FilterListIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>筛选条件</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
              <TextField
                fullWidth
                label="搜索数据源"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>类型</InputLabel>
              <Select
                value={filterType}
                label="类型"
                onChange={handleTypeFilterChange}
              >
                <MenuItem value="all">全部类型</MenuItem>
                {dataSourceTypes.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>状态</InputLabel>
              <Select
                value={filterStatus}
                label="状态"
                onChange={handleStatusFilterChange}
              >
                <MenuItem value="all">全部状态</MenuItem>
                <MenuItem value="active">已连接</MenuItem>
                <MenuItem value="inactive">未连接</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* 数据源列表 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          找到 {filteredDataSources.length} 个数据源
        </Typography>
        
        <Grid container spacing={3}>
          {filteredDataSources.map(dataSource => (
            <Grid item key={dataSource.id} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={getDataSourceImage(dataSource.type, dataSource.id)}
                  alt={dataSource.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" component="div" noWrap>
                      {dataSource.name}
                    </Typography>
                    {getStatusChip(dataSource.status)}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {dataSource.type} 数据源
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">
                        连接信息
                      </Typography>
                      <Typography variant="body2" noWrap>
                        {dataSource.connectionDetails.host}:{dataSource.connectionDetails.port}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">
                        数据库
                      </Typography>
                      <Typography variant="body2" noWrap>
                        {dataSource.connectionDetails.database}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">
                        创建时间
                      </Typography>
                      <Typography variant="body2" noWrap>
                        {new Date(dataSource.createdAt).toLocaleDateString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
                <CardActions>
                  <Button size="small" startIcon={<VisibilityIcon />} onClick={() => handleOpenDetails(dataSource)}>
                    详情
                  </Button>
                  <Button 
                    size="small" 
                    startIcon={dataSource.status === 'active' ? <LinkOffIcon /> : <LinkIcon />}
                    color={dataSource.status === 'active' ? 'warning' : 'success'}
                    onClick={() => handleToggleStatus(dataSource)}
                  >
                    {dataSource.status === 'active' ? '断开' : '连接'}
                  </Button>
                  <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleOpenDeleteDialog(dataSource)}>
                    删除
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        {filteredDataSources.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="h6" color="text.secondary">
              没有找到符合条件的数据源
            </Typography>
            <Typography variant="body2" color="text.secondary">
              请尝试调整筛选条件或添加新的数据源
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenAddDialog}
              sx={{ mt: 2 }}
            >
              添加数据源
            </Button>
          </Box>
        )}
      </Box>
      
      {/* 数据源详情对话框 */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedDataSource && (
          <>
            <DialogTitle>
              数据源详情 - {selectedDataSource.name}
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={getDataSourceImage(selectedDataSource.type, selectedDataSource.id)}
                    alt={selectedDataSource.name}
                    sx={{ borderRadius: 1, mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">数据源ID</Typography>
                  <Typography variant="body1" gutterBottom>{selectedDataSource.id}</Typography>
                  
                  <Typography variant="subtitle2">状态</Typography>
                  <Box sx={{ mt: 0.5, mb: 1 }}>{getStatusChip(selectedDataSource.status)}</Box>
                  
                  <Typography variant="subtitle2">类型</Typography>
                  <Typography variant="body1" gutterBottom>{selectedDataSource.type}</Typography>
                  
                  <Typography variant="subtitle2">创建时间</Typography>
                  <Typography variant="body1" gutterBottom>
                    {new Date(selectedDataSource.createdAt).toLocaleString()}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2">数据源名称</Typography>
                  <Typography variant="body1" gutterBottom>{selectedDataSource.name}</Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 1 }}>
                    <Typography variant="h6">连接详情</Typography>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={showConnectionDetails}
                          onChange={() => setShowConnectionDetails(!showConnectionDetails)}
                          color="primary"
                        />
                      }
                      label="显示敏感信息"
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">主机地址</Typography>
                  <Typography variant="body1" gutterBottom>{selectedDataSource.connectionDetails.host}</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">端口</Typography>
                  <Typography variant="body1" gutterBottom>{selectedDataSource.connectionDetails.port}</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">数据库名称</Typography>
                  <Typography variant="body1" gutterBottom>{selectedDataSource.connectionDetails.database}</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">用户名</Typography>
                  <Typography variant="body1" gutterBottom>
                    {showConnectionDetails ? selectedDataSource.connectionDetails.username : '••••••••'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">SSL连接</Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedDataSource.connectionDetails.ssl ? '启用' : '禁用'}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button 
                startIcon={<RefreshIcon />} 
                color="primary" 
                onClick={() => {
                  handleCloseDialog();
                  handleOpenTestDialog(selectedDataSource);
                }}
              >
                测试连接
              </Button>
              <Button onClick={handleCloseDialog}>关闭</Button>
              <Button color="primary">编辑</Button>
              <Button 
                color="error" 
                onClick={() => {
                  handleCloseDialog();
                  handleOpenDeleteDialog(selectedDataSource);
                }}
              >
                删除
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* 添加数据源对话框 */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          添加数据源
        </DialogTitle>
        <DialogContent dividers>
          <AddDataSourceForm 
            onSubmit={(newDataSource) => {
              // 生成唯一ID
              const id = `DS${(dataSources.length + 1).toString().padStart(3, '0')}`;
              
              // 创建完整的数据源对象
              const completeDataSource: DataSource = {
                ...newDataSource,
                id,
                createdAt: new Date().toISOString()
              };
              
              // 添加到数据源列表
              setDataSources([...dataSources, completeDataSource]);
              
              // 关闭对话框
              setOpenAddDialog(false);
              
              // 显示成功消息
              setSuccessMessage('数据源添加成功');
              setTimeout(() => {
                setSuccessMessage(null);
              }, 3000);
            }}
            onCancel={handleCloseAddDialog}
          />
        </DialogContent>
      </Dialog>
      
      {/* 删除确认对话框 */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>
          确认删除
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            您确定要删除数据源 "{selectedDataSource?.name}" 吗？此操作无法撤销，并且可能会影响依赖此数据源的数据产品。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>取消</Button>
          <Button color="error" onClick={handleDeleteDataSource}>删除</Button>
        </DialogActions>
      </Dialog>
      
      {/* 测试连接对话框 */}
      <Dialog open={openTestDialog} onClose={handleCloseTestDialog}>
        <DialogTitle>
          测试连接
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            正在测试与数据源 "{selectedDataSource?.name}" 的连接...
          </DialogContentText>
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <RefreshIcon sx={{ fontSize: 40, animation: 'spin 2s linear infinite' }} />
          </Box>
        </DialogContent>
      </Dialog>
      
      {/* 添加旋转动画 */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Container>
  );
};

export default DataSourcesPage; 