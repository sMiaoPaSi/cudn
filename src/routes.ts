import { lazy } from 'react';

// 懒加载组件
const LoginPage = lazy(() => import('./pages/LoginPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const DeviceManagementPage = lazy(() => import('./pages/admin/DeviceManagementPage'));
const ProductManagementPage = lazy(() => import('./pages/admin/ProductManagementPage'));
const ProductCatalogPage = lazy(() => import('./pages/user/ProductCatalogPage'));
const SubscriptionManagementPage = lazy(() => import('./pages/user/SubscriptionManagementPage'));
const SubscriptionHistoryPage = lazy(() => import('./pages/user/SubscriptionHistoryPage'));
const DataSourcesPage = lazy(() => import('./pages/user/DataSourcesPage'));
const DataProductsPage = lazy(() => import('./pages/user/DataProductsPage'));
const FavoritesPage = lazy(() => import('./pages/user/FavoritesPage'));
const UserProfilePage = lazy(() => import('./pages/user/UserProfilePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// 路由配置
export const routes = [
  {
    path: '/login',
    component: LoginPage,
    exact: true,
    requireAuth: false,
    roles: []
  },
  {
    path: '/',
    component: HomePage,
    exact: true,
    requireAuth: true,
    roles: ['admin', 'user']
  },
  {
    path: '/home',
    component: HomePage,
    exact: true,
    requireAuth: true,
    roles: ['admin', 'user']
  },
  // 管理员路由
  {
    path: '/admin/devices',
    component: DeviceManagementPage,
    exact: true,
    requireAuth: true,
    roles: ['admin']
  },
  {
    path: '/admin/products',
    component: ProductManagementPage,
    exact: true,
    requireAuth: true,
    roles: ['admin']
  },
  // 用户路由
  {
    path: '/user/catalog',
    component: ProductCatalogPage,
    exact: true,
    requireAuth: true,
    roles: ['user']
  },
  {
    path: '/user/subscriptions',
    component: SubscriptionManagementPage,
    exact: true,
    requireAuth: true,
    roles: ['user']
  },
  {
    path: '/user/subscription-history',
    component: SubscriptionHistoryPage,
    exact: true,
    requireAuth: true,
    roles: ['user']
  },
  {
    path: '/user/data-sources',
    component: DataSourcesPage,
    exact: true,
    requireAuth: true,
    roles: ['user']
  },
  {
    path: '/user/data-products',
    component: DataProductsPage,
    exact: true,
    requireAuth: true,
    roles: ['user']
  },
  {
    path: '/user/favorites',
    component: FavoritesPage,
    exact: true,
    requireAuth: true,
    roles: ['user']
  },
  {
    path: '/user/profile',
    component: UserProfilePage,
    exact: true,
    requireAuth: true,
    roles: ['user', 'admin']
  },
  // 404页面
  {
    path: '*',
    component: NotFoundPage,
    exact: false,
    requireAuth: false,
    roles: []
  }
];

export default routes; 