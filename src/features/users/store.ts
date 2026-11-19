import { prisma } from "../../lib/prisma.js";

// User data access: Prisma effects only.
export const userStore = {
  findById: (id: string) =>
    prisma.user.findUnique({ where: { id } }),
};
