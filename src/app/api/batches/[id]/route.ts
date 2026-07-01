// /app/api/batches/[id]/route.ts

import { prisma } from "@/lib/prisma";

export async function PATCH(
    req: Request,
    context: {
        params: Promise<{ id: string }>;
    }
) {
    try {
        const { id } = await context.params;

        if (!id) {
            return Response.json(
                {
                    error: "Missing batch id",
                },
                {
                    status: 400,
                }
            );
        }

        const body = await req.json();

        const { destination } = body;

        const batch = await prisma.batch.findUnique({
            where: {
                id,
            },
        });

        if (!batch) {
            return Response.json(
                {
                    error: "Batch not found",
                },
                {
                    status: 404,
                }
            );
        }

        const updatedBatch =
            await prisma.batch.update({
                where: {
                    id,
                },
                data: {
                    destination,
                },
            });

        return Response.json(updatedBatch);
    } catch (e) {
        console.error(e);

        return Response.json(
            {
                error: "Failed to update batch",
            },
            {
                status: 500,
            }
        );
    }
}

export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params

    const batch = await prisma.batch.findUnique({
        where: { id },
        include: { drones: true },
    })

    if (!batch) {
        return Response.json(
            { error: 'Batch not found' },
            { status: 404 }
        )
    }

    if (batch.status === 'REPORTED') {
        return Response.json(
            {
                error: 'Cannot delete a reported batch',
            },
            { status: 400 }
        )
    }

    // 1. reset drones
    await prisma.drone.updateMany({
        where: { batchId: id },
        data: {
            batchId: null,
            status: 'TESTED',
        },
    })

    // 2. delete batch
    await prisma.batch.delete({
        where: { id },
    })

    return Response.json({ success: true })
}