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
  Slider,
  Divider,
  CardMedia,
  Paper,
  Avatar,
  IconButton,
  Tooltip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormHelperText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Product, mockProducts, Subscription } from '../../services/mockData';
import { useUser } from '../../context/UserContext';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';

// 收藏项类型
interface FavoriteItem {
  id: string;
  itemId: string;
  itemType: 'product' | 'dataSource';
  addedAt: string;
}

const ProductCatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  
  // 订阅相关状态
  const [openSubscribeDialog, setOpenSubscribeDialog] = useState(false);
  const [subscribeProduct, setSubscribeProduct] = useState<Product | null>(null);
  const [subscriptionQuantity, setSubscriptionQuantity] = useState(1);
  const [subscriptionDuration, setSubscriptionDuration] = useState(1);
  const [quantityError, setQuantityError] = useState('');
  const [durationError, setDurationError] = useState('');
  
  // 收藏相关状态
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    // 尝试从localStorage获取收藏数据
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  // 当收藏变化时保存到localStorage
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);
  
  // 获取所有活跃的产品
  const activeProducts = mockProducts.filter(product => product.status === 'active');
  
  // 获取产品类别的唯一值列表
  const productCategories = Array.from(new Set(activeProducts.map(product => product.category)));
  
  // 获取价格范围
  const minPrice = Math.min(...activeProducts.map(product => product.price));
  const maxPrice = Math.max(...activeProducts.map(product => product.price));
  
  // 处理类别筛选变化
  const handleCategoryFilterChange = (event: SelectChangeEvent) => {
    setFilterCategory(event.target.value);
  };
  
  // 处理搜索变化
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  // 处理价格范围变化
  const handlePriceRangeChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };
  
  // 筛选产品
  const filteredProducts = activeProducts.filter(product => {
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    return matchesCategory && matchesSearch && matchesPrice;
  });
  
  // 打开订阅对话框
  const handleOpenSubscribeDialog = (product: Product) => {
    setSubscribeProduct(product);
    setSubscriptionQuantity(1);
    setSubscriptionDuration(product.subscriptionRequirements.minDuration);
    setQuantityError('');
    setDurationError('');
    setOpenSubscribeDialog(true);
  };
  
  // 关闭订阅对话框
  const handleCloseSubscribeDialog = () => {
    setOpenSubscribeDialog(false);
  };
  
  // 处理订阅数量变化
  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setSubscriptionQuantity(value);
    
    if (subscribeProduct) {
      if (value <= 0) {
        setQuantityError('数量必须大于0');
      } else if (value > subscribeProduct.subscriptionRequirements.maxQuantity) {
        setQuantityError(`最大订阅数量为${subscribeProduct.subscriptionRequirements.maxQuantity}`);
      } else {
        setQuantityError('');
      }
    }
  };
  
  // 处理订阅时长变化
  const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setSubscriptionDuration(value);
    
    if (subscribeProduct) {
      if (value < subscribeProduct.subscriptionRequirements.minDuration) {
        setDurationError(`最小订阅时长为${subscribeProduct.subscriptionRequirements.minDuration}个月`);
      } else {
        setDurationError('');
      }
    }
  };
  
  // 处理订阅提交
  const handleSubscribe = () => {
    if (!subscribeProduct || !user) return;
    
    // 验证输入
    if (subscriptionQuantity <= 0 || subscriptionQuantity > subscribeProduct.subscriptionRequirements.maxQuantity) {
      setQuantityError(`订阅数量必须在1-${subscribeProduct.subscriptionRequirements.maxQuantity}之间`);
      return;
    }
    
    if (subscriptionDuration < subscribeProduct.subscriptionRequirements.minDuration) {
      setDurationError(`最小订阅时长为${subscribeProduct.subscriptionRequirements.minDuration}个月`);
      return;
    }
    
    // 创建新订阅
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + subscriptionDuration);
    
    const newSubscription: Subscription = {
      id: `SUB${Date.now()}`,
      userId: user.id,
      productId: subscribeProduct.id,
      productName: subscribeProduct.name,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      quantity: subscriptionQuantity,
      status: 'active'
    };
    
    // 获取现有订阅
    const savedSubscriptions = localStorage.getItem('subscriptions');
    const subscriptions: Subscription[] = savedSubscriptions ? JSON.parse(savedSubscriptions) : [];
    
    // 添加新订阅
    subscriptions.push(newSubscription);
    
    // 保存到localStorage
    localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
    
    // 关闭对话框
    setOpenSubscribeDialog(false);
    
    // 显示成功消息
    setSuccessMessage(`已成功订阅"${subscribeProduct.name}"`);
    
    // 3秒后关闭成功提示并跳转
    setTimeout(() => {
      setSuccessMessage(null);
      navigate('/user/subscriptions');
    }, 1500);
  };

  // 检查产品是否已收藏
  const isProductFavorited = (productId: string) => {
    return favorites.some(fav => fav.itemId === productId && fav.itemType === 'product');
  };

  // 添加到收藏
  const handleAddToFavorites = (product: Product) => {
    if (isProductFavorited(product.id)) return;
    
    const newFavoriteItem: FavoriteItem = {
      id: `fav${Date.now()}`,
      itemId: product.id,
      itemType: 'product',
      addedAt: new Date().toISOString()
    };
    
    setFavorites([...favorites, newFavoriteItem]);
    setSuccessMessage(`已将"${product.name}"添加到收藏`);
    
    // 3秒后关闭成功提示
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  // 从收藏中移除
  const handleRemoveFromFavorites = (product: Product) => {
    setFavorites(favorites.filter(fav => !(fav.itemId === product.id && fav.itemType === 'product')));
    setSuccessMessage(`已将"${product.name}"从收藏中移除`);
    
    // 3秒后关闭成功提示
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  // 切换收藏状态
  const handleToggleFavorite = (product: Product) => {
    if (isProductFavorited(product.id)) {
      handleRemoveFromFavorites(product);
    } else {
      handleAddToFavorites(product);
    }
  };
  
  // 获取产品图片（使用可靠的随机图片服务）
  const getProductImage = (category: string, productId: string) => {
    // 使用产品ID作为种子，确保同一产品每次显示相同图片
    const seed = productId.charCodeAt(0) + productId.charCodeAt(productId.length - 1);
    const imageId = (seed % 1000) + 1;
    
    let categoryTerm;
    switch (category) {
      case '云存储':
        categoryTerm = 'cloud';
        break;
      case '数据分析':
        categoryTerm = 'analytics';
        break;
      case '安全服务':
        categoryTerm = 'security';
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
        categoryTerm = 'technology';
    }
    
    // 使用picsum.photos服务，它提供稳定的随机图片
    return `https://picsum.photos/seed/${categoryTerm}${imageId}/300/200`;
  };

  // 打开产品详情对话框
  const handleOpenDetails = (product: Product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };
  
  // 关闭产品详情对话框
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // 计算订阅总价
  const calculateTotalPrice = () => {
    if (!subscribeProduct) return 0;
    return subscribeProduct.price * subscriptionQuantity * subscriptionDuration;
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
            <ShoppingCartIcon fontSize="large" />
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
              产品目录
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
              浏览和订阅我们的数据产品
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
                {filteredProducts.length} 个产品
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
      
      {/* 筛选和搜索 */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
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
                label="搜索产品"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>类别</InputLabel>
              <Select
                value={filterCategory}
                label="类别"
                onChange={handleCategoryFilterChange}
              >
                <MenuItem value="all">全部类别</MenuItem>
                {productCategories.map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography gutterBottom>价格范围</Typography>
            <Slider
              value={priceRange}
              onChange={handlePriceRangeChange}
              valueLabelDisplay="auto"
              min={minPrice}
              max={maxPrice}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">¥{priceRange[0]}</Typography>
              <Typography variant="body2">¥{priceRange[1]}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* 产品列表 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          找到 {filteredProducts.length} 个产品
        </Typography>
        
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
                    <Typography variant="h6" component="div">
                      {product.name}
                    </Typography>
                    <Chip label={product.category} size="small" color="primary" />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {product.description}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" color="primary">
                      ¥{product.price}
                    </Typography>
                    <Typography variant="caption">
                      最少订阅: {product.subscriptionRequirements.minDuration} 个月
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button size="small" startIcon={<VisibilityIcon />} onClick={() => handleOpenDetails(product)}>
                    详情
                  </Button>
                  <Button size="small" startIcon={<ShoppingCartIcon />} onClick={() => handleOpenSubscribeDialog(product)}>
                    订阅
                  </Button>
                  <Box sx={{ ml: 'auto' }}>
                    <Tooltip title={isProductFavorited(product.id) ? "取消收藏" : "添加到收藏"}>
                      <IconButton 
                        size="small" 
                        color={isProductFavorited(product.id) ? "error" : "default"}
                        onClick={() => handleToggleFavorite(product)}
                      >
                        {isProductFavorited(product.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        {filteredProducts.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="h6" color="text.secondary">
              没有找到符合条件的产品
            </Typography>
            <Typography variant="body2" color="text.secondary">
              请尝试调整筛选条件
            </Typography>
          </Box>
        )}
      </Box>
      
      {/* 产品详情对话框 */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedProduct && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>产品详情 - {selectedProduct.name}</span>
              <Tooltip title={isProductFavorited(selectedProduct.id) ? "取消收藏" : "添加到收藏"}>
                <IconButton 
                  size="small" 
                  color={isProductFavorited(selectedProduct.id) ? "error" : "default"}
                  onClick={() => handleToggleFavorite(selectedProduct)}
                >
                  {isProductFavorited(selectedProduct.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
              </Tooltip>
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
                  
                  <Typography variant="subtitle2">类别</Typography>
                  <Typography variant="body1" gutterBottom>{selectedProduct.category}</Typography>
                  
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
              <Button onClick={handleCloseDialog}>关闭</Button>
              <Button 
                color="primary" 
                startIcon={<ShoppingCartIcon />}
                onClick={() => {
                  handleCloseDialog();
                  handleOpenSubscribeDialog(selectedProduct);
                }}
              >
                订阅
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* 订阅对话框 */}
      <Dialog open={openSubscribeDialog} onClose={handleCloseSubscribeDialog} maxWidth="sm" fullWidth>
        {subscribeProduct && (
          <>
            <DialogTitle>
              订阅产品 - {subscribeProduct.name}
            </DialogTitle>
            <DialogContent dividers>
              <DialogContentText sx={{ mb: 3 }}>
                请选择订阅数量和时长
              </DialogContentText>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="订阅数量"
                    type="number"
                    value={subscriptionQuantity}
                    onChange={handleQuantityChange}
                    inputProps={{ min: 1, max: subscribeProduct.subscriptionRequirements.maxQuantity }}
                    error={!!quantityError}
                    helperText={quantityError || `最大数量: ${subscribeProduct.subscriptionRequirements.maxQuantity}`}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="订阅时长（月）"
                    type="number"
                    value={subscriptionDuration}
                    onChange={handleDurationChange}
                    inputProps={{ min: subscribeProduct.subscriptionRequirements.minDuration }}
                    error={!!durationError}
                    helperText={durationError || `最小时长: ${subscribeProduct.subscriptionRequirements.minDuration}个月`}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1">单价:</Typography>
                    <Typography variant="body1">¥{subscribeProduct.price}/月</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Typography variant="subtitle1">数量:</Typography>
                    <Typography variant="body1">{subscriptionQuantity}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Typography variant="subtitle1">时长:</Typography>
                    <Typography variant="body1">{subscriptionDuration} 个月</Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">总价:</Typography>
                    <Typography variant="h6" color="primary">¥{calculateTotalPrice()}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseSubscribeDialog}>取消</Button>
              <Button 
                color="primary" 
                variant="contained"
                onClick={handleSubscribe}
                disabled={!!quantityError || !!durationError}
              >
                确认订阅
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default ProductCatalogPage; 