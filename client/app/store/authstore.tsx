// src/store/authStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Type definitions
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  permissions?: {
    [resource: string]: {
      view?: boolean;
      create?: boolean;
      update?: boolean;
      delete?: boolean;
    };
  };
}

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  
  // Actions
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  
  // Permission checkers
  isAdmin: () => boolean;
  hasPermission: (resource: string, action: 'view' | 'create' | 'update' | 'delete') => boolean;
  canViewPage: (permission: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,

      // Set authentication data (called after login)
      setAuth: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      // Clear authentication (called on logout)
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        // Clear localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      },

      // Check if user is admin
      isAdmin: () => {
        const { user } = get();
        return user?.role === 'admin';
      },

      // Check specific permission for a resource and action
      hasPermission: (resource, action) => {
        const { user, isAdmin } = get();
        
        // Admins have all permissions
        if (isAdmin()) return true;
        
        // Check if user has the specific permission
        return Boolean(user?.permissions?.[resource]?.[action]);
      },

      // Check if user can view a specific page (used for sidebar filtering)
      canViewPage: (permission) => {
        const { user, isAdmin } = get();
        
        // Admin can view all pages
        if (isAdmin()) return true;
        
        // No permission string means page is public
        if (!permission) return true;
        
        // Parse permission string (e.g., "projects.view")
        const [resource, action] = permission.split('.');
        return Boolean(
          user?.permissions?.[resource]?.[action as 'view' | 'create' | 'update' | 'delete']
        );
      },
    }),
    {
      name: 'auth-storage', // localStorage key
      // Only persist user and token, not computed values
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);