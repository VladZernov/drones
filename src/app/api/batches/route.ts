import { prisma } from "@/lib/prisma";

export async function GET() {
    const batches = await prisma.batch.findMany({
        include: {
            drones: {
                include: {
                    workshop: true,
                },
            },
            attachments: true,
        },
        orderBy: { createdAt: "desc" },
    });

    return Response.json(batches);
}