import { prisma } from "@/lib/prisma";

export async function GET() {
    const drones = await prisma.drone.findMany({
        orderBy: {
            createdAt: "desc",
        },
        where: {
            status: {
                not: 'GENERATED',
            },
        },
    });

    return Response.json(drones);
}