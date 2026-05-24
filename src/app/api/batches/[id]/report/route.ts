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
        include: { attachments: true },
    });

    if (!batch) {
        return Response.json({ error: "Not found" }, { status: 404 });
    }

    if (batch.attachments.length === 0) {
        return Response.json(
            { error: "Attachment required" },
            { status: 400 }
        );
    }

    await prisma.batch.update({
        where: { id: id },
        data: { status: "REPORTED" },
    });

    await prisma.drone.updateMany({
        where: { batchId: id },
        data: { status: "REPORTED" },
    });

    return Response.json({ ok: true });
}