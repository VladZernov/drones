import { prisma } from "@/lib/prisma";

export default async function DronesPage() {
    const drones = await prisma.drone.findMany();

    return (
        <div>
            <h1>All Drones</h1>

            <ul>
                {drones.map((drone) => (
                    <li key={drone.id}>
                        <strong>{drone.id}</strong> — {drone.status}
                    </li>
                ))}
            </ul>
        </div>
    );
}