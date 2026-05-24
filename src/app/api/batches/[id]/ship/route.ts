import { prisma } from "@/lib/prisma";

export async function POST(
    req: Request,
    context: {
        params: Promise<{ id: string }>;
    }
) {

    const { id } = await context.params;
    const batch = await prisma.batch.findUnique({
        where: { id: id },
        include: { drones: true },
    });

    if (!batch) {
        return Response.json({ error: "Not found" }, { status: 404 });
    }

    if (!batch.destination) {
        return Response.json(
            { error: "Destination required" },
            { status: 400 }
        );
    }

    await prisma.batch.update({
        where: { id: id },
        data: { status: "SHIPPED" },
    });

    await prisma.drone.updateMany({
        where: { batchId: id },
        data: { status: "SHIPPED" },
    });

    return Response.json({ ok: true });
}