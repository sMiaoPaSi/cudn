// 设备类型定义
export interface Device {
  id: string;
  status: 'active' | 'inactive' | 'disabled';
  type: string;
  connectionTime: string;
  details?: {
    model: string;
    serialNumber: string;
    location: string;
    lastMaintenance: string;
  };
}

// 产品类型定义
export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  status: 'active' | 'inactive';
  subscriptionRequirements: {
    minDuration: number;
    maxQuantity: number;
  };
  createdAt: string;
}

// 订阅类型定义
export interface Subscription {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  startDate: string;
  endDate: string;
  quantity: number;
  status: 'active' | 'expired' | 'cancelled';
}

// 数据源类型定义
export interface DataSource {
  id: string;
  name: string;
  type: string;
  connectionDetails: {
    host: string;
    port: number;
    database: string;
    username?: string;
    ssl?: boolean;
  };
  status: 'active' | 'inactive';
  createdAt: string;
}

// 待办事项类型定义
export interface TodoItem {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  createdAt: string;
  dueDate: string;
}

// 模拟设备数据
export const mockDevices: Device[] = [
  {
    id: 'DEV001',
    status: 'active',
    type: '路由器',
    connectionTime: '2023-01-15T08:30:00',
    details: {
      model: 'RT-AC68U',
      serialNumber: 'SN12345678',
      location: '北京数据中心',
      lastMaintenance: '2023-05-20'
    }
  },
  {
    id: 'DEV002',
    status: 'active',
    type: '交换机',
    connectionTime: '2023-02-10T10:15:00',
    details: {
      model: 'SG-3000',
      serialNumber: 'SN87654321',
      location: '上海数据中心',
      lastMaintenance: '2023-06-15'
    }
  },
  {
    id: 'DEV003',
    status: 'inactive',
    type: '服务器',
    connectionTime: '2023-03-05T14:45:00',
    details: {
      model: 'PowerEdge R740',
      serialNumber: 'SN11223344',
      location: '广州数据中心',
      lastMaintenance: '2023-04-10'
    }
  },
  {
    id: 'DEV004',
    status: 'disabled',
    type: '防火墙',
    connectionTime: '2023-01-20T09:00:00',
    details: {
      model: 'FortiGate 100F',
      serialNumber: 'SN55667788',
      location: '深圳数据中心',
      lastMaintenance: '2023-03-25'
    }
  },
  {
    id: 'DEV005',
    status: 'active',
    type: '路由器',
    connectionTime: '2023-04-12T11:30:00',
    details: {
      model: 'RT-AX88U',
      serialNumber: 'SN99887766',
      location: '成都数据中心',
      lastMaintenance: '2023-07-05'
    }
  },
  {
    id: 'DEV006',
    status: 'active',
    type: '服务器',
    connectionTime: '2023-05-18T09:45:00',
    details: {
      model: 'Dell PowerEdge R750',
      serialNumber: 'SN22334455',
      location: '武汉数据中心',
      lastMaintenance: '2023-08-10'
    }
  },
  {
    id: 'DEV007',
    status: 'inactive',
    type: '存储设备',
    connectionTime: '2023-03-22T13:20:00',
    details: {
      model: 'NetApp AFF A400',
      serialNumber: 'SN33445566',
      location: '杭州数据中心',
      lastMaintenance: '2023-06-30'
    }
  },
  {
    id: 'DEV008',
    status: 'active',
    type: '负载均衡器',
    connectionTime: '2023-06-05T10:10:00',
    details: {
      model: 'F5 BIG-IP 2000s',
      serialNumber: 'SN44556677',
      location: '南京数据中心',
      lastMaintenance: '2023-09-15'
    }
  },
  {
    id: 'DEV009',
    status: 'active',
    type: '交换机',
    connectionTime: '2023-07-12T08:50:00',
    details: {
      model: 'Cisco Catalyst 9300',
      serialNumber: 'SN55667788',
      location: '重庆数据中心',
      lastMaintenance: '2023-10-05'
    }
  },
  {
    id: 'DEV010',
    status: 'disabled',
    type: '防火墙',
    connectionTime: '2023-02-28T15:30:00',
    details: {
      model: 'Palo Alto PA-3260',
      serialNumber: 'SN66778899',
      location: '西安数据中心',
      lastMaintenance: '2023-05-12'
    }
  },
  {
    id: 'DEV011',
    status: 'active',
    type: '路由器',
    connectionTime: '2023-08-03T11:15:00',
    details: {
      model: 'Cisco ISR 4451',
      serialNumber: 'SN77889900',
      location: '天津数据中心',
      lastMaintenance: '2023-11-20'
    }
  },
  {
    id: 'DEV012',
    status: 'active',
    type: '服务器',
    connectionTime: '2023-09-10T09:30:00',
    details: {
      model: 'HPE ProLiant DL380',
      serialNumber: 'SN88990011',
      location: '长沙数据中心',
      lastMaintenance: '2023-12-05'
    }
  }
];

