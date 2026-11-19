import { userStore } from "./store.js";

// User business logic: decide, no effects. Calls store for persistence.
export const userService = {
  getProfile: async (userId: string) => {
    const user = await userStore.findById(userId);
    if (!user) return null;
    const { password, ...profile } = user;
    return profile;
  },
};
