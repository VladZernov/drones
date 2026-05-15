import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth/options";

export async function POST(
    req: Request,
    context: {
        params: Promise<{ id: string }>;
    }
) {
    // noinspection TypeScriptValidateTypes
    const session = await getServerSession(authOptions)
debugger;
    if (session?.user.role !== "ADMIN") {
        return new Response("Forbidden", { status: 403 });
    }

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

    if (drone.status !== "GENERATED") {
        return Response.json(
            {
                error: "Drone cannot be verified",
            },
            {
                status: 400,
            }
        );
    }

    const updatedDrone = await prisma.drone.update({
        where: {
            id,
        },
        data: {
            status: "TESTED",
        },
    });

    return Response.json(updatedDrone);
}