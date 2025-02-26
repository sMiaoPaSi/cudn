import React, { useState, useEffect } from 'react';
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
  Divider,
  CardMedia,
  Avatar,
  Tooltip,
  IconButton
} from '@mui/material';
import { Product, mockProducts } from '../../services/mockData';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DatasetIcon from '@mui/icons-material/Dataset';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddDataProductForm from '../../components/dataproduct/AddDataProductForm';

// 数据产品类型（扩展自产品类型）
interface DataProduct extends Product {
  source: string;
  format: string;
  updateFrequency: string;
  contractTemplate?: string;
  accessMethod?: 'file' | 'api';
  apiEndpoint?: string;
  apiDocumentation?: string;
  files?: Array<{
    name: string;
    size: number;
    type: string;
    url?: string;
  }>;
  isDraft?: boolean;
}

// 收藏项类型
interface FavoriteItem {
  id: string;
  itemId: string;
  itemType: 'product' | 'dataSource';
  addedAt: string;
}

const DataProductsPage: React.FC = () => {
  // 模拟数据产品（基于产品数据扩展）
  const initialDataProducts: DataProduct[] = mockProducts.slice(0, 3).map(product => ({
    ...product,
    source: ['MySQL数据库', 'PostgreSQL数据库', 'MongoDB数据库'][Math.floor(Math.random() * 3)],
    format: ['CSV', 'JSON', 'XML', 'API'][Math.floor(Math.random() * 4)],
    updateFrequency: ['实时', '每日', '每周', '每月'][Math.floor(Math.random() * 4)]
  }));
  
  const [dataProducts, setDataProducts] = useState<DataProduct[]>(initialDataProducts);
  const [selectedDataProduct, setSelectedDataProduct] = useState<DataProduct | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterFormat, setFilterFormat] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
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
  
  // 处理类别筛选变化
  const handleCategoryFilterChange = (event: SelectChangeEvent) => {
    setFilterCategory(event.target.value);
  };

  // 处理格式筛选变化
  const handleFormatFilterChange = (event: SelectChangeEvent) => {
    setFilterFormat(event.target.value);
  };

  // 处理搜索变化
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // 筛选数据产品
  const filteredDataProducts = dataProducts.filter(dataProduct => {
    const matchesCategory = filterCategory === 'all' || dataProduct.category === filterCategory;
    const matchesFormat = filterFormat === 'all' || dataProduct.format === filterFormat;
    const matchesSearch = dataProduct.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataProduct.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesFormat && matchesSearch;
  });

  // 检查产品是否已收藏
  const isProductFavorited = (productId: string) => {
    return favorites.some(fav => fav.itemId === productId && fav.itemType === 'product');
  };

  // 添加到收藏
  const handleAddToFavorites = (dataProduct: DataProduct) => {
    if (isProductFavorited(dataProduct.id)) return;
    
    const newFavoriteItem: FavoriteItem = {
      id: `fav${Date.now()}`,
      itemId: dataProduct.id,
      itemType: 'product',
      addedAt: new Date().toISOString()
    };
    
    setFavorites([...favorites, newFavoriteItem]);
    setSuccessMessage(`已将"${dataProduct.name}"添加到收藏`);
    
    // 3秒后关闭成功提示
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  // 从收藏中移除
  const handleRemoveFromFavorites = (dataProduct: DataProduct) => {
    setFavorites(favorites.filter(fav => !(fav.itemId === dataProduct.id && fav.itemType === 'product')));
    setSuccessMessage(`已将"${dataProduct.name}"从收藏中移除`);
    
    // 3秒后关闭成功提示
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  // 切换收藏状态
  const handleToggleFavorite = (dataProduct: DataProduct) => {
    if (isProductFavorited(dataProduct.id)) {
      handleRemoveFromFavorites(dataProduct);
    } else {
      handleAddToFavorites(dataProduct);
    }
  };

  // 打开数据产品详情对话框
  const handleOpenDetails = (dataProduct: DataProduct) => {
    setSelectedDataProduct(dataProduct);
    setOpenDialog(true);
  };
  
  // 关闭数据产品详情对话框
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  // 打开添加数据产品对话框
  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };
  
  // 关闭添加数据产品对话框
  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };
  
  // 打开删除确认对话框
  const handleOpenDeleteDialog = (dataProduct: DataProduct) => {
    setSelectedDataProduct(dataProduct);
    setOpenDeleteDialog(true);
  };
  
  // 关闭删除确认对话框
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };
  
  // 添加新数据产品（模拟）
  const handleAddDataProduct = (newProductData: Omit<DataProduct, 'id' | 'createdAt'>, isDraft: boolean) => {
    const newDataProduct: DataProduct = {
      id: `PROD${(dataProducts.length + 1).toString().padStart(3, '0')}`,
      ...newProductData,
      status: isDraft ? 'inactive' : 'active',
      createdAt: new Date().toISOString()
    };
    
    setDataProducts([...dataProducts, newDataProduct]);
    setOpenAddDialog(false);
    setSuccessMessage(isDraft ? '数据产品已保存为草稿' : '数据产品创建成功');
    
    // 3秒后关闭成功提示
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };
  
  // 删除数据产品
  const handleDeleteDataProduct = () => {
    if (!selectedDataProduct) return;
    
    setDataProducts(prevDataProducts => 
      prevDataProducts.filter(product => product.id !== selectedDataProduct.id)
    );
    setOpenDeleteDialog(false);
    setSuccessMessage('数据产品已删除');
    
    // 3秒后关闭成功提示
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };
  
  // 获取数据产品状态的显示样式
  const getStatusChip = (status: string, isDraft?: boolean) => {
    switch (status) {
      case 'active':
        return <Chip label="已发布" color="success" size="small" />;
      case 'inactive':
        return <Chip label={isDraft ? "草稿" : "未发布"} color="warning" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };
  
  // 获取数据产品类别的唯一值列表
  const dataProductCategories = Array.from(new Set(dataProducts.map(dataProduct => dataProduct.category)));
  
  // 获取数据产品格式的唯一值列表
  const dataProductFormats = Array.from(new Set(dataProducts.map(dataProduct => dataProduct.format)));

  // 获取产品图片（使用可靠的随机图片服务）
  const getProductImage = (category: string, productId: string) => {
    // 使用产品ID作为种子，确保同一产品每次显示相同图片
    const seed = productId.charCodeAt(0) + productId.charCodeAt(productId.length - 1);
    const imageId = (seed % 1000) + 1;
    
    let categoryTerm;
    switch (category) {
      case '数据分析':
        categoryTerm = 'analytics';
        break;
      case '大数据':
        categoryTerm = 'bigdata';
        break;
      case '人工智能':
        categoryTerm = 'ai';
        break;
      default:
        categoryTerm = 'data';
    }
    
    // 使用picsum.photos服务，它提供稳定的随机图片
    return `https://picsum.photos/seed/${categoryTerm}${imageId}/300/200`;
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
            <DatasetIcon fontSize="large" />
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
              数据产品管理
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
              管理您的数据产品
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
                {filteredDataProducts.length} 个数据产品
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
          添加数据产品
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
                label="搜索数据产品"
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
                {Array.from(new Set(dataProducts.map(dp => dp.category))).map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>格式</InputLabel>
              <Select
                value={filterFormat}
                label="格式"
                onChange={handleFormatFilterChange}
              >
                <MenuItem value="all">全部格式</MenuItem>
                {Array.from(new Set(dataProducts.map(dp => dp.format))).map(format => (
                  <MenuItem key={format} value={format}>{format}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* 数据产品列表 */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          找到 {filteredDataProducts.length} 个数据产品
        </Typography>
        
        <Grid container spacing={3}>
          {filteredDataProducts.map((dataProduct) => (
            <Grid item xs={12} sm={6} md={4} key={dataProduct.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'visible'
                }}
              >
                {dataProduct.isDraft && (
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: -10, 
                      right: -10, 
                      zIndex: 1,
                      bgcolor: 'warning.light',
                      color: 'warning.contrastText',
                      borderRadius: '4px',
                      px: 1,
                      py: 0.5,
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                  >
                    草稿
                  </Box>
                )}
                <CardMedia
                  component="img"
                  height="140"
                  image={getProductImage(dataProduct.category, dataProduct.id)}
                  alt={dataProduct.name}
                  sx={{ 
                    opacity: dataProduct.isDraft ? 0.7 : 1,
                    filter: dataProduct.isDraft ? 'grayscale(30%)' : 'none'
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                      {dataProduct.name}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(dataProduct);
                      }}
                      sx={{ ml: 1 }}
                    >
                      {isProductFavorited(dataProduct.id) ? (
                        <FavoriteIcon color="error" fontSize="small" />
                      ) : (
                        <FavoriteBorderIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Box>
                  
                  <Box sx={{ display: 'flex', mb: 1, flexWrap: 'wrap', gap: 0.5 }}>
                    {getStatusChip(dataProduct.status, dataProduct.isDraft)}
                    <Chip label={dataProduct.category} size="small" variant="outlined" />
                    <Chip label={dataProduct.format} size="small" variant="outlined" />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    mb: 2,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    height: 60
                  }}>
                    {dataProduct.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" color="primary">
                      ¥{dataProduct.price}/月
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      更新: {dataProduct.updateFrequency}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    onClick={() => handleOpenDetails(dataProduct)}
                    startIcon={<VisibilityIcon />}
                  >
                    查看详情
                  </Button>
                  {dataProduct.isDraft && (
                    <Button 
                      size="small" 
                      color="primary"
                      startIcon={<EditIcon />}
                    >
                      编辑
                    </Button>
                  )}
                  <Button 
                    size="small" 
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleOpenDeleteDialog(dataProduct)}
                    sx={{ ml: 'auto' }}
                  >
                    删除
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        {filteredDataProducts.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="h6" color="text.secondary">
              没有找到符合条件的数据产品
            </Typography>
            <Typography variant="body2" color="text.secondary">
              请尝试调整筛选条件或添加新的数据产品
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenAddDialog}
              sx={{ mt: 2 }}
            >
              添加数据产品
            </Button>
          </Box>
        )}
      </Box>
      
      {/* 数据产品详情对话框 */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedDataProduct && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">{selectedDataProduct.name}</Typography>
              {selectedDataProduct.isDraft && (
                <Chip label="草稿" color="warning" size="small" />
              )}
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={getProductImage(selectedDataProduct.category, selectedDataProduct.id)}
                    alt={selectedDataProduct.name}
                    sx={{ borderRadius: 1, mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">产品ID</Typography>
                  <Typography variant="body1" gutterBottom>{selectedDataProduct.id}</Typography>
                  
                  <Typography variant="subtitle2">状态</Typography>
                  <Box sx={{ mt: 0.5, mb: 1 }}>{getStatusChip(selectedDataProduct.status, selectedDataProduct.isDraft)}</Box>
                  
                  <Typography variant="subtitle2">价格</Typography>
                  <Typography variant="body1" gutterBottom>¥{selectedDataProduct.price}/月</Typography>
                  
                  <Typography variant="subtitle2">创建时间</Typography>
                  <Typography variant="body1" gutterBottom>
                    {new Date(selectedDataProduct.createdAt).toLocaleString()}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2">产品名称</Typography>
                  <Typography variant="body1" gutterBottom>{selectedDataProduct.name}</Typography>
                  
                  <Typography variant="subtitle2">描述</Typography>
                  <Typography variant="body1" gutterBottom>{selectedDataProduct.description}</Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>数据详情</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">类别</Typography>
                  <Typography variant="body1" gutterBottom>{selectedDataProduct.category}</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">数据格式</Typography>
                  <Typography variant="body1" gutterBottom>{selectedDataProduct.format}</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">数据源</Typography>
                  <Typography variant="body1" gutterBottom>{selectedDataProduct.source}</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">更新频率</Typography>
                  <Typography variant="body1" gutterBottom>{selectedDataProduct.updateFrequency}</Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>订阅要求</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">最小订阅时长（月）</Typography>
                  <Typography variant="body1" gutterBottom>{selectedDataProduct.subscriptionRequirements.minDuration}</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">最大订阅数量</Typography>
                  <Typography variant="body1" gutterBottom>{selectedDataProduct.subscriptionRequirements.maxQuantity}</Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>关闭</Button>
              <Button color="primary">编辑</Button>
              <Button color="error" onClick={() => {
                handleCloseDialog();
                handleOpenDeleteDialog(selectedDataProduct);
              }}>删除</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* 添加数据产品对话框 */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          添加数据产品
        </DialogTitle>
        <DialogContent dividers>
          <AddDataProductForm 
            onSubmit={handleAddDataProduct}
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
            您确定要删除数据产品 "{selectedDataProduct?.name}" 吗？此操作无法撤销。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>取消</Button>
          <Button color="error" onClick={handleDeleteDataProduct}>删除</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DataProductsPage; 