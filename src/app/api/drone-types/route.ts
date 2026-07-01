import { prisma } from '@/lib/prisma';

export async function GET() {
    const types = await prisma.droneType.findMany({
        include: {
            _count: {
                select: {
                    drones: true,
                },
            },
        },
        orderBy: {
            name: 'asc',
        },
    });

    return Response.json(types);
}

export async function POST(req: Request) {
    const body = await req.json();

    if (!body.name?.trim()) {
        return Response.json(
            { error: 'Name is required' },
            { status: 400 }
        );
    }

    const type = await prisma.droneType.create({
        data: {
            name: body.name.trim(),
        },
    });

    return Response.json(type);
}