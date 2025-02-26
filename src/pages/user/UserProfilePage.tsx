import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  Alert,
  Snackbar,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Chip,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import { useUser } from '../../context/UserContext';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import SecurityIcon from '@mui/icons-material/Security';
import HistoryIcon from '@mui/icons-material/History';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import BadgeIcon from '@mui/icons-material/Badge';
import WorkIcon from '@mui/icons-material/Work';
import EventIcon from '@mui/icons-material/Event';
import DescriptionIcon from '@mui/icons-material/Description';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const UserProfilePage: React.FC = () => {
  const { user, updateUserInfo } = useUser();
  const theme = useTheme();
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('个人资料已成功更新！');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    company: user?.company || '',
    department: user?.department || '',
    position: user?.position || '',
    joinDate: user?.joinDate || '',
    bio: user?.bio || ''
  });

  // 初始化头像预览
  useEffect(() => {
    if (user?.avatar) {
      setPreviewUrl(user.avatar);
    }
  }, [user]);

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // 处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 更新用户信息
    updateUserInfo({
      username: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      department: formData.department,
      position: formData.position,
      bio: formData.bio
    });
    setSuccessMessage('个人资料已成功更新！');
    setSuccess(true);
    setEditing(false);
  };

  // 处理成功消息关闭
  const handleCloseSuccess = () => {
    setSuccess(false);
  };

  // 打开文件选择器
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      setAvatarDialogOpen(true);
    }
  };

  // 关闭头像对话框
  const handleCloseAvatarDialog = () => {
    setAvatarDialogOpen(false);
    setSelectedFile(null);
    // 如果用户取消，恢复原来的头像
    if (user?.avatar) {
      setPreviewUrl(user.avatar);
    } else {
      setPreviewUrl('');
    }
  };

  // 保存头像
  const handleSaveAvatar = () => {
    setUploading(true);
    // 模拟上传过程
    setTimeout(() => {
      // 在实际应用中，这里应该调用API上传头像
      // 这里我们直接使用预览URL作为头像URL
      updateUserInfo({
        avatar: previewUrl
      });
      setUploading(false);
      setAvatarDialogOpen(false);
      setSuccessMessage('头像已成功更新！');
      setSuccess(true);
    }, 1000);
  };

  // 获取当前日期
  const currentDate = format(new Date(), 'yyyy年MM月dd日', { locale: zhCN });

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
        <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              sx={{ 
                bgcolor: 'primary.main', 
                width: 56, 
                height: 56, 
                mr: 2,
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}
            >
              <PersonIcon fontSize="large" />
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
                个人资料
              </Typography>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 500, 
                  color: '#555'
                }}
              >
                查看和管理您的个人信息
              </Typography>
            </Box>
          </Box>
          <Chip 
            label={currentDate} 
            variant="outlined" 
            icon={<EventIcon />} 
            sx={{ 
              borderRadius: '16px', 
              px: 1,
              bgcolor: 'rgba(255, 255, 255, 0.7)',
              borderColor: theme.palette.primary.light
            }} 
          />
        </Box>
      </Paper>

      <Snackbar open={success} autoHideDuration={3000} onClose={handleCloseSuccess}>
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', height: '100%' }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                <Avatar
                  src={previewUrl}
                  sx={{
                    width: 120,
                    height: 120,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    border: '4px solid white',
                    bgcolor: theme.palette.primary.main
                  }}
                >
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
                <Tooltip title="更换头像">
                  <IconButton
                    onClick={handleAvatarClick}
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.dark'
                      }
                    }}
                    size="small"
                  >
                    <PhotoCameraIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Box>
              <Typography variant="h5" gutterBottom>
                {user?.username || '用户名'}
              </Typography>
              <Chip 
                label={user?.role === 'admin' ? '管理员' : '普通用户'} 
                color={user?.role === 'admin' ? 'secondary' : 'primary'}
                sx={{ 
                  borderRadius: '16px', 
                  fontWeight: 500,
                  mb: 2
                }} 
              />
              
              <Box sx={{ mt: 2, mb: 2, px: 2 }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    fontStyle: 'italic',
                    textAlign: 'center',
                    lineHeight: 1.6
                  }}
                >
                  {user?.bio || '暂无个人简介'}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              <List sx={{ width: '100%' }}>
                <ListItemButton sx={{ borderRadius: '8px', mb: 1, '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.08)' } }}>
                  <ListItemIcon>
                    <SecurityIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="安全设置" 
                    primaryTypographyProps={{ fontWeight: 500 }}
                    secondary="管理密码和安全选项"
                  />
                </ListItemButton>
                <ListItemButton sx={{ borderRadius: '8px', mb: 1, '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.08)' } }}>
                  <ListItemIcon>
                    <HistoryIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="登录历史" 
                    primaryTypographyProps={{ fontWeight: 500 }}
                    secondary="查看您的登录记录"
                  />
                </ListItemButton>
                <ListItemButton sx={{ borderRadius: '8px', '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.08)' } }}>
                  <ListItemIcon>
                    <NotificationsIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="通知设置" 
                    primaryTypographyProps={{ fontWeight: 500 }}
                    secondary="管理系统通知偏好"
                  />
                </ListItemButton>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>基本信息</Typography>
              {!editing ? (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setEditing(true)}
                  sx={{ borderRadius: '8px' }}
                >
                  编辑
                </Button>
              ) : (
                <Box>
                  <Button
                    color="error"
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={() => setEditing(false)}
                    sx={{ mr: 1, borderRadius: '8px' }}
                  >
                    取消
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSubmit}
                    sx={{ borderRadius: '8px' }}
                  >
                    保存
                  </Button>
                </Box>
              )}
            </Box>
            <Divider sx={{ mb: 3 }} />
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="用户名"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!editing}
                    InputProps={{
                      startAdornment: (
                        <PersonIcon color="action" sx={{ mr: 1 }} />
                      ),
                    }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="邮箱"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!editing}
                    InputProps={{
                      startAdornment: (
                        <EmailIcon color="action" sx={{ mr: 1 }} />
                      ),
                    }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="手机号码"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!editing}
                    InputProps={{
                      startAdornment: (
                        <PhoneIcon color="action" sx={{ mr: 1 }} />
                      ),
                    }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="公司"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    disabled={!editing}
                    InputProps={{
                      startAdornment: (
                        <BusinessIcon color="action" sx={{ mr: 1 }} />
                      ),
                    }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="部门"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    disabled={!editing}
                    InputProps={{
                      startAdornment: (
                        <BadgeIcon color="action" sx={{ mr: 1 }} />
                      ),
                    }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="职位"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    disabled={!editing}
                    InputProps={{
                      startAdornment: (
                        <WorkIcon color="action" sx={{ mr: 1 }} />
                      ),
                    }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="个人简介"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    disabled={!editing}
                    multiline
                    rows={4}
                    InputProps={{
                      startAdornment: (
                        <DescriptionIcon color="action" sx={{ mr: 1, mt: 1 }} />
                      ),
                    }}
                    variant="outlined"
                    placeholder="请输入您的个人简介..."
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="入职日期"
                    name="joinDate"
                    value={formData.joinDate}
                    onChange={handleInputChange}
                    disabled={true}
                    InputProps={{
                      startAdornment: (
                        <EventIcon color="action" sx={{ mr: 1 }} />
                      ),
                    }}
                    variant="outlined"
                    helperText="入职日期不可修改"
                  />
                </Grid>
              </Grid>
            </form>
          </Paper>
          
          <Paper sx={{ p: 3, borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', mt: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main, mb: 2 }}>
              账户信息
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 500, width: 120 }}>账户ID:</Typography>
                  <Typography variant="body1">{user?.id || 'N/A'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 500, width: 120 }}>账户类型:</Typography>
                  <Chip 
                    label={user?.role === 'admin' ? '管理员' : '普通用户'} 
                    size="small"
                    color={user?.role === 'admin' ? 'secondary' : 'primary'}
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ fontWeight: 500, width: 120 }}>账户状态:</Typography>
                  <Chip label="正常" size="small" color="success" />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 500, width: 120 }}>创建时间:</Typography>
                  <Typography variant="body1">{user?.role === 'admin' ? '2020年01月01日' : '2021年06月15日'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 500, width: 120 }}>最后登录:</Typography>
                  <Typography variant="body1">{currentDate}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ fontWeight: 500, width: 120 }}>权限级别:</Typography>
                  <Typography variant="body1">{user?.role === 'admin' ? '系统管理员' : '普通用户'}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* 头像上传对话框 */}
      <Dialog open={avatarDialogOpen} onClose={handleCloseAvatarDialog}>
        <DialogTitle>更新头像</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', my: 2 }}>
            <Avatar
              src={previewUrl}
              sx={{
                width: 150,
                height: 150,
                margin: '0 auto',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                border: '4px solid white',
                bgcolor: theme.palette.primary.main
              }}
            >
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
            预览您的新头像
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAvatarDialog} color="error">
            取消
          </Button>
          <Button 
            onClick={handleSaveAvatar} 
            color="primary" 
            variant="contained"
            disabled={uploading}
            startIcon={uploading ? <CircularProgress size={20} /> : null}
          >
            {uploading ? '上传中...' : '保存头像'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserProfilePage;