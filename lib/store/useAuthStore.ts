// stores/authStore.js
import { create } from "zustand";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface User {
  token: string;
  role: string;
}

interface AuthStore {
  user: User | null;
  initialize: () => void;
  login: (token: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  initialize: () => {
    const token = Cookies.get("token");
    if (token) {
      const decoded = jwtDecode(token) as { role: string };
      if (decoded) {
        set({ user: { token, role: decoded.role } });
      }
    }
  },
  login: (token: string) => {
    const decoded = jwtDecode(token) as { role: string };
    if (decoded) {
      Cookies.set("token", token);
      set({ user: { token, role: decoded.role } });
    }
  },
  logout: () => {
    Cookies.remove("token");
    set({ user: null });
  },
}));

export default useAuthStore;
