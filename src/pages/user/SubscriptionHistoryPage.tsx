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
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Avatar,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Alert
} from '@mui/material';
import { Subscription } from '../../services/mockData';
import { useUser } from '../../context/UserContext';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RestoreIcon from '@mui/icons-material/Restore';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

// 扩展Subscription类型，添加删除时间
interface DeletedSubscription extends Subscription {
  deletedAt: string;
}

const SubscriptionHistoryPage: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [deletedSubscriptions, setDeletedSubscriptions] = useState<DeletedSubscription[]>([]);
  const [selectedSubscription, setSelectedSubscription] = useState<DeletedSubscription | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [restoreConfirmDialog, setRestoreConfirmDialog] = useState(false);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 从localStorage获取已删除的订阅数据
  useEffect(() => {
    const loadDeletedSubscriptions = () => {
      const savedDeletedSubscriptions = localStorage.getItem('deletedSubscriptions');
      if (savedDeletedSubscriptions) {
        const parsedDeletedSubscriptions = JSON.parse(savedDeletedSubscriptions);
        // 如果有用户信息，则过滤出该用户的订阅
        if (user) {
          setDeletedSubscriptions(parsedDeletedSubscriptions.filter((sub: DeletedSubscription) => sub.userId === user.id));
        } else {
          setDeletedSubscriptions(parsedDeletedSubscriptions);
        }
      }
    };

    loadDeletedSubscriptions();
  }, [user]);

  // 处理搜索
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // 过滤订阅
  const filteredSubscriptions = deletedSubscriptions.filter(subscription => 
    subscription.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscription.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subscription.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 打开详情对话框
  const handleOpenDetails = (subscription: DeletedSubscription) => {
    setSelectedSubscription(subscription);
    setOpenDialog(true);
  };

  // 关闭详情对话框
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // 打开恢复确认对话框
  const handleOpenRestoreConfirm = (subscription: DeletedSubscription) => {
    setSelectedSubscription(subscription);
    setRestoreConfirmDialog(true);
  };

  // 关闭恢复确认对话框
  const handleCloseRestoreConfirm = () => {
    setRestoreConfirmDialog(false);
  };

  // 打开永久删除确认对话框
  const handleOpenDeleteConfirm = (subscription: DeletedSubscription) => {
    setSelectedSubscription(subscription);
    setDeleteConfirmDialog(true);
  };

  // 关闭永久删除确认对话框
  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmDialog(false);
  };

  // 处理恢复订阅
  const handleRestoreSubscription = () => {
    if (!selectedSubscription) return;

    // 从已删除列表中移除
    const updatedDeletedSubscriptions = deletedSubscriptions.filter(sub => sub.id !== selectedSubscription.id);
    setDeletedSubscriptions(updatedDeletedSubscriptions);

    // 更新localStorage中的已删除订阅
    const savedDeletedSubscriptions = localStorage.getItem('deletedSubscriptions');
    if (savedDeletedSubscriptions) {
      const allDeletedSubscriptions = JSON.parse(savedDeletedSubscriptions);
      const updatedAllDeletedSubscriptions = allDeletedSubscriptions.filter((sub: DeletedSubscription) => sub.id !== selectedSubscription.id);
      localStorage.setItem('deletedSubscriptions', JSON.stringify(updatedAllDeletedSubscriptions));
    }

    // 获取当前活跃订阅
    const savedSubscriptions = localStorage.getItem('subscriptions');
    const activeSubscriptions = savedSubscriptions ? JSON.parse(savedSubscriptions) : [];
    
    // 创建要恢复的订阅（移除deletedAt字段）
    const { deletedAt, ...subscriptionToRestore } = selectedSubscription;
    
    // 添加到活跃订阅列表
    activeSubscriptions.push(subscriptionToRestore);
    
    // 保存到localStorage
    localStorage.setItem('subscriptions', JSON.stringify(activeSubscriptions));

    // 显示成功消息并关闭对话框
    setActionSuccess({
      message: `订阅"${selectedSubscription.productName}"已成功恢复`,
      type: 'success'
    });
    setRestoreConfirmDialog(false);

    // 3秒后关闭成功消息
    setTimeout(() => {
      setActionSuccess(null);
    }, 3000);
  };

  // 处理永久删除订阅
  const handlePermanentDeleteSubscription = () => {
    if (!selectedSubscription) return;

    // 从已删除列表中移除
    const updatedDeletedSubscriptions = deletedSubscriptions.filter(sub => sub.id !== selectedSubscription.id);
    setDeletedSubscriptions(updatedDeletedSubscriptions);

    // 更新localStorage中的已删除订阅
    const savedDeletedSubscriptions = localStorage.getItem('deletedSubscriptions');
    if (savedDeletedSubscriptions) {
      const allDeletedSubscriptions = JSON.parse(savedDeletedSubscriptions);
      const updatedAllDeletedSubscriptions = allDeletedSubscriptions.filter((sub: DeletedSubscription) => sub.id !== selectedSubscription.id);
      localStorage.setItem('deletedSubscriptions', JSON.stringify(updatedAllDeletedSubscriptions));
    }

    // 显示成功消息并关闭对话框
    setActionSuccess({
      message: `订阅"${selectedSubscription.productName}"已永久删除`,
      type: 'success'
    });
    setDeleteConfirmDialog(false);

    // 3秒后关闭成功消息
    setTimeout(() => {
      setActionSuccess(null);
    }, 3000);
  };

  // 获取订阅状态的颜色
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'expired':
        return 'error';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'default';
      default:
        return 'default';
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // 返回到订阅管理页面
  const handleNavigateBack = () => {
    navigate('/user/subscriptions');
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
          background: 'linear-gradient(135deg, #f0f2f5 0%, #e0e0e0 100%)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(45deg, rgba(100, 100, 100, 0.05) 0%, rgba(100, 100, 100, 0.1) 100%)',
            zIndex: 0
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              sx={{ 
                bgcolor: 'grey.600', 
                width: 56, 
                height: 56, 
                mr: 2,
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}
            >
              <DeleteForeverIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 700, 
                  background: 'linear-gradient(45deg, #616161, #9e9e9e)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  letterSpacing: '0.5px'
                }}
              >
                历史订阅
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
                查看已删除的订阅记录
                <Box 
                  component="span" 
                  sx={{ 
                    display: 'inline-block', 
                    ml: 1,
                    px: 1.5, 
                    py: 0.5, 
                    bgcolor: 'rgba(100, 100, 100, 0.1)', 
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}
                >
                  {filteredSubscriptions.length} 个记录
                </Box>
              </Typography>
            </Box>
          </Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleNavigateBack}
            sx={{ borderRadius: '8px', color: 'grey.700', borderColor: 'grey.400' }}
          >
            返回订阅管理
          </Button>
        </Box>
      </Paper>

      {actionSuccess && (
        <Alert 
          severity={actionSuccess.type} 
          sx={{ 
            mb: 3, 
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}
        >
          {actionSuccess.message}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="搜索历史订阅（按产品名称、订阅ID或状态）"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ 
            borderRadius: '8px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
            }
          }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'grey.600' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>订阅ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>产品名称</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>删除日期</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>状态</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSubscriptions.map((subscription) => (
              <TableRow key={subscription.id} hover>
                <TableCell>{subscription.id}</TableCell>
                <TableCell>{subscription.productName}</TableCell>
                <TableCell>{formatDate(subscription.deletedAt)}</TableCell>
                <TableCell>
                  <Chip 
                    label={subscription.status} 
                    color={getStatusColor(subscription.status) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="查看详情">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleOpenDetails(subscription)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="恢复订阅">
                      <IconButton 
                        size="small" 
                        color="success"
                        onClick={() => handleOpenRestoreConfirm(subscription)}
                      >
                        <RestoreIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="永久删除">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleOpenDeleteConfirm(subscription)}
                      >
                        <DeleteForeverIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredSubscriptions.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography variant="h6" color="text.secondary">
            没有找到历史订阅记录
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm ? '请尝试调整搜索条件' : '您没有任何已删除的订阅'}
          </Typography>
        </Box>
      )}

      {/* 订阅详情对话框 */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedSubscription && (
          <>
            <DialogTitle sx={{ bgcolor: 'grey.100' }}>
              历史订阅详情 - {selectedSubscription.productName}
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">订阅ID</Typography>
                  <Typography variant="body1" gutterBottom>{selectedSubscription.id}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">产品ID</Typography>
                  <Typography variant="body1" gutterBottom>{selectedSubscription.productId}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">产品名称</Typography>
                  <Typography variant="body1" gutterBottom>{selectedSubscription.productName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">订阅数量</Typography>
                  <Typography variant="body1" gutterBottom>{selectedSubscription.quantity}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">开始日期</Typography>
                  <Typography variant="body1" gutterBottom>{formatDate(selectedSubscription.startDate)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">结束日期</Typography>
                  <Typography variant="body1" gutterBottom>{formatDate(selectedSubscription.endDate)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">删除日期</Typography>
                  <Typography variant="body1" gutterBottom>{formatDate(selectedSubscription.deletedAt)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">状态</Typography>
                  <Chip 
                    label={selectedSubscription.status} 
                    color={getStatusColor(selectedSubscription.status) as any}
                    size="small"
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>关闭</Button>
              <Button 
                color="success" 
                startIcon={<RestoreIcon />}
                onClick={() => {
                  handleCloseDialog();
                  handleOpenRestoreConfirm(selectedSubscription);
                }}
              >
                恢复订阅
              </Button>
              <Button 
                color="error" 
                startIcon={<DeleteForeverIcon />}
                onClick={() => {
                  handleCloseDialog();
                  handleOpenDeleteConfirm(selectedSubscription);
                }}
              >
                永久删除
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* 恢复确认对话框 */}
      <Dialog open={restoreConfirmDialog} onClose={handleCloseRestoreConfirm}>
        {selectedSubscription && (
          <>
            <DialogTitle>确认恢复</DialogTitle>
            <DialogContent>
              <Typography>
                您确定要恢复订阅 "{selectedSubscription.productName}" 吗？
              </Typography>
              <Typography variant="body2" color="primary" sx={{ mt: 2 }}>
                恢复后，该订阅将重新出现在您的订阅列表中。
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseRestoreConfirm}>取消</Button>
              <Button color="success" onClick={handleRestoreSubscription}>
                恢复
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* 永久删除确认对话框 */}
      <Dialog open={deleteConfirmDialog} onClose={handleCloseDeleteConfirm}>
        {selectedSubscription && (
          <>
            <DialogTitle>确认永久删除</DialogTitle>
            <DialogContent>
              <Typography>
                您确定要永久删除订阅 "{selectedSubscription.productName}" 吗？
              </Typography>
              <Typography variant="body2" color="error" sx={{ mt: 2, fontWeight: 'bold' }}>
                警告：此操作无法撤销，订阅将被永久删除！
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDeleteConfirm}>取消</Button>
              <Button color="error" onClick={handlePermanentDeleteSubscription}>
                永久删除
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default SubscriptionHistoryPage; 