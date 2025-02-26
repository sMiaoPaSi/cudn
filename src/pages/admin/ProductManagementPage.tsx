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
import { Product, mockProducts } from '../../services/mockData';
import CategoryIcon from '@mui/icons-material/Category';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';

const ProductManagementPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const rowsPerPage = 5;

  // 处理状态筛选变化
  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setFilterStatus(event.target.value);
    setPage(1);
  };

  // 处理类别筛选变化
  const handleCategoryFilterChange = (event: SelectChangeEvent) => {
    setFilterCategory(event.target.value);
    setPage(1);
  };

  // 处理搜索变化
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  // 筛选产品
  const filteredProducts = products.filter(product => {
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesCategory && matchesSearch;
  });

  // 计算分页
  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);
  const displayedProducts = filteredProducts.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // 处理页面变化
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
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

  // 禁用产品
  const handleDisableProduct = (productId: string) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId
          ? { ...product, status: 'inactive' }
          : product
      )
    );
  };

  // 获取产品状态的显示样式
  const getStatusChip = (status: string) => {
    switch (status) {
      case 'active':
        return <Chip label="已上架" color="success" size="small" />;
      case 'inactive':
        return <Chip label="已下架" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  // 获取产品类别的唯一值列表
  const productCategories = Array.from(new Set(products.map(product => product.category)));

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
            <CategoryIcon fontSize="large" />
          </Avatar>
          <Box>
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
                letterSpacing: '0.5px'
              }}
            >
              产品管理
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
              管理和监控所有上架的产品
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
                {filteredProducts.length} 个产品
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
                label="搜索产品"
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
                <MenuItem value="active">已上架</MenuItem>
                <MenuItem value="inactive">已下架</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>类别</InputLabel>
              <Select
                value={filterCategory}
                label="类别"
                onChange={handleCategoryFilterChange}
              >
                <MenuItem value="all">全部</MenuItem>
                {productCategories.map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* 产品表格 */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>产品名称</TableCell>
              <TableCell>类别</TableCell>
              <TableCell>价格</TableCell>
              <TableCell>状态</TableCell>
              <TableCell>上架时间</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>¥{product.price}</TableCell>
                <TableCell>{getStatusChip(product.status)}</TableCell>
                <TableCell>{new Date(product.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => handleOpenDetails(product)}
                    sx={{ mr: 1 }}
                  >
                    详情
                  </Button>
                  {product.status === 'active' && (
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDisableProduct(product.id)}
                    >
                      下架
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

      {/* 产品详情对话框 */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedProduct && (
          <>
            <DialogTitle>
              产品详情 - {selectedProduct.name}
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">产品ID</Typography>
                  <Typography variant="body1" gutterBottom>{selectedProduct.id}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">状态</Typography>
                  <Box sx={{ mt: 0.5, mb: 1 }}>{getStatusChip(selectedProduct.status)}</Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">产品名称</Typography>
                  <Typography variant="body1" gutterBottom>{selectedProduct.name}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">类别</Typography>
                  <Typography variant="body1" gutterBottom>{selectedProduct.category}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">价格</Typography>
                  <Typography variant="body1" gutterBottom>¥{selectedProduct.price}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">上架时间</Typography>
                  <Typography variant="body1" gutterBottom>
                    {new Date(selectedProduct.createdAt).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
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
              {selectedProduct.status === 'active' && (
                <Button 
                  color="error" 
                  onClick={() => {
                    handleDisableProduct(selectedProduct.id);
                    handleCloseDialog();
                  }}
                >
                  下架产品
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

export default ProductManagementPage; 