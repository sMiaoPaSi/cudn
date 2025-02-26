import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import Layout from './components/Layout';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

// 页面组件
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import DeviceManagementPage from './pages/admin/DeviceManagementPage';
import ProductManagementPage from './pages/admin/ProductManagementPage';
import ProductCatalogPage from './pages/user/ProductCatalogPage';
import SubscriptionManagementPage from './pages/user/SubscriptionManagementPage';
import SubscriptionHistoryPage from './pages/user/SubscriptionHistoryPage';
import UserDeviceManagementPage from './pages/user/UserDeviceManagementPage';
import FavoritesPage from './pages/user/FavoritesPage';
import DataSourcesPage from './pages/user/DataSourcesPage';
import DataProductsPage from './pages/user/DataProductsPage';
import UserProfilePage from './pages/user/UserProfilePage';

// 受保护的路由组件
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
}

// 登录路由组件 - 已登录用户将被重定向到首页
interface LoginRouteProps {
  children: React.ReactNode;
}

const LoginRoute: React.FC<LoginRouteProps> = ({ children }) => {
  const { isAuthenticated } = useUser();
  
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }
  
  return <>{children}</>;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useUser();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/home" replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
        <Router>
          <Layout>
            <Routes>
              {/* 登录路由 - 已登录用户不能访问 */}
              <Route path="/login" element={
                <LoginRoute>
                  <LoginPage />
                </LoginRoute>
              } />
              
              {/* 受保护的路由 */}
              <Route path="/home" element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              } />
              
              {/* 管理员路由 */}
              <Route path="/admin/devices" element={
                <ProtectedRoute requiredRole="admin">
                  <DeviceManagementPage />
                </ProtectedRoute>
              } />
              
              <Route path="/admin/products" element={
                <ProtectedRoute requiredRole="admin">
                  <ProductManagementPage />
                </ProtectedRoute>
              } />
              
              {/* 用户路由 */}
              <Route path="/user/catalog" element={
                <ProtectedRoute>
                  <ProductCatalogPage />
                </ProtectedRoute>
              } />
              
              <Route path="/user/subscriptions" element={
                <ProtectedRoute requiredRole="user">
                  <SubscriptionManagementPage />
                </ProtectedRoute>
              } />
              
              <Route path="/user/subscription-history" element={
                <ProtectedRoute requiredRole="user">
                  <SubscriptionHistoryPage />
                </ProtectedRoute>
              } />
              
              <Route path="/user/devices" element={
                <ProtectedRoute requiredRole="user">
                  <UserDeviceManagementPage />
                </ProtectedRoute>
              } />
              
              <Route path="/user/favorites" element={
                <ProtectedRoute requiredRole="user">
                  <FavoritesPage />
                </ProtectedRoute>
              } />
              
              <Route path="/user/datasources" element={
                <ProtectedRoute requiredRole="user">
                  <DataSourcesPage />
                </ProtectedRoute>
              } />
              
              <Route path="/user/dataproducts" element={
                <ProtectedRoute requiredRole="user">
                  <DataProductsPage />
                </ProtectedRoute>
              } />
              
              <Route path="/user/profile" element={
                <ProtectedRoute>
                  <UserProfilePage />
                </ProtectedRoute>
              } />
              
              {/* 默认路由 */}
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </Layout>
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;
