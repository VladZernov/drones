
import { prisma } from "@/lib/prisma"
import { get } from '@vercel/blob';
import { NextResponse } from "next/server"

export async function GET(
    req: Request,
    context: {
        params: Promise<{ id: string }>
    }
) {
    const { id } = await context.params

    const attachment =
        await prisma.batchAttachment.findUnique({
            where: { id },
        })

    if (!attachment) {
        return Response.json(
            { error: "Not found" },
            { status: 404 }
        )
    }

    const result = await get(attachment.url, { access: 'private' });

    if (result?.statusCode !== 200) {
        return new Response('Not found', { status: 404 });
    }

    return new NextResponse(result.stream, {
        headers: {
            'Content-Type': result.blob.contentType,
            'X-Content-Type-Options': 'nosniff',
        },
    });
}