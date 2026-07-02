import { prisma } from "@/lib/prisma";
import VerifyButton from "@/components/VerifyButton";
import { authOptions } from "@/auth/options";
import { getServerSession } from "next-auth";
import SpecificationEditor from "@/components/SpecificationEditor";
import Link from "next/link";

export default async function DronePage({
                                            params,
                                        }: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const drone = await prisma.drone.findUnique({
        where: { id },
        include: {
            workshop: true,
            batch: true,
            type: true,
            specification: true,
        },
    });

    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role == "ADMIN";

    const spec = drone?.specification;

    if (!drone) {
        return <div>Drone not found</div>;
    }

    return (
        <div style={{ padding: 40 }}>
            <h1>{drone.id}</h1>

            <p><strong>ID:</strong> {drone.id}</p>
            <p><strong>Status:</strong> {drone.status}</p>
            <p><strong>QR:</strong> {drone.qrCode}</p>
            <p><strong>Type:</strong> {drone.type?.name}</p>

            {/* ========================= */}
            {/* ADMIN INFO */}
            {/* ========================= */}
            {isAdmin && (
                <div>
                    <p>
                        <strong>Workshop:</strong>{" "}
                        {drone.workshop?.name}
                    </p>

                    <p>
                        <strong>Batch:</strong>{" "}
                        {drone.batch ? (
                            <Link
                                href={`/batches#${drone.batch.id}`}
                                style={{
                                    color: "blue",
                                    textDecoration: "underline",
                                    marginLeft: 6,
                                }}
                            >
                                {drone.batch.name}
                            </Link>
                        ) : (
                            "-"
                        )}
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

            {/* ========================= */}
            {/* ADMIN EDITOR */}
            {/* ========================= */}
            {isAdmin ? (
                <details
                    style={{
                        marginTop: 20,
                        border: "1px solid #ccc",
                        borderRadius: 8,
                    }}
                >
                    <summary
                        style={{
                            cursor: "pointer",
                            padding: 12,
                            fontWeight: 600,
                            background: "#f5f5f5",
                        }}
                    >
                        Specification (Edit)
                    </summary>

                    <div style={{ padding: 12 }}>
                        <SpecificationEditor
                            droneId={drone.id}
                            specification={spec}
                        />
                    </div>
                </details>
            ) : (
                /* ========================= */
                /* PUBLIC VIEW (FOLDABLE) */
                /* ========================= */
                <details
                    style={{
                        marginTop: 20,
                        border: "1px solid #ccc",
                        borderRadius: 8,
                    }}
                >
                    <summary
                        style={{
                            cursor: "pointer",
                            padding: 12,
                            fontWeight: 600,
                            background: "#f5f5f5",
                        }}
                    >
                        Specification
                    </summary>

                    <div style={{ padding: 12 }}>
                        <p>
                            <strong>Name:</strong>{" "}
                            {spec?.name ?? "-"}
                        </p>
                        <p>
                            <strong>Comment:</strong>{" "}
                            {spec?.comment ?? "-"}
                        </p>
                        <p>
                            <strong>Frame:</strong>{" "}
                            {spec?.frame ?? "-"}
                        </p>
                        <p>
                            <strong>Flight Controller:</strong>{" "}
                            {spec?.flightController ?? "-"}
                        </p>
                        <p>
                            <strong>ESC:</strong>{" "}
                            {spec?.esc ?? "-"}
                        </p>
                        <p>
                            <strong>Motors:</strong>{" "}
                            {spec?.motors ?? "-"}
                        </p>
                        <p>
                            <strong>Radio TX:</strong>{" "}
                            {spec?.radioTx ?? "-"}
                        </p>
                        <p>
                            <strong>Video TX:</strong>{" "}
                            {spec?.videoTx ?? "-"}
                        </p>
                        <p>
                            <strong>GPS:</strong>{" "}
                            {spec?.gps ?? "-"}
                        </p>
                        <p>
                            <strong>Optical Flow:</strong>{" "}
                            {spec?.opticalFlow ?? "-"}
                        </p>
                        <p>
                            <strong>Propellers:</strong>{" "}
                            {spec?.propellers ?? "-"}
                        </p>
                        <p>
                            <strong>Camera:</strong>{" "}
                            {spec?.camera ?? "-"}
                        </p>
                    </div>
                </details>
            )}
        </div>
    );
}