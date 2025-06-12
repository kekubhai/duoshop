import { PrismaClient } from "@/app/generated/prisma";
import { Return } from "@/app/generated/prisma/runtime/library";
const prismaClientSingleton =  ()=> 
{
    return new PrismaClient()
}
declare const globalThis:{
    prismaGlobal:ReturnType<typeof prismaClientSingleton>

}& typeof global;
const prisma=globalThis.prismaGlobal?? prismaClientSingleton()

export default prismaClientSingleton

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;