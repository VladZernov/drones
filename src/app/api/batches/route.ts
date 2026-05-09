import { prisma } from "@/lib/prisma";

export async function GET() {
    const batches = await prisma.batch.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            drones: true,
        },
    });

    return Response.json(batches);
}