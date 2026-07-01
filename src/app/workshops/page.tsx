'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Drone = {
    id: string
    status: string
    type?: string
}

type Workshop = {
    id: string
    name: string
    createdAt: string
    drones: Drone[]
}

export default function WorkshopsPage() {
    const [workshops, setWorkshops] = useState<Workshop[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [openWorkshopId, setOpenWorkshopId] = useState<string | null>(null)

    useEffect(() => {
        async function load() {
            try {
                setLoading(true)
                setError('')

                const res = await fetch('/api/workshops')

                if (!res.ok) {
                    throw new Error('Failed to load workshops')
                }

                const data = await res.json()

                setWorkshops(data)
            } catch (e) {
                console.error(e)
                setError('Failed to load workshops')
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [])

    function toggleWorkshop(id: string) {
        setOpenWorkshopId(prev => prev === id ? null : id)
    }

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
            <h1>Workshops</h1>

            {workshops.length === 0 && (
                <p>No workshops found</p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {workshops.map(workshop => {
                    const isOpen = openWorkshopId === workshop.id

                    return (
                        <div
                            key={workshop.id}
                            style={{
                                border: '1px solid #ccc',
                                borderRadius: 10,
                                padding: 16,
                            }}
                        >
                            {/* HEADER */}
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                }}
                                onClick={() => toggleWorkshop(workshop.id)}
                            >
                                <div>
                                    <h2 style={{ margin: 0 }}>
                                        {workshop.name}
                                    </h2>

                                    <p style={{ margin: 0, fontSize: 12 }}>
                                        {new Date(workshop.createdAt).toLocaleString()}
                                    </p>
                                </div>

                                <div style={{ fontSize: 12 }}>
                                    Drones: {workshop.drones.length}
                                </div>
                            </div>

                            {/* DROPDOWN */}
                            {isOpen && (
                                <div style={{ marginTop: 12 }}>
                                    <div
                                        style={{
                                            borderTop: '1px solid #eee',
                                            paddingTop: 12,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 6,
                                        }}
                                    >
                                        {workshop.drones.map(drone => (
                                            <div
                                                key={drone.id}
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    padding: '6px 0',
                                                    borderBottom: '1px dashed #eee',
                                                }}
                                            >
                                                <Link
                                                    href={`/drone/${drone.id}`}
                                                    style={{
                                                        color: '#000',
                                                        textDecoration: 'none',
                                                    }}
                                                >
                                                    {drone.id}
                                                </Link>

                                                <div style={{ fontSize: 12 }}>
                                                    {drone.type ?? '-'} · {drone.status}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}