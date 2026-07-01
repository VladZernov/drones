'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Workshop = {
    id: string
    name: string
}

type Drone = {
    id: string
    status: string
    workshop?: Workshop
}

type Attachment = {
    id: string
    url: string
    fileName?: string
}

type Batch = {
    id: string
    name: string
    status: string
    createdAt: string
    destination?: string
    drones: Drone[]
    attachments?: Attachment[]
}

export default function BatchesPage() {
    const [batches, setBatches] = useState<Batch[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [actionError, setActionError] = useState('')

    const [openId, setOpenId] = useState<string | null>(null)
    const [reportModal, setReportModal] = useState<string | null>(null)
    const [file, setFile] = useState<File | null>(null)

    useEffect(() => {
        async function load() {
            try {
                setLoading(true)
                setError('')

                const res = await fetch('/api/batches')

                if (!res.ok) throw new Error()

                const data = await res.json()
                setBatches(data)
            } catch (e) {
                setError('Failed to load batches')
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [])

    useEffect(() => {
        if (loading || batches.length === 0) return;

        const hash = window.location.hash.slice(1);
        if (!hash) return;

        setOpenId(hash);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                document.getElementById(hash)?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            });
        });
    }, [loading, batches]);

    useEffect(() => {
        function onHashChange() {
            const hash = window.location.hash.slice(1);

            if (!hash) {
                return;
            }

            setOpenId(hash);

            setTimeout(() => {
                document.getElementById(hash)?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }, 0);
        }

        window.addEventListener('hashchange', onHashChange);

        return () =>
            window.removeEventListener('hashchange', onHashChange);
    }, []);

    function getUniqueWorkshops(drones: Drone[]) {
        const map = new Map()

        drones.forEach((d) => {
            if (d.workshop) {
                map.set(d.workshop.id, d.workshop)
            }
        })

        return Array.from(map.values())
    }

    async function deleteBatch(id: string) {
        if (!confirm('Delete this batch?')) return

        try {
            setActionError('')

            const res = await fetch(`/api/batches/${id}`, {
                method: 'DELETE',
            })

            if (!res.ok) {
                const data = await res.json().catch(() => null)
                throw new Error(data?.error || 'Failed to delete batch')
            }

            setBatches(prev => prev.filter(b => b.id !== id))

            if (openId === id) setOpenId(null)
        } catch (e: any) {
            setActionError(e.message)
        }
    }

    async function safePost(url: string) {
        const res = await fetch(url, { method: 'POST' })

        if (!res.ok) {
            const data = await res.json().catch(() => null)

            const message =
                data?.error ||
                data?.message ||
                `Request failed (${res.status})`

            throw new Error(message)
        }

        return res.json().catch(() => ({}))
    }

    async function ship(id: string) {
        try {
            setActionError('')
            await safePost(`/api/batches/${id}/ship`)
            location.reload()
        } catch (e: any) {
            setActionError(e.message)
        }
    }

    async function uploadAttachment(id: string) {
        if (!file) return

        const form = new FormData()
        form.append('file', file)

        await fetch(`/api/batches/${id}/attachments`, {
            method: 'POST',
            body: form,
        })

        setFile(null)
        location.reload()
    }

    async function report(id: string) {
        try {
            setActionError('')
            await safePost(`/api/batches/${id}/report`)
            location.reload()
        } catch (e: any) {
            setActionError(e.message)
        }
    }

    async function updateDestination(
        id: string,
        value: string
    ) {
        setBatches((prev) =>
            prev.map((b) =>
                b.id === id
                    ? { ...b, destination: value }
                    : b
            )
        )

        await fetch(`/api/batches/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                destination: value,
            }),
        })
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
            <h1>All Batches</h1>

            {actionError && (
                <div
                    style={{
                        background: '#ffe5e5',
                        color: '#b00020',
                        padding: 10,
                        borderRadius: 6,
                        marginBottom: 20,
                        border: '1px solid #ffb3b3',
                    }}
                >
                    {actionError}
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {batches.map((batch) => {
                    const isOpen = openId === batch.id

                    return (
                        <div
                            id={batch.id}
                            key={batch.id}
                            style={{
                                border: '1px solid #ccc',
                                borderRadius: 10,
                                padding: 16,
                            }}
                        >
                            {/* HEADER (click to expand) */}
                            <div
                                onClick={() =>
                                    setOpenId(
                                        isOpen ? null : batch.id
                                    )
                                }
                                style={{
                                    cursor: 'pointer',
                                }}
                            >
                                <h2>{batch.name}</h2>

                                <p>
                                    <strong>Status:</strong>{' '}
                                    {batch.status}
                                </p>

                                <p>
                                    <strong>Drones:</strong>{' '}
                                    {batch.drones.length}
                                </p>
                            </div>

                            {/* EXPANDED */}
                            {isOpen && (
                                <div
                                    style={{
                                        marginTop: 12,
                                        display: 'flex',
                                        flexDirection:
                                            'column',
                                        gap: 10,
                                    }}
                                >
                                    {/* DESTINATION */}
                                    <div>
                                        <strong>
                                            Destination:
                                        </strong>

                                        <input
                                            style={{
                                                marginLeft:
                                                    10,
                                                padding:
                                                    '6px 10px',
                                                border:
                                                    '1px solid #ccc',
                                                borderRadius:
                                                    6,
                                            }}
                                            value={
                                                batch.destination ||
                                                ''
                                            }
                                            placeholder="Set destination"
                                            onChange={(e) =>
                                                updateDestination(
                                                    batch.id,
                                                    e.target
                                                        .value
                                                )
                                            }
                                        />
                                    </div>

                                    {/* DRONES */}
                                    <div>
                                        <strong>Drones:</strong>

                                        <ul>
                                            {batch.drones.map((d) => (
                                                <li key={d.id}>
                                                    <Link href={`/drone/${d.id}`}>
                                                        {d.id}
                                                    </Link>{' '}
                                                    — {d.status}

                                                    {d.workshop && (
                                                        <span
                                                            style={{
                                                                marginLeft: 8,
                                                                fontSize: 12,
                                                                padding: '2px 6px',
                                                                border: '1px solid #ccc',
                                                                borderRadius: 6,
                                                            }}
                                                        >
                                                            {d.workshop.name}
                                                        </span>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* WORKSHOPS */}
                                    <div style={{ marginTop: 10 }}>
                                        <strong>Workshops:</strong>

                                        <ul>
                                            {getUniqueWorkshops(batch.drones).map(
                                                (w) => (
                                                    <li key={w.id}>{w.name}</li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                    {/* ATTACHMENTS */}
                                    <div>
                                        <strong>
                                            Attachments:
                                        </strong>

                                        <ul>
                                            {batch.attachments?.map((a) => (
                                                <li key={a.id}>
                                                    <a
                                                        href={`/api/attachments/${a.id}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        style={{
                                                            color: 'blue',
                                                            textDecoration: 'underline',
                                                        }}
                                                    >
                                                        {a.fileName || 'Attachment'}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>

                                        <input
                                            type="file"
                                            onChange={(e) =>
                                                setFile(
                                                    e.target
                                                        .files?.[0] ||
                                                    null
                                                )
                                            }
                                        />

                                        <button
                                            onClick={() =>
                                                uploadAttachment(
                                                    batch.id
                                                )
                                            }
                                        >
                                            Upload
                                        </button>
                                    </div>

                                    {/* ACTIONS */}
                                    <div
                                        style={{
                                            display: 'flex',
                                            gap: 10,
                                            marginTop: 10,
                                        }}
                                    >
                                        {batch.status ===
                                        'CREATED' && (
                                            <button
                                                onClick={() =>
                                                    ship(batch.id)
                                                }
                                            >
                                                Ship
                                            </button>
                                        )}

                                        {batch.status ===
                                        'SHIPPED' && (
                                            <button
                                                onClick={() =>
                                                    report(
                                                        batch.id
                                                    )
                                                }
                                            >
                                                Report
                                            </button>
                                        )}

                                        {batch.status !== 'REPORTED' && (
                                            <button
                                                onClick={() => deleteBatch(batch.id)}
                                                style={{
                                                    background: '#ffdddd',
                                                    border: '1px solid #cc0000',
                                                    color: '#900',
                                                    padding: '6px 10px',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                Delete
                                            </button>
                                        )}
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