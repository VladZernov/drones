import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
    const droneTypes = [
        'FPV_7',
        'FPV_10',
        'FPV_14',
    ]

    for (const name of droneTypes) {

        await prisma.droneType.upsert({
            where: { name },
            update: {},
            create: { name },
        })
    }

    const hashedPassword =
        await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)

    await prisma.user.upsert({
        where: {
            email: 'admin@test.com',
        },
        update: {},
        create: {
            email: 'admin@test.com',
            password: hashedPassword,
            role: 'ADMIN',
        },
    })
}
main()
