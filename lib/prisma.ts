import { PrismaClient } from "@prisma/client";

const globalForPrimsa = global as unknown as {prisma: PrismaClient}

export const prisma = globalForPrimsa.prisma || new PrismaClient();

export default prisma