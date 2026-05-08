'use client'
import { useEffect, useState } from 'react'
type DroneType = {
    id: string
    name: string
}
export default function CreateWorkshopPage() {
    const [name, setName] = useState('')
    const [date, setDate] = useState('')
    const [types, setTypes] = useState<DroneType[]>([])
    const [selectedTypes, setSelectedTypes] = useState<
        {
            typeId: string
            count: number
        }[]
        >([])
    useEffect(() => {
        fetch('/api/drone-types')
            .then((res) => res.json())
            .then((data) => setTypes(data))
    }, [])
    async function handleSubmit() {
        const response = await fetch('/api/workshops/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                date,
                droneTypes: selectedTypes,
            }),
        })
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${name}.pdf`
        a.click()
    }
    function updateCount(typeId: string, count: number) {
        setSelectedTypes((prev) => {
            const existing = prev.find((x) => x.typeId === typeId)
            if (existing) {
                return prev.map((x) =>
                    x.typeId === typeId
                        ? {
                            ...x,
                            count,
                        }
                        : x
                )
            }
            return [...prev, { typeId, count }]
        })
    }
    return (
        <div style={{ padding: 40 }}>
            <h1>Create Workshop</h1>

            <div>
                <label>Name</label>
                <br />
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <br />
            <div>
                <label>Date</label>
                <br />
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>
            <br />
            <h2>Drone Types</h2>
            {types.map((type) => (
                <div key={type.id} style={{ marginBottom: 10 }}>
                    <label>{type.name}</label>
                    <input
                        type="number"
                        min={0}
                        defaultValue={0}
                        onChange={(e) =>
                            updateCount(type.id, Number(e.target.value))
                        }
                    />
                </div>
            ))}
            <br />
            <button onClick={handleSubmit}>
                Create Workshop
            </button>
        </div>
)
}