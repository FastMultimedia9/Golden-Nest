import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    userRole: 'user',
    loading: true
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔍 Checking authentication status...');
        const user = await authAPI.getCurrentUserWithProfile();
        
        if (user) {
          const role = user.profile?.role || 'user';
          console.log(`✅ User authenticated: ${user.email} (Role: ${role})`);
          
          setAuthState({
            isAuthenticated: true,
            user: user,
            userRole: role,
            loading: false
          });
        } else {
          console.log('❌ No authenticated user found');
          setAuthState({
            isAuthenticated: false,
            user: null,
            userRole: 'user',
            loading: false
          });
        }
      } catch (error) {
        console.error('❌ Auth check error:', error);
        setAuthState({
          isAuthenticated: false,
          user: null,
          userRole: 'user',
          loading: false
        });
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const result = await authAPI.adminLogin(email, password);
      if (result.success) {
        const user = await authAPI.getCurrentUserWithProfile();
        const role = user?.profile?.role || 'user';
        
        setAuthState({
          isAuthenticated: true,
          user: user,
          userRole: role,
          loading: false
        });
      }
      return result;
    } catch (error) {
      console.error('❌ Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      const result = await authAPI.logout();
      if (result) {
        setAuthState({
          isAuthenticated: false,
          user: null,
          userRole: 'user',
          loading: false
        });
      }
      return result;
    } catch (error) {
      console.error('❌ Logout error:', error);
      return false;
    }
  };

  const value = {
    ...authState,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};