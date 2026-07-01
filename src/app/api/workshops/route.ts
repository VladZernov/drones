import { prisma } from '@/lib/prisma'

export async function GET() {
    const workshops = await prisma.workshop.findMany({
        include: {
            drones: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    })

    return Response.json(workshops)
}