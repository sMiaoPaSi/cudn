import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Paper,
  IconButton,
  Alert,
  CardMedia,
  Divider,
  Tabs,
  Tab,
  Tooltip,
  Avatar
} from '@mui/material';
import { Product, DataSource, mockProducts, mockDataSources } from '../../services/mockData';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

// 收藏项类型
interface FavoriteItem {
  id: string;
  itemId: string;
  itemType: 'product' | 'dataSource';
  addedAt: string;
}

const FavoritesPage: React.FC = () => {
  // 从localStorage获取收藏数据，而不是使用模拟数据
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    // 尝试从localStorage获取收藏数据
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedDataSource, setSelectedDataSource] = useState<DataSource | null>(null);
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [openDataSourceDialog, setOpenDataSourceDialog] = useState(false);
  const [openRemoveDialog, setOpenRemoveDialog] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<FavoriteItem | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 当收藏变化时保存到localStorage
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // 处理标签页变化
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // 处理搜索变化
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // 获取收藏的产品
  const getFavoriteProducts = () => {
    const productIds = favorites
      .filter(fav => fav.itemType === 'product')
      .map(fav => fav.itemId);
    
    return mockProducts.filter(product => productIds.includes(product.id));
  };

  // 获取收藏的数据源
  const getFavoriteDataSources = () => {
    const dataSourceIds = favorites
      .filter(fav => fav.itemType === 'dataSource')
      .map(fav => fav.itemId);
    
    return mockDataSources.filter(ds => dataSourceIds.includes(ds.id));
  };

  // 筛选收藏项
  const filteredProducts = getFavoriteProducts().filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDataSources = getFavoriteDataSources().filter(ds => 
    ds.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ds.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 打开产品详情对话框
  const handleOpenProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setOpenProductDialog(true);
  };

  // 关闭产品详情对话框
  const handleCloseProductDialog = () => {
    setOpenProductDialog(false);
  };

  // 打开数据源详情对话框
  const handleOpenDataSourceDetails = (dataSource: DataSource) => {
    setSelectedDataSource(dataSource);
    setOpenDataSourceDialog(true);
  };

  // 关闭数据源详情对话框
  const handleCloseDataSourceDialog = () => {
    setOpenDataSourceDialog(false);
  };

  // 打开移除确认对话框
  const handleOpenRemoveDialog = (item: FavoriteItem) => {
    setItemToRemove(item);
    setOpenRemoveDialog(true);
  };

  // 关闭移除确认对话框
  const handleCloseRemoveDialog = () => {
    setOpenRemoveDialog(false);
  };

  // 从收藏中移除项目
  const handleRemoveFromFavorites = () => {
    if (!itemToRemove) return;

    setFavorites(favorites.filter(fav => fav.id !== itemToRemove.id));
    setOpenRemoveDialog(false);

    // 获取项目名称
    let itemName = '';
    if (itemToRemove.itemType === 'product') {
      const product = mockProducts.find(p => p.id === itemToRemove.itemId);
      itemName = product ? product.name : itemToRemove.itemId;
    } else {
      const dataSource = mockDataSources.find(ds => ds.id === itemToRemove.itemId);
      itemName = dataSource ? dataSource.name : itemToRemove.itemId;
    }

    // 显示成功消息
    setSuccessMessage(`已从收藏中移除 "${itemName}"`);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  // 获取产品图片
  const getProductImage = (category: string, productId: string) => {
    // 使用产品ID作为种子，确保同一产品每次显示相同图片
    const seed = productId.charCodeAt(0) + productId.charCodeAt(productId.length - 1);
    const imageId = (seed % 1000) + 1;
    
    let categoryTerm;
    switch (category) {
      case '云存储':
        categoryTerm = 'storage';
        break;
      case '云计算':
        categoryTerm = 'compute';
        break;
      case '安全服务':
        categoryTerm = 'security';
        break;
      case '数据分析':
        categoryTerm = 'analytics';
        break;
      case '人工智能':
        categoryTerm = 'ai';
        break;
      case '物联网':
        categoryTerm = 'iot';
        break;
      case '大数据':
        categoryTerm = 'bigdata';
        break;
      default:
        categoryTerm = 'cloud';
    }
    
    // 使用picsum.photos服务，它提供稳定的随机图片
    return `https://picsum.photos/seed/${categoryTerm}${imageId}/300/200`;
  };

  // 获取数据源图片
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

  // 获取产品状态的显示样式
  const getProductStatusChip = (status: string) => {
    switch (status) {
      case 'active':
        return <Chip label="已上线" color="success" size="small" />;
      case 'inactive':
        return <Chip label="已下线" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  // 获取数据源状态的显示样式
  const getDataSourceStatusChip = (status: string) => {
    switch (status) {
      case 'active':
        return <Chip label="已连接" color="success" size="small" />;
      case 'inactive':
        return <Chip label="已断开" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
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
            <FavoriteIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 700, 
                background: 'linear-gradient(45deg, #d32f2f, #f44336)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                letterSpacing: '0.5px'
              }}
            >
              我的收藏
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
              管理您收藏的产品和数据源
              <Box 
                component="span" 
                sx={{ 
                  display: 'inline-block', 
                  ml: 1,
                  px: 1.5, 
                  py: 0.5, 
                  bgcolor: 'rgba(211, 47, 47, 0.1)', 
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
              >
                {favorites.length} 个收藏项
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

      <Paper sx={{ p: 3, mb: 3, borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <FilterListIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>筛选条件</Typography>
        </Box>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="收藏类型标签页">
            <Tab label="全部" />
            <Tab label="产品" />
            <Tab label="数据源" />
          </Tabs>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 2 }}>
          <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
          <TextField
            fullWidth
            label="搜索收藏项"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Box>
      </Paper>

      {/* 收藏内容 */}
      <Box sx={{ mb: 4 }}>
        {/* 产品标签页 */}
        {tabValue === 0 && (
          <>
            <Grid container spacing={3}>
              {filteredProducts.map(product => (
                <Grid item key={product.id} xs={12} sm={6} md={4}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={getProductImage(product.category, product.id)}
                      alt={product.name}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" component="div" noWrap>
                          {product.name}
                        </Typography>
                        {getProductStatusChip(product.status)}
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: '40px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {product.description}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            类别
                          </Typography>
                          <Typography variant="body2" noWrap>
                            {product.category}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            价格
                          </Typography>
                          <Typography variant="body2" noWrap>
                            ¥{product.price}/月
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                    <CardActions>
                      <Button size="small" startIcon={<VisibilityIcon />} onClick={() => handleOpenProductDetails(product)}>
                        详情
                      </Button>
                      <Button size="small" startIcon={<ShoppingCartIcon />}>
                        订阅
                      </Button>
                      <Tooltip title="从收藏中移除">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => {
                            const favoriteItem = favorites.find(fav => fav.itemId === product.id && fav.itemType === 'product');
                            if (favoriteItem) handleOpenRemoveDialog(favoriteItem);
                          }}
                        >
                          <FavoriteIcon />
                        </IconButton>
                      </Tooltip>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {filteredProducts.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 5 }}>
                <Typography variant="h6" color="text.secondary">
                  没有找到符合条件的收藏产品
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  请尝试调整搜索条件或从产品目录中添加收藏
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<FavoriteBorderIcon />}
                  sx={{ mt: 2 }}
                  href="/user/catalog"
                >
                  浏览产品目录
                </Button>
              </Box>
            )}
          </>
        )}

        {/* 数据源标签页 */}
        {tabValue === 1 && (
          <>
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
                        {getDataSourceStatusChip(dataSource.status)}
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
                      </Grid>
                    </CardContent>
                    <CardActions>
                      <Button size="small" startIcon={<VisibilityIcon />} onClick={() => handleOpenDataSourceDetails(dataSource)}>
                        详情
                      </Button>
                      <Tooltip title="从收藏中移除">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => {
                            const favoriteItem = favorites.find(fav => fav.itemId === dataSource.id && fav.itemType === 'dataSource');
                            if (favoriteItem) handleOpenRemoveDialog(favoriteItem);
                          }}
                        >
                          <FavoriteIcon />
                        </IconButton>
                      </Tooltip>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {filteredDataSources.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 5 }}>
                <Typography variant="h6" color="text.secondary">
                  没有找到符合条件的收藏数据源
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  请尝试调整搜索条件或从数据源管理中添加收藏
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<FavoriteBorderIcon />}
                  sx={{ mt: 2 }}
                  href="/user/datasources"
                >
                  浏览数据源
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>

      {/* 产品详情对话框 */}
      <Dialog open={openProductDialog} onClose={handleCloseProductDialog} maxWidth="md" fullWidth>
        {selectedProduct && (
          <>
            <DialogTitle>
              产品详情 - {selectedProduct.name}
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={getProductImage(selectedProduct.category, selectedProduct.id)}
                    alt={selectedProduct.name}
                    sx={{ borderRadius: 1, mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">产品ID</Typography>
                  <Typography variant="body1" gutterBottom>{selectedProduct.id}</Typography>
                  
                  <Typography variant="subtitle2">状态</Typography>
                  <Box sx={{ mt: 0.5, mb: 1 }}>{getProductStatusChip(selectedProduct.status)}</Box>
                  
                  <Typography variant="subtitle2">价格</Typography>
                  <Typography variant="body1" gutterBottom>¥{selectedProduct.price}/月</Typography>
                  
                  <Typography variant="subtitle2">创建时间</Typography>
                  <Typography variant="body1" gutterBottom>
                    {new Date(selectedProduct.createdAt).toLocaleString()}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2">产品名称</Typography>
                  <Typography variant="body1" gutterBottom>{selectedProduct.name}</Typography>
                  
                  <Typography variant="subtitle2">描述</Typography>
                  <Typography variant="body1" gutterBottom>{selectedProduct.description}</Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>产品详情</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">类别</Typography>
                  <Typography variant="body1" gutterBottom>{selectedProduct.category}</Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>订阅要求</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">最小订阅时长（月）</Typography>
                  <Typography variant="body1" gutterBottom>{selectedProduct.subscriptionRequirements.minDuration}</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">最大订阅数量</Typography>
                  <Typography variant="body1" gutterBottom>{selectedProduct.subscriptionRequirements.maxQuantity}</Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button 
                color="error" 
                startIcon={<FavoriteIcon />}
                onClick={() => {
                  handleCloseProductDialog();
                  const favoriteItem = favorites.find(fav => fav.itemId === selectedProduct.id && fav.itemType === 'product');
                  if (favoriteItem) handleOpenRemoveDialog(favoriteItem);
                }}
              >
                取消收藏
              </Button>
              <Button startIcon={<ShoppingCartIcon />} color="primary">
                订阅产品
              </Button>
              <Button onClick={handleCloseProductDialog}>关闭</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* 数据源详情对话框 */}
      <Dialog open={openDataSourceDialog} onClose={handleCloseDataSourceDialog} maxWidth="md" fullWidth>
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
                  <Box sx={{ mt: 0.5, mb: 1 }}>{getDataSourceStatusChip(selectedDataSource.status)}</Box>
                  
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
                  <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>连接详情</Typography>
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
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button 
                color="error" 
                startIcon={<FavoriteIcon />}
                onClick={() => {
                  handleCloseDataSourceDialog();
                  const favoriteItem = favorites.find(fav => fav.itemId === selectedDataSource.id && fav.itemType === 'dataSource');
                  if (favoriteItem) handleOpenRemoveDialog(favoriteItem);
                }}
              >
                取消收藏
              </Button>
              <Button onClick={handleCloseDataSourceDialog}>关闭</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* 移除确认对话框 */}
      <Dialog open={openRemoveDialog} onClose={handleCloseRemoveDialog}>
        <DialogTitle>
          确认移除
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            您确定要将此项从收藏中移除吗？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRemoveDialog}>取消</Button>
          <Button color="error" onClick={handleRemoveFromFavorites}>移除</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FavoritesPage; 