// 模拟产品数据
export const mockProducts: Product[] = [
  {
    id: 'PROD001',
    name: '云存储基础版',
    description: '提供基础的云存储服务，适合个人和小型企业使用',
    category: '云存储',
    price: 99,
    status: 'active',
    subscriptionRequirements: {
      minDuration: 1,
      maxQuantity: 5
    },
    createdAt: '2023-01-10T00:00:00'
  },
  {
    id: 'PROD002',
    name: '云存储专业版',
    description: '提供高级的云存储服务，适合中大型企业使用',
    category: '云存储',
    price: 299,
    status: 'active',
    subscriptionRequirements: {
      minDuration: 3,
      maxQuantity: 10
    },
    createdAt: '2023-01-15T00:00:00'
  },
  {
    id: 'PROD003',
    name: '数据分析基础版',
    description: '提供基础的数据分析工具，适合初级分析师使用',
    category: '数据分析',
    price: 199,
    status: 'active',
    subscriptionRequirements: {
      minDuration: 1,
      maxQuantity: 3
    },
    createdAt: '2023-02-01T00:00:00'
  },
  {
    id: 'PROD004',
    name: '数据分析专业版',
    description: '提供高级的数据分析工具，适合专业分析师使用',
    category: '数据分析',
    price: 499,
    status: 'active',
    subscriptionRequirements: {
      minDuration: 6,
      maxQuantity: 5
    },
    createdAt: '2023-02-15T00:00:00'
  },
  {
    id: 'PROD005',
    name: '安全监控服务',
    description: '提供全天候的安全监控服务，保障您的数据安全',
    category: '安全服务',
    price: 399,
    status: 'inactive',
    subscriptionRequirements: {
      minDuration: 12,
      maxQuantity: 1
    },
    createdAt: '2023-03-01T00:00:00'
  },
  {
    id: 'PROD006',
    name: '云存储企业版',
    description: '为大型企业提供的高性能云存储解决方案，支持PB级数据存储和高并发访问',
    category: '云存储',
    price: 999,
    status: 'active',
    subscriptionRequirements: {
      minDuration: 6,
      maxQuantity: 20
    },
    createdAt: '2023-03-15T00:00:00'
  },
  {
    id: 'PROD007',
    name: '数据可视化平台',
    description: '直观的数据可视化工具，将复杂数据转化为易于理解的图表和仪表盘',
    category: '数据分析',
    price: 349,
    status: 'active',
    subscriptionRequirements: {
      minDuration: 3,
      maxQuantity: 8
    },
    createdAt: '2023-04-05T00:00:00'
  },
  {
    id: 'PROD008',
    name: '网络安全评估',
    description: '全面的网络安全评估服务，识别潜在的安全漏洞并提供修复建议',
    category: '安全服务',
    price: 599,
    status: 'active',
    subscriptionRequirements: {
      minDuration: 1,
      maxQuantity: 2
    },
    createdAt: '2023-04-20T00:00:00'
  },
  {
    id: 'PROD009',
    name: 'AI预测分析',
    description: '基于人工智能的预测分析工具，帮助企业预测未来趋势和做出数据驱动的决策',
    category: '人工智能',
    price: 799,
    status: 'active',
    subscriptionRequirements: {
      minDuration: 6,
      maxQuantity: 3
    },
    createdAt: '2023-05-10T00:00:00'
  },
  {
    id: 'PROD010',
    name: '物联网数据平台',
    description: '专为物联网设备设计的数据收集和分析平台，支持海量设备接入和实时数据处理',
    category: '物联网',
    price: 599,
    status: 'active',
    subscriptionRequirements: {
      minDuration: 3,
      maxQuantity: 10
    },
    createdAt: '2023-05-25T00:00:00'
  },
  {
    id: 'PROD011',
    name: '大数据处理引擎',
    description: '高性能的大数据处理引擎，支持PB级数据的快速处理和分析',
    category: '大数据',
    price: 899,
    status: 'active',
    subscriptionRequirements: {
      minDuration: 6,
      maxQuantity: 5
    },
    createdAt: '2023-06-15T00:00:00'
  },
  {
    id: 'PROD012',
    name: '云数据库服务',
    description: '高可用、可扩展的云数据库服务，支持多种数据库类型和自动备份',
    category: '云存储',
    price: 449,
    status: 'active',
    subscriptionRequirements: {
      minDuration: 3,
      maxQuantity: 8
    },
    createdAt: '2023-07-01T00:00:00'
  },
  {
    id: 'PROD013',
    name: '实时数据流处理',
    description: '处理和分析实时数据流的平台，适用于需要即时洞察的场景',
    category: '大数据',
    price: 649,
    status: 'active',
    subscriptionRequirements: {
      minDuration: 3,
      maxQuantity: 6
    },
    createdAt: '2023-07-20T00:00:00'
  },
  {
    id: 'PROD014',
    name: 'AI图像识别服务',
    description: '基于深度学习的图像识别服务，可用于物体检测、人脸识别等场景',
    category: '人工智能',
    price: 549,
    status: 'active',
    subscriptionRequirements: {
      minDuration: 1,
      maxQuantity: 5
    },
    createdAt: '2023-08-05T00:00:00'
  },
  {
    id: 'PROD015',
    name: '边缘计算平台',
    description: '在网络边缘处理数据的计算平台，减少延迟并节省带宽',
    category: '物联网',
    price: 499,
    status: 'active',
    subscriptionRequirements: {
      minDuration: 3,
      maxQuantity: 10
    },
    createdAt: '2023-08-25T00:00:00'
  },
  {
    id: 'PROD016',
    name: '数据加密服务',
    description: '高级数据加密服务，保护敏感数据免受未授权访问',
    category: '安全服务',
    price: 349,
    status: 'active',
    subscriptionRequirements: {
      minDuration: 6,
      maxQuantity: 10
    },
    createdAt: '2023-09-10T00:00:00'
  },
  {
    id: 'PROD017',
    name: '自然语言处理API',
    description: '强大的自然语言处理API，支持文本分析、情感分析和语言理解',
    category: '人工智能',
    price: 399,
    status: 'active',
    subscriptionRequirements: {
      minDuration: 1,
      maxQuantity: 8
    },
    createdAt: '2023-09-30T00:00:00'
  },
  {
    id: 'PROD018',
    name: '数据湖存储',
    description: '经济高效的数据湖存储解决方案，适合存储和分析大量非结构化数据',
    category: '大数据',
    price: 749,
    status: 'active',
    subscriptionRequirements: {
      minDuration: 6,
      maxQuantity: 5
    },
    createdAt: '2023-10-15T00:00:00'
  }
];

