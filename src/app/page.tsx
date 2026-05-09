import Link from "next/link";

export default function HomePage() {
    return (
        <div
            style={{
                padding: 40,
                display: "flex",
                flexDirection: "column",
                gap: 20,
            }}
        >
            <h1>Drones Tracker</h1>

            <Link href="/drone/scan">
                <button
                    style={{
                        padding: "12px 20px",
                        cursor: "pointer",
                    }}
                >
                    Scan
                </button>
            </Link>

            <Link href="/batches/create">
                <button
                    style={{
                        padding: "12px 20px",
                        cursor: "pointer",
                    }}
                >
                    Create Batch
                </button>
            </Link>

            <Link href="/batches">
                <button
                    style={{
                        padding: "12px 20px",
                        cursor: "pointer",
                    }}
                >
                    Batches
                </button>
            </Link>

            <Link href="/drones">
                <button
                    style={{
                        padding: "12px 20px",
                        cursor: "pointer",
                    }}
                >
                    Drones List
                </button>
            </Link>

            <Link href="/workshops/create">
                <button
                    style={{
                        padding: "12px 20px",
                        cursor: "pointer",
                    }}
                >
                    Create Workshop
                </button>
            </Link>
        </div>
    );
}