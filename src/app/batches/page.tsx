import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function BatchesPage() {
    const batches = await prisma.batch.findMany({
        include: {
            drones: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div style={{ padding: 40 }}>
            <h1>Batches</h1>

            {batches.length === 0 && (
                <p>No batches created</p>
            )}

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                }}
            >
                {batches.map((batch) => (
                    <div
                        key={batch.id}
                        style={{
                            border: "1px solid #ccc",
                            borderRadius: 8,
                            padding: 20,
                        }}
                    >
                        <h2>
                            Batch {batch.id}
                        </h2>

                        <p>
                            <strong>Status:</strong>{" "}
                            {batch.status}
                        </p>

                        <p>
                            <strong>Drones:</strong>{" "}
                            {batch.drones.length}
                        </p>

                        <p>
                            <strong>Created:</strong>{" "}
                            {new Date(
                                batch.createdAt
                            ).toLocaleString()}
                        </p>

                        <div
                            style={{
                                marginTop: 10,
                            }}
                        >
                            <strong>Drone list:</strong>

                            <ul>
                                {batch.drones.map((drone) => (
                                    <li key={drone.id}>
                                        <Link
                                            href={`/drone/${drone.id}`}
                                        >
                                            {drone.id}
                                        </Link>{" "}
                                        — {drone.status}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}