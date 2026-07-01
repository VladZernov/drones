import { prisma } from '@/lib/prisma';

export async function PATCH(
    req: Request,
    context: {
        params: Promise<{ id: string }>;
    }
) {
    const { id } = await context.params;
    const body = await req.json();

    const type = await prisma.droneType.update({
        where: { id },
        data: {
            name: body.name,
        },
    });

    return Response.json(type);
}

export async function DELETE(
    req: Request,
    context: {
        params: Promise<{ id: string }>;
    }
) {
    const { id } = await context.params;

    const count = await prisma.drone.count({
        where: {
            typeId: id,
        },
    });

    if (count > 0) {
        return Response.json(
            {
                error: 'Cannot delete type with existing drones.',
            },
            {
                status: 400,
            }
        );
    }

    await prisma.droneType.delete({
        where: { id },
    });

    return Response.json({ success: true });
}