// 模拟订阅数据
export const mockSubscriptions: Subscription[] = [
  {
    id: 'SUB001',
    userId: '2',
    productId: 'PROD001',
    productName: '云存储基础版',
    startDate: '2023-04-01T00:00:00',
    endDate: '2023-07-01T00:00:00',
    quantity: 2,
    status: 'active'
  },
  {
    id: 'SUB002',
    userId: '2',
    productId: 'PROD003',
    productName: '数据分析基础版',
    startDate: '2023-03-15T00:00:00',
    endDate: '2023-06-15T00:00:00',
    quantity: 1,
    status: 'active'
  },
  {
    id: 'SUB003',
    userId: '2',
    productId: 'PROD005',
    productName: '安全监控服务',
    startDate: '2023-01-01T00:00:00',
    endDate: '2024-01-01T00:00:00',
    quantity: 1,
    status: 'active'
  },
  {
    id: 'SUB004',
    userId: '2',
    productId: 'PROD007',
    productName: '数据可视化平台',
    startDate: '2023-05-10T00:00:00',
    endDate: '2023-08-10T00:00:00',
    quantity: 3,
    status: 'active'
  },
  {
    id: 'SUB005',
    userId: '2',
    productId: 'PROD009',
    productName: 'AI预测分析',
    startDate: '2023-02-15T00:00:00',
    endDate: '2023-08-15T00:00:00',
    quantity: 1,
    status: 'active'
  },
  {
    id: 'SUB006',
    userId: '2',
    productId: 'PROD012',
    productName: '云数据库服务',
    startDate: '2023-06-01T00:00:00',
    endDate: '2023-09-01T00:00:00',
    quantity: 2,
    status: 'active'
  },
  {
    id: 'SUB007',
    userId: '2',
    productId: 'PROD014',
    productName: 'AI图像识别服务',
    startDate: '2023-04-20T00:00:00',
    endDate: '2023-05-20T00:00:00',
    quantity: 1,
    status: 'expired'
  },
  {
    id: 'SUB008',
    userId: '2',
    productId: 'PROD016',
    productName: '数据加密服务',
    startDate: '2023-03-05T00:00:00',
    endDate: '2023-09-05T00:00:00',
    quantity: 1,
    status: 'cancelled'
  }
];

