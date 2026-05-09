import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const body = await req.json();

    const { droneIds, name } = body;

    if (!droneIds || droneIds.length === 0) {
        return Response.json(
            { error: "No drones provided" },
            { status: 400 }
        );
    }

    if (!name) {
        return Response.json(
            { error: "Batch name is required" },
            { status: 400 }
        );
    }

    const drones = await prisma.drone.findMany({
        where: {
            id: {
                in: droneIds,
            },
        },
    });

    const invalidDrones = drones.filter(
        (drone) =>
            drone.status !== "TESTED" ||
            drone.batchId !== null
    );

    if (invalidDrones.length > 0) {
        return Response.json(
            {
                error: "Some drones are not TESTED",
                invalidDrones: invalidDrones.map((x) => ({
                    id: x.id,
                    status: x.status,
                })),
            },
            { status: 400 }
        );
    }

    const batch = await prisma.batch.create({
        data: {
            name,
            status: "CREATED",
        },
    });

    await prisma.drone.updateMany({
        where: {
            id: {
                in: droneIds,
            },
        },
        data: {
            status: "PACKED",
            batchId: batch.id,
        },
    });

    return Response.json(batch);
}