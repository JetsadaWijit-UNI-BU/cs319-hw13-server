import { authStore } from "./store.js";

// Auth business logic: decide, no effects. Calls store for persistence.
export const authService = {
  login: async (email: string, password: string) => {
    const user = await authStore.findUserByEmail(email);
    if (!user || user.password !== password) return null;
    return { id: user.id, userId: user.id, email: user.email, name: user.name };
  },

  register: async (data: { email: string; password: string; name: string }) => {
    const existing = await authStore.findUserByEmail(data.email);
    if (existing) return null;
    const user = await authStore.createUser(data);
    return { id: user.id, userId: user.id, email: user.email, name: user.name };
  },
};
