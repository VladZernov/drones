import { put } from '@vercel/blob'
import { prisma } from '@/lib/prisma'

export async function POST(
    req: Request,
    context: {
        params: Promise<{ id: string }>
    }
) {
    try {
        const { id: batchId } =
            await context.params

        if (!batchId) {
            return Response.json(
                {
                    error: 'Missing batch id',
                },
                {
                    status: 400,
                }
            )
        }

        const formData = await req.formData()

        const file = formData.get(
            'file'
        ) as File | null

        if (!file) {
            return Response.json(
                {
                    error: 'File required',
                },
                {
                    status: 400,
                }
            )
        }

        const blob = await put(
            `batches/${batchId}/${Date.now()}-${file.name}`,
            file,
            {
                access: 'private',
            }
        )

        const attachment =
            await prisma.batchAttachment.create({
                data: {
                    batchId,
                    url: blob.url,
                    fileName: file.name,
                    mimeType: file.type,
                },
            })

        return Response.json(attachment)
    } catch (e) {
        console.error(e)

        return Response.json(
            {
                error: 'Upload failed',
            },
            {
                status: 500,
            }
        )
    }
}