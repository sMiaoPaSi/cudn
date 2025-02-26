import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// 定义用户类型
export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  email?: string;
  phone?: string;
  company?: string;
  department?: string;
  position?: string;
  joinDate?: string;
  avatar?: string; // 用户头像URL
  bio?: string;    // 用户个人简介
}

// 定义上下文类型
interface UserContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserInfo: (userInfo: Partial<User>) => void;
  isAuthenticated: boolean;
}

// 创建上下文
const UserContext = createContext<UserContextType | undefined>(undefined);

// 本地存储键名
const USER_STORAGE_KEY = 'unicom_user_data';
const USER_CUSTOM_DATA_KEY = 'unicom_user_custom_data';

// 创建上下文提供者组件
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // 从本地存储中获取用户信息
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // 当用户状态变化时，更新本地存储
  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  // 模拟登录功能
  const login = async (username: string, password: string): Promise<boolean> => {
    // 在实际应用中，这里应该调用API进行身份验证
    // 这里仅作为示例，使用硬编码的用户信息
    let userData: User | null = null;
    
    if (username === 'admin' && password === 'admin123') {
      userData = {
        id: '1',
        username: 'admin',
        role: 'admin',
        email: 'admin@unicom.com',
        phone: '138****1234',
        company: '联通数智科技有限公司',
        department: '管理部门',
        position: '系统管理员',
        joinDate: '2020-01-01',
        avatar: '',
        bio: '系统管理员，负责平台的整体管理和维护。'
      };
    } else if (username === 'user' && password === 'user123') {
      userData = {
        id: '2',
        username: 'user',
        role: 'user',
        email: 'user@unicom.com',
        phone: '138****5678',
        company: '联通数智科技有限公司',
        department: '研发部门',
        position: '高级开发工程师',
        joinDate: '2021-06-15',
        avatar: '',
        bio: '高级开发工程师，专注于数据分析和可视化领域。'
      };
    }
    
    if (userData) {
      // 检查是否有自定义数据需要合并
      const customDataKey = `${USER_CUSTOM_DATA_KEY}_${userData.id}`;
      const storedCustomData = localStorage.getItem(customDataKey);
      
      if (storedCustomData) {
        // 合并存储的自定义数据
        const customData = JSON.parse(storedCustomData);
        userData = { ...userData, ...customData };
      }
      
      setUser(userData);
      return true;
    }
    
    return false;
  };

  // 登出功能
  const logout = () => {
    setUser(null);
    // 注意：我们不删除自定义数据，这样用户再次登录时可以恢复
  };

  // 更新用户信息
  const updateUserInfo = (userInfo: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userInfo };
      setUser(updatedUser);
      
      // 保存自定义数据到特定的存储键
      const customDataKey = `${USER_CUSTOM_DATA_KEY}_${user.id}`;
      localStorage.setItem(customDataKey, JSON.stringify(userInfo));
    }
  };

  const value = {
    user,
    login,
    logout,
    updateUserInfo,
    isAuthenticated: !!user
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// 创建自定义钩子以便于使用上下文
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 