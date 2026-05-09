'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Drone = {
    id: string
    status: string
}

type Batch = {
    id: string
    name: string
    status: string
    createdAt: string
    drones: Drone[]
}

export default function BatchesPage() {
    const [batches, setBatches] = useState<Batch[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function load() {
            try {
                setLoading(true)
                setError('')

                const res = await fetch('/api/batches')

                if (!res.ok) {
                    throw new Error('Failed to load batches')
                }

                const data = await res.json()

                setBatches(data)
            } catch (e) {
                console.error(e)
                setError('Failed to load batches')
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [])

    if (loading) {
        return <div style={{ padding: 40 }}>Loading...</div>
    }

    if (error) {
        return (
            <div style={{ padding: 40, color: 'red' }}>
                {error}
            </div>
        )
    }

    return (
        <div style={{ padding: 40 }}>
            <h1>All Batches</h1>

            {batches.length === 0 && (
                <p>No batches found</p>
            )}

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                }}
            >
                {batches.map((batch) => (
                    <div
                        key={batch.id}
                        style={{
                            border: '1px solid #ccc',
                            borderRadius: 10,
                            padding: 16,
                        }}
                    >
                        <h2>{batch.name}</h2>

                        <p>
                            <strong>ID:</strong>{' '}
                            {batch.id}
                        </p>

                        <p>
                            <strong>Status:</strong>{' '}
                            {batch.status}
                        </p>

                        <p>
                            <strong>Drones:</strong>{' '}
                            {batch.drones.length}
                        </p>

                        <p>
                            <strong>Created:</strong>{' '}
                            {new Date(
                                batch.createdAt
                            ).toLocaleString()}
                        </p>

                        <div
                            style={{ marginTop: 10 }}
                        >
                            <strong>Drones list:</strong>

                            <ul>
                                {batch.drones.map(
                                    (d) => (
                                        <li key={d.id}>
                                            <Link
                                                href={`/drone/${d.id}`}
                                            >
                                                {d.id}
                                            </Link>{' '}
                                            —{' '}
                                            {d.status}
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}