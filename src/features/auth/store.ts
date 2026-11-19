import { prisma } from "../../lib/prisma.js";

// Auth data access: Prisma effects only.
export const authStore = {
  findUserByEmail: (email: string) =>
    prisma.user.findUnique({ where: { email } }),

  createUser: (data: { email: string; password: string; name: string }) =>
    prisma.user.create({ data }),
};
