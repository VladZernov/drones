import { prisma } from "@/lib/prisma";

async function main() {
    await prisma.droneType.createMany({
        data: [
            {
                name: 'TYPE1',
            },
            {
                name: 'TYPE2',
            },
        ],
    })
}
main()
