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
  DialogActions,
  Grid,
  Divider,
  Alert,
  Avatar,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment
} from '@mui/material';
import { useUser } from '../../context/UserContext';
import { Subscription, mockSubscriptions } from '../../services/mockData';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import InfoIcon from '@mui/icons-material/Info';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import HistoryIcon from '@mui/icons-material/History';
import { Link, useNavigate } from 'react-router-dom';

const SubscriptionManagementPage: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [cancelConfirmDialog, setCancelConfirmDialog] = useState(false);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // 从localStorage获取订阅数据
  useEffect(() => {
    const loadSubscriptions = () => {
      const savedSubscriptions = localStorage.getItem('subscriptions');
      if (savedSubscriptions) {
        const parsedSubscriptions = JSON.parse(savedSubscriptions);
        // 如果有用户信息，则过滤出该用户的订阅
        if (user) {
          setSubscriptions(parsedSubscriptions.filter((sub: Subscription) => sub.userId === user.id));
        } else {
          setSubscriptions(parsedSubscriptions);
        }
      } else {
        // 如果localStorage中没有数据，则使用mockSubscriptions作为备选
        if (user) {
          setSubscriptions(mockSubscriptions.filter(sub => sub.userId === user.id));
        } else {
          setSubscriptions(mockSubscriptions);
        }
      }
    };

    loadSubscriptions();
  }, [user]);
  
  // 获取当前用户的订阅
  const userSubscriptions = subscriptions.filter(sub => sub.userId === user?.id);
  
  // 根据搜索词过滤订阅
  const filteredSubscriptions = userSubscriptions.filter(sub => 
    sub.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // 处理搜索输入变化
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  // 打开订阅详情对话框
  const handleOpenDetails = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setOpenDialog(true);
  };
  
  // 关闭订阅详情对话框
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  // 打开取消确认对话框
  const handleOpenCancelConfirm = () => {
    setCancelConfirmDialog(true);
  };
  
  // 关闭取消确认对话框
  const handleCloseCancelConfirm = () => {
    setCancelConfirmDialog(false);
  };
  
  // 打开删除确认对话框
  const handleOpenDeleteConfirm = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setDeleteConfirmDialog(true);
  };
  
  // 关闭删除确认对话框
  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmDialog(false);
  };
  
  // 取消订阅
  const handleCancelSubscription = () => {
    if (!selectedSubscription) return;
    
    setSubscriptions(prevSubscriptions =>
      prevSubscriptions.map(sub =>
        sub.id === selectedSubscription.id
          ? { ...sub, status: 'cancelled' }
          : sub
      )
    );
    
    setCancelSuccess(true);
    setCancelConfirmDialog(false);
    
    // 3秒后关闭成功提示
    setTimeout(() => {
      setCancelSuccess(false);
    }, 3000);
  };
  
  // 删除订阅
  const handleDeleteSubscription = () => {
    if (!selectedSubscription) return;
    
    // 从当前状态中移除订阅
    const updatedSubscriptions = subscriptions.filter(sub => sub.id !== selectedSubscription.id);
    setSubscriptions(updatedSubscriptions);

    // 更新localStorage
    const savedSubscriptions = localStorage.getItem('subscriptions');
    if (savedSubscriptions) {
      const allSubscriptions = JSON.parse(savedSubscriptions);
      const updatedAllSubscriptions = allSubscriptions.filter((sub: Subscription) => sub.id !== selectedSubscription.id);
      localStorage.setItem('subscriptions', JSON.stringify(updatedAllSubscriptions));
    }

    // 获取已删除的订阅
    const savedDeletedSubscriptions = localStorage.getItem('deletedSubscriptions');
    const deletedSubscriptions = savedDeletedSubscriptions ? JSON.parse(savedDeletedSubscriptions) : [];
    
    // 将当前删除的订阅添加到已删除列表
    const subscriptionToDelete = {
      ...selectedSubscription,
      deletedAt: new Date().toISOString()
    };
    deletedSubscriptions.push(subscriptionToDelete);
    
    // 保存已删除的订阅到localStorage
    localStorage.setItem('deletedSubscriptions', JSON.stringify(deletedSubscriptions));

    // 显示成功消息并关闭对话框
    setDeleteSuccess(true);
    setDeleteConfirmDialog(false);
    setOpenDialog(false); // 如果从详情页删除，关闭详情对话框
    
    // 3秒后关闭成功提示
    setTimeout(() => {
      setDeleteSuccess(false);
    }, 3000);
  };
  
  // 获取订阅状态的显示样式
  const getStatusChip = (status: string) => {
    switch (status) {
      case 'active':
        return <Chip label="活跃" color="success" size="small" />;
      case 'expired':
        return <Chip label="已过期" color="warning" size="small" />;
      case 'cancelled':
        return <Chip label="已取消" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };
  
  // 导航到历史订阅页面
  const handleNavigateToHistory = () => {
    navigate('/user/subscription-history');
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
            <SubscriptionsIcon fontSize="large" />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
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
              订阅管理
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
              管理您的产品订阅
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
                {userSubscriptions.length} 个订阅
              </Box>
            </Typography>
          </Box>
          <Button
            component={Link}
            to="/user/subscription-history"
            variant="outlined"
            startIcon={<HistoryIcon />}
            sx={{ 
              borderRadius: '8px',
              ml: 2,
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}
            onClick={handleNavigateToHistory}
          >
            历史订阅
          </Button>
        </Box>
      </Paper>
      
      {cancelSuccess && (
        <Alert 
          severity="success" 
          sx={{ 
            mb: 3, 
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}
        >
          订阅已成功取消
        </Alert>
      )}
      
      {deleteSuccess && (
        <Alert 
          severity="success" 
          sx={{ 
            mb: 3, 
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}
        >
          订阅已成功删除
        </Alert>
      )}
      
      {/* 搜索框 */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="搜索订阅（按产品名称、ID或状态）"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            sx: { 
              borderRadius: '12px',
              bgcolor: 'white',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(0, 0, 0, 0.1)'
              }
            }
          }}
        />
      </Box>
      
      {filteredSubscriptions.length === 0 ? (
        <Paper 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            background: 'linear-gradient(to right, #f9f9f9, #f5f5f5)'
          }}
        >
          <Box sx={{ mb: 2 }}>
            <SubscriptionsIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5 }} />
          </Box>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchTerm ? '没有找到匹配的订阅' : '您还没有任何订阅'}
          </Typography>
          {!searchTerm && (
            <Button
              variant="contained"
              color="primary"
              sx={{ 
                mt: 2,
                px: 3,
                py: 1,
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(25, 118, 210, 0.25)'
              }}
              onClick={() => window.location.href = '/user/catalog'}
            >
              浏览产品目录
            </Button>
          )}
          {searchTerm && (
            <Button
              variant="outlined"
              color="primary"
              sx={{ 
                mt: 2,
                px: 3,
                py: 1,
                borderRadius: '8px'
              }}
              onClick={() => setSearchTerm('')}
            >
              清除搜索
            </Button>
          )}
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'rgba(25, 118, 210, 0.05)' }}>
                <TableCell>产品名称</TableCell>
                <TableCell>开始日期</TableCell>
                <TableCell>结束日期</TableCell>
                <TableCell>数量</TableCell>
                <TableCell>状态</TableCell>
                <TableCell>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSubscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell>{subscription.productName}</TableCell>
                  <TableCell>{new Date(subscription.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(subscription.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>{subscription.quantity}</TableCell>
                  <TableCell>{getStatusChip(subscription.status)}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => handleOpenDetails(subscription)}
                      sx={{ mr: 1 }}
                    >
                      详情
                    </Button>
                    {subscription.status === 'active' && (
                      <Button
                        size="small"
                        color="error"
                        onClick={() => {
                          setSelectedSubscription(subscription);
                          handleOpenCancelConfirm();
                        }}
                        sx={{ mr: 1 }}
                      >
                        取消
                      </Button>
                    )}
                    <Tooltip title="删除订阅">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleOpenDeleteConfirm(subscription)}
                        sx={{ 
                          ml: 0.5,
                          '&:hover': {
                            backgroundColor: 'rgba(211, 47, 47, 0.1)'
                          }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* 订阅详情对话框 */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedSubscription && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>订阅详情</span>
              <Tooltip title="删除订阅">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleOpenDeleteConfirm(selectedSubscription)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">订阅ID</Typography>
                  <Typography variant="body1" gutterBottom>{selectedSubscription.id}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">状态</Typography>
                  <Box sx={{ mt: 0.5, mb: 1 }}>{getStatusChip(selectedSubscription.status)}</Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">产品名称</Typography>
                  <Typography variant="body1" gutterBottom>{selectedSubscription.productName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">产品ID</Typography>
                  <Typography variant="body1" gutterBottom>{selectedSubscription.productId}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">开始日期</Typography>
                  <Typography variant="body1" gutterBottom>
                    {new Date(selectedSubscription.startDate).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">结束日期</Typography>
                  <Typography variant="body1" gutterBottom>
                    {new Date(selectedSubscription.endDate).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">数量</Typography>
                  <Typography variant="body1" gutterBottom>{selectedSubscription.quantity}</Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    订阅时长
                  </Typography>
                  <Typography variant="body1">
                    {Math.round((new Date(selectedSubscription.endDate).getTime() - new Date(selectedSubscription.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} 个月
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              {selectedSubscription.status === 'active' && (
                <Button 
                  color="error" 
                  onClick={handleOpenCancelConfirm}
                >
                  取消订阅
                </Button>
              )}
              <Button onClick={handleCloseDialog}>关闭</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* 取消确认对话框 */}
      <Dialog open={cancelConfirmDialog} onClose={handleCloseCancelConfirm}>
        <DialogTitle>
          确认取消订阅
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            您确定要取消此订阅吗？此操作无法撤销。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCancelConfirm}>
            返回
          </Button>
          <Button 
            color="error" 
            onClick={handleCancelSubscription}
          >
            确认取消
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* 删除确认对话框 */}
      <Dialog open={deleteConfirmDialog} onClose={handleCloseDeleteConfirm}>
        <DialogTitle>
          确认删除订阅
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            您确定要删除此订阅记录吗？
          </Typography>
          <Typography variant="body2" color="error">
            此操作将永久删除该订阅记录，且无法恢复。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm}>
            取消
          </Button>
          <Button 
            variant="contained"
            color="error" 
            startIcon={<DeleteIcon />}
            onClick={handleDeleteSubscription}
          >
            确认删除
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SubscriptionManagementPage; 