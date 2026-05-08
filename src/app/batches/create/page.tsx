'use client'

import { Html5QrcodeScanner } from 'html5-qrcode'
import { useEffect, useState } from 'react'

type Drone = {
    id: string
    status: string
}

export default function CreateBatchPage() {
    const [drones, setDrones] = useState<Drone[]>([])
    const [loading, setLoading] = useState(false)

    const [error, setError] = useState('')

    function removeDrone(id: string) {
        setDrones((prev) =>
            prev.filter((x) => x.id !== id)
        )
    }

    const hasInvalidDrones = drones.some(
        (x) => x.status !== 'TESTED'
    )

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            'scanner',
            {
                fps: 10,
                qrbox: 250,
            },
            false
        )

        scanner.render(
            async (decodedText) => {
                try {
                    setError('')

                    const url = new URL(decodedText)

                    const parts = url.pathname.split('/')

                    const droneId =
                        parts[parts.length - 1]

                    const response = await fetch(
                        `/api/drone/${droneId}`
                    )

                    // 🚨 Handle 404
                    if (response.status === 404) {
                        setError("Drone hasn't found")
                        return
                    }

                    if (!response.ok) {
                        setError('Unknown error')
                        return
                    }

                    const drone = await response.json()

                    setDrones((prev) => {
                        const exists = prev.find(
                            (x) => x.id === drone.id
                        )

                        if (exists) {
                            return prev
                        }

                        return [...prev, drone]
                    })
                } catch (e) {
                    console.error(e)

                    setError('Invalid QR code')
                }
            },
            (error) => {
                console.log(error)
            }
        )

        return () => {
            scanner.clear().catch(console.error)
        }
    }, [])

    async function confirmBatch() {
        setLoading(true)

        const response = await fetch(
            '/api/batches/create',
            {
                method: 'POST',
                headers: {
                    'Content-Type':
                        'application/json',
                },
                body: JSON.stringify({
                    droneIds: drones.map(
                        (x) => x.id
                    ),
                }),
            }
        )

        setLoading(false)

        if (!response.ok) {
            alert('Failed')
            return
        }

        alert('Batch created')

        setDrones([])
    }

    return (
        <div style={{ padding: 40 }}>
            <h1>Create Batch</h1>

            <div
                id="scanner"
                style={{
                    width: 400,
                    marginBottom: 30,
                }}
            />

            {/* 🚨 Error */}
            {error && (
                <div
                    style={{
                        color: 'red',
                        marginBottom: 20,
                    }}
                >
                    {error}
                </div>
            )}

            <h2>Scanned drones</h2>

            <ul
                style={{
                    listStyle: 'none',
                    padding: 0,
                }}
            >
                {drones.map((drone) => {
                    const isValid =
                        drone.status === 'TESTED'

                    return (
                        <li
                            key={drone.id}
                            style={{
                                marginBottom: 10,
                                padding: 12,
                                border: '1px solid #ccc',
                                borderRadius: 8,

                                backgroundColor: isValid
                                    ? '#e8ffe8'
                                    : '#ffe8e8',

                                display: 'flex',
                                justifyContent:
                                    'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <div>
                                <div>
                                    <strong>
                                        {drone.id}
                                    </strong>
                                </div>

                                <div>
                                    Status:{' '}
                                    {drone.status}
                                </div>
                            </div>

                            <button
                                onClick={() =>
                                    removeDrone(
                                        drone.id
                                    )
                                }
                                style={{
                                    padding:
                                        '6px 12px',
                                    cursor:
                                        'pointer',
                                }}
                            >
                                Remove
                            </button>
                        </li>
                    )
                })}
            </ul>

            <button
                onClick={confirmBatch}
                disabled={
                    loading ||
                    drones.length === 0 ||
                    hasInvalidDrones
                }
                style={{
                    marginTop: 20,
                    padding: '10px 20px',
                    cursor: 'pointer',
                }}
            >
                {loading
                    ? 'Creating...'
                    : 'Confirm'}
            </button>
        </div>
    )
}