import { UserRole } from '../context/UserContext';

// 定义路由类型
export interface AppRoute {
  path: string;
  label: string;
  name?: string;
  roles: UserRole[];
  showInMenu?: boolean;
  parentMenu?: string; // 添加父级菜单标识
}

// 定义登录路由（单独处理，不在侧边栏显示）
export const loginRoute: AppRoute = {
  path: '/login',
  label: '登录',
  name: '登录',
  roles: ['admin', 'user'],
  showInMenu: false
};

// 定义公共路由
export const publicRoutes: AppRoute[] = [
  {
    path: '/home',
    label: '首页',
    name: '首页',
    roles: ['admin', 'user'],
    showInMenu: true
  }
];

// 定义管理员路由
export const adminRoutes: AppRoute[] = [
  {
    path: '/admin/devices',
    label: '设备管理',
    name: '系统管理',
    roles: ['admin'],
    showInMenu: true
  },
  {
    path: '/admin/products',
    label: '产品管理',
    name: '产品管理',
    roles: ['admin'],
    showInMenu: false
  }
];

// 定义用户路由
export const userRoutes: AppRoute[] = [
  {
    path: '/user/catalog',
    label: '产品目录',
    name: '产品目录',
    roles: ['user', 'admin'],
    showInMenu: true
  },
  {
    path: '/user/subscriptions',
    label: '订阅管理',
    name: '订阅管理',
    roles: ['user'],
    showInMenu: true,
    parentMenu: 'delivery' // 属于交付中心
  },
  {
    path: '/user/subscription-history',
    label: '历史订阅',
    name: '历史订阅',
    roles: ['user'],
    showInMenu: true,
    parentMenu: 'delivery' // 属于交付中心
  },
  {
    path: '/user/devices',
    label: '设备管理',
    name: '设备管理',
    roles: ['user'],
    showInMenu: true,
    parentMenu: 'devices' // 属于设备中心
  },
  {
    path: '/user/favorites',
    label: '我的收藏',
    name: '我的收藏',
    roles: ['user'],
    showInMenu: true,
    parentMenu: 'devices' // 属于设备中心
  },
  {
    path: '/user/datasources',
    label: '数据源管理',
    name: '数据源管理',
    roles: ['user'],
    showInMenu: true,
    parentMenu: 'data' // 属于数据中心
  },
  {
    path: '/user/dataproducts',
    label: '数据产品管理',
    name: '数据产品管理',
    roles: ['user'],
    showInMenu: true,
    parentMenu: 'data' // 属于数据中心
  },
  {
    path: '/user/profile',
    label: '个人资料',
    name: '个人资料',
    roles: ['user', 'admin'],
    showInMenu: true
  }
];

// 合并所有路由
export const allRoutes: AppRoute[] = [...publicRoutes, ...adminRoutes, ...userRoutes];

// 根据用户角色获取可访问的路由
export const getAccessibleRoutes = (role: UserRole | null): AppRoute[] => {
  if (!role) {
    return publicRoutes;
  }
  
  return allRoutes.filter(route => route.roles.includes(role));
};

// 获取父级菜单
export const getParentMenus = (role: UserRole | null): string[] => {
  if (!role) {
    return [];
  }
  
  const routes = allRoutes.filter(route => route.roles.includes(role) && route.parentMenu);
  const parentMenus = Array.from(new Set(routes.map(route => route.parentMenu as string)));
  return parentMenus;
}; 