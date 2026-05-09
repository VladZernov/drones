'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Drone = {
    id: string
    status: string
}

export default function DronesPage() {
    const [drones, setDrones] = useState<Drone[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function load() {
            try {
                setLoading(true)
                setError('')

                const res = await fetch('/api/drones')

                if (!res.ok) {
                    throw new Error('Failed to fetch drones')
                }

                const data = await res.json()

                setDrones(data)
            } catch (e) {
                console.error(e)
                setError('Failed to load drones')
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
            <h1>All Drones</h1>

            <ul style={{ listStyle: 'none', padding: 0 }}>
                {drones.map((drone) => (
                    <li
                        key={drone.id}
                        style={{
                            padding: 12,
                            marginBottom: 10,
                            border: '1px solid #ccc',
                            borderRadius: 8,
                        }}
                    >
                        <Link
                            href={`/drone/${drone.id}`}
                            style={{
                                textDecoration: 'none',
                                color: 'black',
                                display: 'block',
                            }}
                        >
                            <strong>{drone.id}</strong> —{' '}
                            {drone.status}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}