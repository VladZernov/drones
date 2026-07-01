'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'

type Drone = {
    id: string
    status: string
    workshopId?: string
    workshop?: {
        id: string
        name: string
    }
}

type Workshop = {
    id: string
    name: string
}

export default function DronesPage() {
    const [drones, setDrones] = useState<Drone[]>([])
    const [workshops, setWorkshops] = useState<Workshop[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [selectedWorkshop, setSelectedWorkshop] = useState<string>('all')

    useEffect(() => {
        async function load() {
            try {
                setLoading(true)
                setError('')

                const [dronesRes, workshopsRes] = await Promise.all([
                    fetch('/api/drones'),
                    fetch('/api/workshops'),
                ])

                if (!dronesRes.ok || !workshopsRes.ok) {
                    throw new Error('Failed to fetch data')
                }

                const dronesData = await dronesRes.json()
                const workshopsData = await workshopsRes.json()

                setDrones(dronesData)
                setWorkshops(workshopsData)
            } catch (e) {
                console.error(e)
                setError('Failed to load drones')
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [])

    const filteredDrones = useMemo(() => {
        if (selectedWorkshop === 'all') return drones

        return drones.filter(
            (d) => d.workshopId === selectedWorkshop
        )
    }, [drones, selectedWorkshop])

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

            {/* FILTER */}
            <div style={{ marginBottom: 20 }}>
                <label style={{ marginRight: 10 }}>
                    Filter by workshop:
                </label>

                <select
                    value={selectedWorkshop}
                    onChange={(e) =>
                        setSelectedWorkshop(e.target.value)
                    }
                    style={{
                        padding: 6,
                        border: '1px solid #ccc',
                        borderRadius: 6,
                    }}
                >
                    <option value="all">All</option>

                    {workshops.map((w) => (
                        <option key={w.id} value={w.id}>
                            {w.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* LIST */}
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {filteredDrones.map((drone) => (
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