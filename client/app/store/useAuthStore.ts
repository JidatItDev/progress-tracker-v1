import { create } from "zustand";

type PermissionMap = {
  [key: string]: {
    view?: boolean;
    create?: boolean;
    update?: boolean;
    delete?: boolean;
  };
};

type User = {
  id: string;
  name: string;
  role: "admin" | "client" | "user";
  permissions: PermissionMap;
};

type AuthState = {
  user: User | null;
  token: string | null;
  setAuth: (data: { user: User; token: string }) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setAuth: ({ user, token }) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
}));
