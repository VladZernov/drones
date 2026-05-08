import { prisma } from "@/lib/prisma";

export async function GET(
    req: Request,
    context: {
        params: Promise<{ id: string }>;
    }
) {
    const { id } = await context.params;

    const drone = await prisma.drone.findUnique({
        where: {
            id,
        },
    });

    if (!drone) {
        return Response.json(
            {
                error: "Drone not found",
            },
            {
                status: 404,
            }
        );
    }

    return Response.json(drone);
}