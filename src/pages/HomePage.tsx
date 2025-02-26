import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Divider,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Fade,
  Zoom,
  useTheme,
  alpha
} from '@mui/material';
import { useUser } from '../context/UserContext';
import { mockTodoItems, TodoItem } from '../services/mockData';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import TitleIcon from '@mui/icons-material/Title';
import DescriptionIcon from '@mui/icons-material/Description';
import EventIcon from '@mui/icons-material/Event';
import { v4 as uuidv4 } from 'uuid';

const HomePage: React.FC = () => {
  const { user } = useUser();
  const theme = useTheme();
  
  // 使用useState管理待办事项状态
  const [todoItems, setTodoItems] = useState<TodoItem[]>(mockTodoItems);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // 新增待办事项对话框状态
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [titleError, setTitleError] = useState('');
  
  // 处理搜索输入变化
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  // 清除搜索内容
  const handleClearSearch = () => {
    setSearchTerm('');
  };
  
  // 过滤待办事项
  const filteredTodoItems = todoItems.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // 分离待办和已办事项
  const pendingItems = filteredTodoItems.filter(item => item.status === 'pending');
  const completedItems = filteredTodoItems.filter(item => item.status === 'completed');

  // 标记待办事项为已完成
  const handleMarkAsCompleted = (itemId: string) => {
    setTodoItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId 
          ? { ...item, status: 'completed' } 
          : item
      )
    );
  };

  // 删除待办事项
  const handleDeleteItem = (itemId: string) => {
    setTodoItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };
  
  // 打开新增待办事项对话框
  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
    setNewTodoTitle('');
    setNewTodoDescription('');
    setTitleError('');
  };
  
  // 关闭新增待办事项对话框
  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };
  
  // 添加新待办事项
  const handleAddTodo = () => {
    // 验证标题不为空
    if (!newTodoTitle.trim()) {
      setTitleError('标题不能为空');
      return;
    }
    
    // 创建新待办事项
    const newTodo: TodoItem = {
      id: uuidv4(),
      title: newTodoTitle.trim(),
      description: newTodoDescription.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 默认截止时间为一周后
    };
    
    // 添加到待办事项列表
    setTodoItems(prevItems => [...prevItems, newTodo]);
    
    // 关闭对话框
    handleCloseAddDialog();
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
            <DashboardIcon fontSize="large" />
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
              欢迎使用联通数智云平台
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 500, 
                color: user?.role === 'admin' ? '#1565c0' : '#2e7d32',
                display: 'flex',
                alignItems: 'center',
                animation: 'fadeIn 0.5s ease-in-out'
              }}
            >
              {user?.role === 'admin' ? '管理员控制面板' : '用户控制面板'}
              <Box 
                component="span" 
                sx={{ 
                  display: 'inline-block', 
                  ml: 1,
                  px: 1.5, 
                  py: 0.5, 
                  bgcolor: user?.role === 'admin' ? 'rgba(21, 101, 192, 0.1)' : 'rgba(46, 125, 50, 0.1)', 
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
              >
                {user?.role === 'admin' ? '管理权限' : '标准权限'}
              </Box>
            </Typography>
          </Box>
        </Box>
      </Paper>
      
      {/* 搜索和添加按钮 - 美化版 */}
      <Paper 
        elevation={2} 
        sx={{ 
          mb: 3, 
          p: 2, 
          borderRadius: '16px',
          background: 'linear-gradient(to right, #f8f9fa, #ffffff)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            flex: '1 1 300px',
            position: 'relative',
            transition: 'all 0.3s ease',
            '&:focus-within': {
              transform: 'translateY(-2px)',
              '& .MuiOutlinedInput-root': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
              }
            }
          }}
        >
          <TextField
            placeholder="搜索待办事项..."
            variant="outlined"
            fullWidth
            size="medium"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: theme.palette.primary.main }} />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton 
                    size="small" 
                    onClick={handleClearSearch}
                    sx={{ 
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                      }
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                borderRadius: '12px',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                  borderWidth: '2px',
                },
                transition: 'all 0.3s ease',
                bgcolor: alpha(theme.palette.background.paper, 0.8),
                backdropFilter: 'blur(8px)'
              }
            }}
          />
          {searchTerm && (
            <Box 
              sx={{ 
                position: 'absolute', 
                right: 12, 
                top: '50%', 
                transform: 'translateY(-50%)',
                zIndex: 2
              }}
            >
            </Box>
          )}
        </Box>
        
        <Zoom in={true} style={{ transitionDelay: '100ms' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
            sx={{ 
              borderRadius: '12px',
              px: 3,
              py: 1.2,
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                transform: 'translateY(-3px)',
                background: 'linear-gradient(45deg, #1565c0, #1976d2)'
              },
              transition: 'all 0.3s ease',
              fontWeight: 600,
              letterSpacing: '0.5px',
              flex: '0 0 auto'
            }}
          >
            新增待办事项
          </Button>
        </Zoom>
      </Paper>

      <Grid container spacing={3}>
        {/* 待办事项 */}
        <Grid item xs={12} md={6}>
          <Paper 
            sx={{ 
              p: 2, 
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '5px',
                height: '100%',
                background: 'linear-gradient(to bottom, #ff9800, #ed6c02)',
                borderTopLeftRadius: '12px',
                borderBottomLeftRadius: '12px'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AssignmentIcon sx={{ color: '#ff9800', mr: 1 }} />
              <Typography 
                variant="h6" 
                component="h2" 
                sx={{ 
                  fontWeight: 600, 
                  color: '#ff9800',
                  flexGrow: 1
                }}
              >
                待办事项
              </Typography>
              <Chip 
                label={`${pendingItems.length}项`} 
                size="small" 
                color="warning" 
                sx={{ fontWeight: 600 }}
              />
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {pendingItems.length === 0 ? (
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                {searchTerm ? '没有找到匹配的待办事项' : '暂无待办事项'}
              </Typography>
            ) : (
              pendingItems.map(item => (
                <Card key={item.id} sx={{ mb: 2, borderRadius: '8px' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" component="div">
                        {item.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Chip 
                          label="待处理" 
                          color="warning" 
                          size="small" 
                          sx={{ mr: 1 }}
                        />
                        <Tooltip title="删除">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      创建时间: {new Date(item.createdAt).toLocaleString()}
                    </Typography>
                    <Typography variant="caption" display="block">
                      截止时间: {new Date(item.dueDate).toLocaleString()}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">查看详情</Button>
                    <Button 
                      size="small" 
                      color="primary"
                      startIcon={<DoneIcon />}
                      onClick={() => handleMarkAsCompleted(item.id)}
                    >
                      标记为已完成
                    </Button>
                  </CardActions>
                </Card>
              ))
            )}
          </Paper>
        </Grid>

        {/* 已办事项 */}
        <Grid item xs={12} md={6}>
          <Paper 
            sx={{ 
              p: 2, 
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '5px',
                height: '100%',
                background: 'linear-gradient(to bottom, #4caf50, #2e7d32)',
                borderTopLeftRadius: '12px',
                borderBottomLeftRadius: '12px'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CheckCircleIcon sx={{ color: '#4caf50', mr: 1 }} />
              <Typography 
                variant="h6" 
                component="h2" 
                sx={{ 
                  fontWeight: 600, 
                  color: '#4caf50',
                  flexGrow: 1
                }}
              >
                已办事项
              </Typography>
              <Chip 
                label={`${completedItems.length}项`} 
                size="small" 
                color="success" 
                sx={{ fontWeight: 600 }}
              />
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {completedItems.length === 0 ? (
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                {searchTerm ? '没有找到匹配的已办事项' : '暂无已办事项'}
              </Typography>
            ) : (
              completedItems.map(item => (
                <Card key={item.id} sx={{ mb: 2, borderRadius: '8px' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" component="div">
                        {item.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Chip 
                          label="已完成" 
                          color="success" 
                          size="small" 
                          sx={{ mr: 1 }}
                        />
                        <Tooltip title="删除">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      创建时间: {new Date(item.createdAt).toLocaleString()}
                    </Typography>
                    <Typography variant="caption" display="block">
                      完成时间: {new Date(item.dueDate).toLocaleString()}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">查看详情</Button>
                  </CardActions>
                </Card>
              ))
            )}
          </Paper>
        </Grid>
      </Grid>
      
      {/* 新增待办事项对话框 - 美化版 */}
      <Dialog 
        open={openAddDialog} 
        onClose={handleCloseAddDialog}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            fontWeight: 600, 
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 2,
            px: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              sx={{ 
                bgcolor: theme.palette.primary.main, 
                mr: 2,
                width: 36,
                height: 36
              }}
            >
              <AddIcon />
            </Avatar>
            新增待办事项
          </Box>
          <IconButton 
            edge="end" 
            color="inherit" 
            onClick={handleCloseAddDialog}
            sx={{ 
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.2),
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 3 }}>
          <Box sx={{ mt: 1 }}>
            <FormControl fullWidth error={!!titleError} sx={{ mb: 3 }}>
              <InputLabel htmlFor="todo-title">标题</InputLabel>
              <OutlinedInput
                id="todo-title"
                label="标题"
                value={newTodoTitle}
                onChange={(e) => {
                  setNewTodoTitle(e.target.value);
                  if (e.target.value.trim()) {
                    setTitleError('');
                  }
                }}
                placeholder="请输入待办事项标题"
                startAdornment={
                  <InputAdornment position="start">
                    <TitleIcon color="primary" />
                  </InputAdornment>
                }
                sx={{
                  borderRadius: '12px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: alpha(theme.palette.primary.main, 0.2),
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                    borderWidth: '2px',
                  }
                }}
              />
              {titleError && <FormHelperText error>{titleError}</FormHelperText>}
            </FormControl>
            
            <TextField
              fullWidth
              label="描述"
              multiline
              rows={4}
              value={newTodoDescription}
              onChange={(e) => setNewTodoDescription(e.target.value)}
              placeholder="请输入待办事项详细描述"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5, mr: 1 }}>
                    <DescriptionIcon color="primary" />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '12px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: alpha(theme.palette.primary.main, 0.2),
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                    borderWidth: '2px',
                  }
                }
              }}
              sx={{ mb: 2 }}
            />
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mt: 2, 
              p: 2, 
              borderRadius: '12px',
              bgcolor: alpha(theme.palette.info.main, 0.05),
              border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`
            }}>
              <EventIcon sx={{ color: theme.palette.info.main, mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                默认截止时间将设置为一周后。创建后可以在详情中修改。
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
          <Button 
            onClick={handleCloseAddDialog} 
            color="inherit"
            variant="outlined"
            sx={{ 
              borderRadius: '10px',
              px: 3
            }}
          >
            取消
          </Button>
          <Button 
            onClick={handleAddTodo} 
            variant="contained" 
            startIcon={<AddIcon />}
            sx={{ 
              borderRadius: '10px',
              px: 3,
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                background: 'linear-gradient(45deg, #1565c0, #1976d2)'
              }
            }}
          >
            添加
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HomePage; 