import { prisma } from '@/lib/prisma'
export async function GET() {
    const types = await prisma.droneType.findMany()
    return Response.json(types)
}
