import React, { useState, useRef } from 'react';
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
  Alert,
  Stepper,
  Step,
  StepLabel,
  RadioGroup,
  Radio,
  FormLabel,
  Chip,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Tooltip,
  CircularProgress
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { Product } from '../../services/mockData';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import LinkIcon from '@mui/icons-material/Link';
import DescriptionIcon from '@mui/icons-material/Description';
import SaveIcon from '@mui/icons-material/Save';
import DraftsIcon from '@mui/icons-material/Drafts';
import PublishIcon from '@mui/icons-material/Publish';

// 定义数据产品类型（扩展自产品类型）
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

// 定义合约模板类型
interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  image: string;
}

// 模拟合约模板数据
const CONTRACT_TEMPLATES: ContractTemplate[] = [
  {
    id: 'template1',
    name: '基础数据服务',
    description: '适用于基础数据查询和分析，包含标准API访问和有限的数据量',
    image: 'https://picsum.photos/seed/template1/300/200'
  },
  {
    id: 'template2',
    name: '高级数据服务',
    description: '适用于大规模数据分析，包含高级API功能和更大的数据量',
    image: 'https://picsum.photos/seed/template2/300/200'
  },
  {
    id: 'template3',
    name: '企业级数据服务',
    description: '适用于企业级应用，包含完整的数据访问权限和定制化支持',
    image: 'https://picsum.photos/seed/template3/300/200'
  },
  {
    id: 'template4',
    name: '定制数据服务',
    description: '根据客户需求定制的数据服务方案',
    image: 'https://picsum.photos/seed/template4/300/200'
  }
];

// 数据格式选项
const DATA_FORMATS = ['CSV', 'JSON', 'XML', 'API', 'Excel', 'SQL'];

// 数据更新频率选项
const UPDATE_FREQUENCIES = ['实时', '每小时', '每日', '每周', '每月', '季度', '年度', '不定期'];

// 数据源类型选项
const DATA_SOURCES = ['MySQL数据库', 'PostgreSQL数据库', 'MongoDB数据库', 'Oracle数据库', 'API接口', 'CSV文件', '其他'];

// 数据产品类别选项
const PRODUCT_CATEGORIES = ['数据分析', '大数据', '人工智能', '物联网', '金融数据', '地理数据', '用户行为', '其他'];

// 定义组件属性
interface AddDataProductFormProps {
  onSubmit: (dataProduct: Omit<DataProduct, 'id' | 'createdAt'>, isDraft: boolean) => void;
  onCancel: () => void;
}

