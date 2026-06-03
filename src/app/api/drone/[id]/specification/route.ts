import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth/options";

export async function PATCH(
    req: Request,
    context: {
        params: Promise<{ id: string }>
    }
) {
    try {
        // noinspection TypeScriptValidateTypes
        const session = await getServerSession(authOptions)

        if (session?.user.role !== "ADMIN") {
            return new Response("Forbidden", { status: 403 });
        }

        const { id } = await context.params

        const body = await req.json()

        const specification =
            await prisma.droneSpecification.upsert({
                where: {
                    droneId: id,
                },
                update: {
                    frame: body.frame,
                    flightController:
                    body.flightController,
                    esc: body.esc,
                    motors: body.motors,
                    radioTx: body.radioTx,
                    videoTx: body.videoTx,
                    gps: body.gps,
                    opticalFlow:
                    body.opticalFlow,
                    propellers:
                    body.propellers,
                    camera: body.camera,
                },
                create: {
                    droneId: id,

                    frame: body.frame,
                    flightController:
                    body.flightController,
                    esc: body.esc,
                    motors: body.motors,
                    radioTx: body.radioTx,
                    videoTx: body.videoTx,
                    gps: body.gps,
                    opticalFlow:
                    body.opticalFlow,
                    propellers:
                    body.propellers,
                    camera: body.camera,
                },
            })

        return Response.json(specification)
    } catch (e) {
        console.error(e)

        return Response.json(
            {
                error:
                    'Failed to save specification',
            },
            {
                status: 500,
            }
        )
    }
}