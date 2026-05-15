import { prisma } from "@/lib/prisma";
import VerifyButton from "@/components/VerifyButton";
import { authOptions } from "@/auth/options";
import { getServerSession } from "next-auth";

export default async function DronePage({
                                            params,
                                        }: {
    params: Promise<{ id: string }>;
}) {

    const { id } = await params;

    const drone = await prisma.drone.findUnique({
        where: {
            id,
        },
        include: {
            workshop: true,
            batch: true,
            type: true,
        },
    });

    // noinspection TypeScriptValidateTypes
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role == "ADMIN";

    if (!drone) {
        return <div>Drone not found</div>;
    }

    return (
        <div style={{ padding: 40 }}>
            <h1>{drone.id}</h1>

            <p>
                <strong>ID:</strong> {drone.id}
            </p>

            <p>
                <strong>Status:</strong> {drone.status}
            </p>

            <p>
                <strong>QR:</strong> {drone.qrCode}
            </p>

            <p>
                <strong>Type:</strong> {drone.type?.name}
            </p>
            {isAdmin && (
                <div>
                    <p>
                        <strong>Workshop:</strong> {drone.workshop?.name}
                    </p>

                    <p>
                        <strong>Batch:</strong> {drone.batch?.name}
                    </p>

                    <p>
                        <strong>Created:</strong>{" "}
                        {new Date(drone.createdAt).toLocaleString()}
                    </p>

                    {drone.status === "GENERATED" && (
                        <VerifyButton droneId={drone.id} />
                    )}
                </div>
            )}
        </div>
    );
}