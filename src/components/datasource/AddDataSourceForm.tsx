import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  Paper,
  Divider,
  Alert
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { DataSource } from '../../services/mockData';

// 定义数据源类型选项
const DATA_SOURCE_TYPES = ['MySQL', 'PostgreSQL', 'MongoDB', 'Oracle', 'API', 'CSV'];

// 定义表单错误类型
interface FormErrors {
  name?: string;
  type?: string;
  host?: string;
  port?: string;
  database?: string;
  username?: string;
  password?: string;
}

// 定义组件属性
interface AddDataSourceFormProps {
  onSubmit: (dataSource: Omit<DataSource, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const AddDataSourceForm: React.FC<AddDataSourceFormProps> = ({ onSubmit, onCancel }) => {
  // 表单状态
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    host: '',
    port: '',
    database: '',
    username: '',
    password: '',
    ssl: false
  });
  
  // 错误状态
  const [errors, setErrors] = useState<FormErrors>({});
  
  // 测试连接状态
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  
  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // 清除相关错误
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };
  
  // 处理选择变化
  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // 清除相关错误
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };
  
  // 处理开关变化
  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      ssl: e.target.checked
    });
  };
  
  // 验证表单
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = '数据源名称不能为空';
    }
    
    if (!formData.type) {
      newErrors.type = '请选择数据源类型';
    }
    
    if (!formData.host.trim()) {
      newErrors.host = '主机地址不能为空';
    }
    
    if (!formData.port.trim()) {
      newErrors.port = '端口不能为空';
    } else if (!/^\d+$/.test(formData.port) || parseInt(formData.port) <= 0 || parseInt(formData.port) > 65535) {
      newErrors.port = '请输入有效的端口号 (1-65535)';
    }
    
    if (!formData.database.trim()) {
      newErrors.database = '数据库名称不能为空';
    }
    
    if (!formData.username.trim()) {
      newErrors.username = '用户名不能为空';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = '密码不能为空';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // 测试连接
  const handleTestConnection = () => {
    if (!validateForm()) {
      return;
    }
    
    setTestingConnection(true);
    setTestResult(null);
    
    // 模拟测试连接过程
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70%概率成功
      setTestingConnection(false);
      
      if (success) {
        setTestResult({
          success: true,
          message: '连接测试成功！'
        });
      } else {
        setTestResult({
          success: false,
          message: '连接测试失败，请检查连接参数。'
        });
      }
    }, 2000);
  };
  
  // 提交表单
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // 构建数据源对象
    const newDataSource: Omit<DataSource, 'id' | 'createdAt'> = {
      name: formData.name,
      type: formData.type,
      connectionDetails: {
        host: formData.host,
        port: parseInt(formData.port),
        database: formData.database,
        username: formData.username,
        ssl: formData.ssl
      },
      status: 'active'
    };
    
    onSubmit(newDataSource);
  };
  
  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Paper sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
        <Typography variant="h6" gutterBottom>
          基本信息
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="数据源名称"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={!!errors.name}
              helperText={errors.name || '请输入一个描述性的名称'}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!errors.type}>
              <InputLabel>数据源类型</InputLabel>
              <Select
                name="type"
                value={formData.type}
                label="数据源类型"
                onChange={handleSelectChange}
              >
                {DATA_SOURCE_TYPES.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
              {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      <Paper sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
        <Typography variant="h6" gutterBottom>
          连接信息
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={8}>
            <TextField
              required
              fullWidth
              label="主机地址"
              name="host"
              value={formData.host}
              onChange={handleInputChange}
              error={!!errors.host}
              helperText={errors.host || '例如: db.example.com 或 192.168.1.100'}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              required
              fullWidth
              label="端口"
              name="port"
              value={formData.port}
              onChange={handleInputChange}
              error={!!errors.port}
              helperText={errors.port || '例如: 3306 (MySQL), 5432 (PostgreSQL)'}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="数据库名称"
              name="database"
              value={formData.database}
              onChange={handleInputChange}
              error={!!errors.database}
              helperText={errors.database}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="用户名"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              error={!!errors.username}
              helperText={errors.username}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="密码"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              error={!!errors.password}
              helperText={errors.password}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.ssl}
                  onChange={handleSwitchChange}
                  color="primary"
                />
              }
              label="启用SSL连接"
            />
          </Grid>
        </Grid>
      </Paper>
      
      {testResult && (
        <Alert 
          severity={testResult.success ? "success" : "error"} 
          sx={{ mb: 3, borderRadius: '8px' }}
        >
          {testResult.message}
        </Alert>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          variant="outlined" 
          onClick={handleTestConnection}
          disabled={testingConnection}
        >
          {testingConnection ? '测试中...' : '测试连接'}
        </Button>
        <Box>
          <Button 
            variant="outlined" 
            onClick={onCancel} 
            sx={{ mr: 2 }}
          >
            取消
          </Button>
          <Button 
            variant="contained" 
            type="submit"
          >
            添加数据源
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddDataSourceForm; 