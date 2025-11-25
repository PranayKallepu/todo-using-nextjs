// Whenever you need database access, you can simply:
// This avoids:
//  Creating multiple Prisma clients
//  Errors like "Prisma client is already running"
//  Connection leaks
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