// 模拟数据源数据
export const mockDataSources: DataSource[] = [
  {
    id: 'DS001',
    name: '主数据库',
    type: 'MySQL',
    connectionDetails: {
      host: 'db.example.com',
      port: 3306,
      database: 'main_db',
      username: 'admin',
      ssl: true
    },
    status: 'active',
    createdAt: '2023-01-15T08:30:00Z'
  },
  {
    id: 'DS002',
    name: '分析数据库',
    type: 'PostgreSQL',
    connectionDetails: {
      host: 'analytics.example.com',
      port: 5432,
      database: 'analytics_db',
      username: 'analyst',
      ssl: true
    },
    status: 'active',
    createdAt: '2023-02-20T10:15:00Z'
  },
  {
    id: 'DS003',
    name: '文档存储',
    type: 'MongoDB',
    connectionDetails: {
      host: 'mongo.example.com',
      port: 27017,
      database: 'documents',
      username: 'app_user',
      ssl: false
    },
    status: 'inactive',
    createdAt: '2023-03-10T14:45:00Z'
  },
  {
    id: 'DS004',
    name: '企业数据仓库',
    type: 'Oracle',
    connectionDetails: {
      host: 'oracle.example.com',
      port: 1521,
      database: 'enterprise_dw',
      username: 'dw_admin',
      ssl: true
    },
    status: 'active',
    createdAt: '2023-04-05T09:20:00Z'
  },
  {
    id: 'DS005',
    name: '外部API数据源',
    type: 'API',
    connectionDetails: {
      host: 'api.external-service.com',
      port: 443,
      database: 'api_v2',
      username: 'api_client',
      ssl: true
    },
    status: 'inactive',
    createdAt: '2023-05-12T11:30:00Z'
  },
  {
    id: 'DS006',
    name: '历史数据文件',
    type: 'CSV',
    connectionDetails: {
      host: 'storage.example.com',
      port: 22,
      database: '/data/history',
      username: 'file_reader',
      ssl: false
    },
    status: 'active',
    createdAt: '2023-06-18T16:10:00Z'
  }
];

// 模拟待办事项数据
export const mockTodoItems: TodoItem[] = [
  {
    id: 'TODO001',
    title: '审核新产品上架申请',
    description: '需要审核产品ID为PROD006的上架申请',
    status: 'pending',
    createdAt: '2023-05-01T09:00:00',
    dueDate: '2023-05-03T18:00:00'
  },
  {
    id: 'TODO002',
    title: '处理用户订阅请求',
    description: '用户ID为USER005的订阅请求需要处理',
    status: 'pending',
    createdAt: '2023-05-02T10:30:00',
    dueDate: '2023-05-04T18:00:00'
  },
  {
    id: 'TODO003',
    title: '更新系统安全策略',
    description: '根据最新的安全标准更新系统安全策略',
    status: 'completed',
    createdAt: '2023-04-25T14:00:00',
    dueDate: '2023-04-30T18:00:00'
  },
  {
    id: 'TODO004',
    title: '数据中心设备维护',
    description: '对北京数据中心的服务器进行例行维护',
    status: 'pending',
    createdAt: '2023-05-05T08:30:00',
    dueDate: '2023-05-10T18:00:00'
  },
  {
    id: 'TODO005',
    title: '客户满意度调查分析',
    description: '分析最近一个季度的客户满意度调查结果',
    status: 'pending',
    createdAt: '2023-05-06T11:00:00',
    dueDate: '2023-05-12T18:00:00'
  },
  {
    id: 'TODO006',
    title: '新功能发布准备',
    description: '准备下周发布的新功能上线事宜',
    status: 'pending',
    createdAt: '2023-05-07T09:15:00',
    dueDate: '2023-05-14T18:00:00'
  },
  {
    id: 'TODO007',
    title: '数据备份检查',
    description: '检查所有数据库的备份状态',
    status: 'completed',
    createdAt: '2023-04-28T13:45:00',
    dueDate: '2023-05-01T18:00:00'
  },
  {
    id: 'TODO008',
    title: '员工培训计划',
    description: '制定下个月的员工技术培训计划',
    status: 'pending',
    createdAt: '2023-05-08T10:00:00',
    dueDate: '2023-05-15T18:00:00'
  }
]; 