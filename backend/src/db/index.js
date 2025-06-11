//const { PrismaClient } = require('../generated/prisma.js');
import { PrismaClient } from '../generated/prisma/index.js';
//import { withAccelerate } from '@prisma/extension-accelerate';

const prismaClientSingleton = () => {
  return new PrismaClient() 
};

// In JavaScript we don't need type declarations
// globalThis.prisma will be undefined or the return value of prismaClientSingleton

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;