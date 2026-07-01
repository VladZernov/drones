'use client';

import { useEffect, useState } from 'react';

type DroneType = {
    id: string;
    name: string;
    _count: {
        drones: number;
    };
};

export default function DroneTypesPage() {
    const [types, setTypes] = useState<DroneType[]>([]);
    const [newName, setNewName] = useState('');

    async function load() {
        const res = await fetch('/api/drone-types');
        setTypes(await res.json());
    }

    useEffect(() => {
        load();
    }, []);

    async function create() {
        const res = await fetch('/api/drone-types', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: newName,
            }),
        });

        if (!res.ok) {
            alert((await res.json()).error);
            return;
        }

        setNewName('');
        load();
    }

    async function remove(id: string) {
        if (!confirm('Delete drone type?')) {
            return;
        }

        const res = await fetch(`/api/drone-types/${id}`, {
            method: 'DELETE',
        });

        if (!res.ok) {
            alert((await res.json()).error);
            return;
        }

        load();
    }

    return (
        <div style={{ padding: 40 }}>
            <h1>Drone Types</h1>

            <div
                style={{
                    marginBottom: 30,
                }}
            >
                <input
                    placeholder="New type"
                    value={newName}
                    onChange={(e) =>
                        setNewName(e.target.value)
                    }
                />

                <button
                    onClick={create}
                    style={{ marginLeft: 10 }}
                >
                    Create
                </button>
            </div>

            {types.map((type) => (
                <DroneTypeRow
                    key={type.id}
                    type={type}
                    onDelete={remove}
                />
            ))}
        </div>
    );
}

function DroneTypeRow({
                          type,
                          onDelete,
                      }: {
    type: DroneType;
    onDelete: (id: string) => void;
}) {
    const [name, setName] = useState(type.name);

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 10,
                border: '1px solid #ccc',
                borderRadius: 8,
                padding: 12,
            }}
        >
            {name}

            <span>
                Drones: {type._count.drones}
            </span>

            {type._count.drones === 0 && (
                <button
                    onClick={() => onDelete(type.id)}
                >
                    Delete
                </button>
            )}
        </div>
    );
}