const AddDataProductForm: React.FC<AddDataProductFormProps> = ({ onSubmit, onCancel }) => {
  // 步骤状态
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['选择合约模板', '基本信息', '数据配置', '访问方式'];
  
  // 表单状态
  const [formData, setFormData] = useState<Omit<DataProduct, 'id' | 'createdAt'>>({
    name: '',
    description: '',
    category: '',
    price: 0,
    status: 'inactive', // 默认为未发布状态
    subscriptionRequirements: {
      minDuration: 1,
      maxQuantity: 1
    },
    source: '',
    format: '',
    updateFrequency: '',
    contractTemplate: '',
    accessMethod: 'file',
    files: [],
    isDraft: true
  });
  
  // 文件上传相关状态
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // 错误状态
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // 处理文本输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price' || name === 'minDuration' || name === 'maxQuantity') {
      const numValue = parseFloat(value);
      
      if (name === 'price') {
        setFormData({
          ...formData,
          price: isNaN(numValue) ? 0 : numValue
        });
      } else if (name === 'minDuration') {
        setFormData({
          ...formData,
          subscriptionRequirements: {
            ...formData.subscriptionRequirements,
            minDuration: isNaN(numValue) ? 1 : numValue
          }
        });
      } else if (name === 'maxQuantity') {
        setFormData({
          ...formData,
          subscriptionRequirements: {
            ...formData.subscriptionRequirements,
            maxQuantity: isNaN(numValue) ? 1 : numValue
          }
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // 清除相关错误
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
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
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // 处理访问方式变化
  const handleAccessMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      accessMethod: e.target.value as 'file' | 'api'
    });
  };
  
  // 处理合约模板选择
  const handleTemplateSelect = (templateId: string) => {
    setFormData({
      ...formData,
      contractTemplate: templateId
    });
    
    // 清除相关错误
    if (errors.contractTemplate) {
      setErrors({
        ...errors,
        contractTemplate: ''
      });
    }
  };
  
  // 处理文件上传点击
  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    setUploadError(null);
    
    // 模拟文件上传过程
    setTimeout(() => {
      const newFiles = Array.from(files).map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file)
      }));
      
      setFormData({
        ...formData,
        files: [...(formData.files || []), ...newFiles]
      });
      
      setUploading(false);
      
      // 重置文件输入，允许再次选择相同文件
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 1500);
  };
  
  // 处理文件删除
  const handleFileDelete = (index: number) => {
    const newFiles = [...(formData.files || [])];
    newFiles.splice(index, 1);
    
    setFormData({
      ...formData,
      files: newFiles
    });
  };
  
  // 验证当前步骤
  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (activeStep) {
      case 0: // 选择合约模板
        if (!formData.contractTemplate) {
          newErrors.contractTemplate = '请选择一个合约模板';
        }
        break;
        
      case 1: // 基本信息
        if (!formData.name.trim()) {
          newErrors.name = '产品名称不能为空';
        }
        
        if (!formData.description.trim()) {
          newErrors.description = '产品描述不能为空';
        }
        
        if (!formData.category) {
          newErrors.category = '请选择产品类别';
        }
        
        if (formData.price <= 0) {
          newErrors.price = '价格必须大于0';
        }
        break;
        
      case 2: // 数据配置
        if (!formData.source) {
          newErrors.source = '请选择数据源';
        }
        
        if (!formData.format) {
          newErrors.format = '请选择数据格式';
        }
        
        if (!formData.updateFrequency) {
          newErrors.updateFrequency = '请选择更新频率';
        }
        break;
        
      case 3: // 访问方式
        if (formData.accessMethod === 'file' && (!formData.files || formData.files.length === 0)) {
          newErrors.files = '请上传至少一个文件';
        }
        
        if (formData.accessMethod === 'api') {
          if (!formData.apiEndpoint) {
            newErrors.apiEndpoint = 'API端点不能为空';
          }
          
          if (!formData.apiDocumentation) {
            newErrors.apiDocumentation = 'API文档不能为空';
          }
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // 处理下一步
  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };
  
  // 处理上一步
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  // 处理保存为草稿
  const handleSaveAsDraft = () => {
    onSubmit({...formData, isDraft: true}, true);
  };
  
  // 处理提交
  const handleSubmit = () => {
    if (validateStep()) {
      onSubmit({...formData, status: 'active', isDraft: false}, false);
    }
  };
  
  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  };
  
  // 渲染步骤内容
  const renderStepContent = () => {
    switch (activeStep) {
      case 0: // 选择合约模板
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              选择合约模板
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              选择一个适合您数据产品的合约模板，这将决定产品的基本服务条款和定价结构。
            </Typography>
            
            {errors.contractTemplate && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errors.contractTemplate}
              </Alert>
            )}
            
            <Grid container spacing={3}>
              {CONTRACT_TEMPLATES.map((template) => (
                <Grid item xs={12} sm={6} md={3} key={template.id}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      border: formData.contractTemplate === template.id 
                        ? '2px solid #1976d2' 
                        : '1px solid #e0e0e0',
                      boxShadow: formData.contractTemplate === template.id 
                        ? '0 4px 12px rgba(25, 118, 210, 0.25)' 
                        : 'none',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                      }
                    }}
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={template.image}
                      alt={template.name}
                    />
                    <CardContent>
                      <Typography variant="h6" component="div" noWrap>
                        {template.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ 
                        height: 60, 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {template.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
        
      case 1: // 基本信息
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              基本信息
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              填写数据产品的基本信息，包括名称、描述、类别和价格等。
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="产品名称"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={!!errors.name}
                  helperText={errors.name || '请输入一个描述性的名称'}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="产品描述"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  error={!!errors.description}
                  helperText={errors.description || '详细描述产品的功能和价值'}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={!!errors.category}>
                  <InputLabel>产品类别</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    label="产品类别"
                    onChange={handleSelectChange}
                  >
                    {PRODUCT_CATEGORIES.map(category => (
                      <MenuItem key={category} value={category}>{category}</MenuItem>
                    ))}
                  </Select>
                  {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="价格 (¥/月)"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  InputProps={{ inputProps: { min: 0 } }}
                  error={!!errors.price}
                  helperText={errors.price}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="最小订阅时长 (月)"
                  name="minDuration"
                  type="number"
                  value={formData.subscriptionRequirements.minDuration}
                  onChange={handleInputChange}
                  InputProps={{ inputProps: { min: 1 } }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="最大订阅数量"
                  name="maxQuantity"
                  type="number"
                  value={formData.subscriptionRequirements.maxQuantity}
                  onChange={handleInputChange}
                  InputProps={{ inputProps: { min: 1 } }}
                />
              </Grid>
            </Grid>
          </Box>
        );
        
      case 2: // 数据配置
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              数据配置
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              配置数据产品的来源、格式和更新频率等信息。
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth required error={!!errors.source}>
                  <InputLabel>数据源</InputLabel>
                  <Select
                    name="source"
                    value={formData.source}
                    label="数据源"
                    onChange={handleSelectChange}
                  >
                    {DATA_SOURCES.map(source => (
                      <MenuItem key={source} value={source}>{source}</MenuItem>
                    ))}
                  </Select>
                  {errors.source && <FormHelperText>{errors.source}</FormHelperText>}
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth required error={!!errors.format}>
                  <InputLabel>数据格式</InputLabel>
                  <Select
                    name="format"
                    value={formData.format}
                    label="数据格式"
                    onChange={handleSelectChange}
                  >
                    {DATA_FORMATS.map(format => (
                      <MenuItem key={format} value={format}>{format}</MenuItem>
                    ))}
                  </Select>
                  {errors.format && <FormHelperText>{errors.format}</FormHelperText>}
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth required error={!!errors.updateFrequency}>
                  <InputLabel>更新频率</InputLabel>
                  <Select
                    name="updateFrequency"
                    value={formData.updateFrequency}
                    label="更新频率"
                    onChange={handleSelectChange}
                  >
                    {UPDATE_FREQUENCIES.map(frequency => (
                      <MenuItem key={frequency} value={frequency}>{frequency}</MenuItem>
                    ))}
                  </Select>
                  {errors.updateFrequency && <FormHelperText>{errors.updateFrequency}</FormHelperText>}
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        );
        
      case 3: // 访问方式
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              访问方式
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              配置用户访问数据产品的方式，可以是文件下载或API接口。
            </Typography>
            
            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <FormLabel component="legend">选择访问方式</FormLabel>
              <RadioGroup
                row
                name="accessMethod"
                value={formData.accessMethod}
                onChange={handleAccessMethodChange}
              >
                <FormControlLabel value="file" control={<Radio />} label="文件下载" />
                <FormControlLabel value="api" control={<Radio />} label="API接口" />
              </RadioGroup>
            </FormControl>
            
            {formData.accessMethod === 'file' && (
              <Box>
                <Paper sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <DescriptionIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="subtitle1" fontWeight={600}>
                      文件上传
                    </Typography>
                  </Box>
                  
                  {errors.files && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {errors.files}
                    </Alert>
                  )}
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    multiple
                  />
                  
                  <Box 
                    sx={{ 
                      border: '2px dashed #ccc', 
                      borderRadius: 2, 
                      p: 3, 
                      textAlign: 'center',
                      mb: 2,
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'rgba(25, 118, 210, 0.04)'
                      }
                    }}
                    onClick={handleFileUploadClick}
                  >
                    {uploading ? (
                      <CircularProgress size={40} />
                    ) : (
                      <>
                        <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                        <Typography variant="h6" gutterBottom>
                          点击或拖拽文件到此处上传
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          支持CSV、Excel、JSON、XML等格式文件
                        </Typography>
                      </>
                    )}
                  </Box>
                  
                  {uploadError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {uploadError}
                    </Alert>
                  )}
                  
                  {formData.files && formData.files.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        已上传文件 ({formData.files.length})
                      </Typography>
                      <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                        {formData.files.map((file, index) => (
                          <Box 
                            key={index}
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between',
                              p: 1,
                              borderBottom: '1px solid #eee',
                              '&:last-child': {
                                borderBottom: 'none'
                              }
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <DescriptionIcon sx={{ mr: 1, color: 'text.secondary' }} />
                              <Box>
                                <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                                  {file.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {formatFileSize(file.size)}
                                </Typography>
                              </Box>
                            </Box>
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleFileDelete(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Paper>
              </Box>
            )}
            
            {formData.accessMethod === 'api' && (
              <Box>
                <Paper sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LinkIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="subtitle1" fontWeight={600}>
                      API配置
                    </Typography>
                  </Box>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        label="API端点"
                        name="apiEndpoint"
                        value={formData.apiEndpoint || ''}
                        onChange={handleInputChange}
                        placeholder="https://api.example.com/data"
                        error={!!errors.apiEndpoint}
                        helperText={errors.apiEndpoint || '用户将通过此端点访问数据'}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        label="API文档"
                        name="apiDocumentation"
                        value={formData.apiDocumentation || ''}
                        onChange={handleInputChange}
                        multiline
                        rows={4}
                        placeholder="# API文档\n\n## 认证\n使用API密钥进行认证...\n\n## 端点\n- GET /data: 获取数据列表\n- GET /data/{id}: 获取特定数据"
                        error={!!errors.apiDocumentation}
                        helperText={errors.apiDocumentation || '提供API使用说明，支持Markdown格式'}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            )}
          </Box>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <Box>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {renderStepContent()}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="outlined"
          onClick={activeStep === 0 ? onCancel : handleBack}
          sx={{ mr: 1 }}
        >
          {activeStep === 0 ? '取消' : '上一步'}
        </Button>
        
        <Box>
          {activeStep === steps.length - 1 ? (
            <>
              <Button
                variant="outlined"
                startIcon={<DraftsIcon />}
                onClick={handleSaveAsDraft}
                sx={{ mr: 1 }}
              >
                保存为草稿
              </Button>
              <Button
                variant="contained"
                startIcon={<PublishIcon />}
                onClick={handleSubmit}
              >
                发布产品
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
            >
              下一步
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AddDataProductForm; 