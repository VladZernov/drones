'use client';

import { useState } from 'react';
import styles from './specification-editor.module.css';

const fields = [
    { key: 'frame', label: 'Frame' },
    { key: 'flightController', label: 'Flight Controller' },
    { key: 'esc', label: 'ESC' },
    { key: 'motors', label: 'Motors' },
    { key: 'radioTx', label: 'Radio TX' },
    { key: 'videoTx', label: 'Video TX' },
    { key: 'gps', label: 'GPS' },
    { key: 'opticalFlow', label: 'Optical Flow' },
    { key: 'propellers', label: 'Propellers' },
    { key: 'camera', label: 'Camera' },
];

export default function SpecificationEditor({
                                                droneId,
                                                specification,
                                            }: {
    droneId: string;
    specification: any;
}) {
    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({
        frame: specification?.frame ?? '',
        flightController:
            specification?.flightController ?? '',
        esc: specification?.esc ?? '',
        motors: specification?.motors ?? '',
        radioTx: specification?.radioTx ?? '',
        videoTx: specification?.videoTx ?? '',
        gps: specification?.gps ?? '',
        opticalFlow:
            specification?.opticalFlow ?? '',
        propellers:
            specification?.propellers ?? '',
        camera: specification?.camera ?? '',
    });

    async function save() {
        setLoading(true);

        const res = await fetch(
            `/api/drone/${droneId}/specification`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            }
        );

        if (!res.ok) {
            alert('Save failed');
            return;
        }
        setLoading(false);
        alert('Saved');
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>
                Specification
            </h2>

            <div className={styles.grid}>
                {fields.map((field) => (
                    <div
                        key={field.key}
                        className={styles.row}
                    >
                        <label className={styles.label}>
                            {field.label}
                        </label>

                        <input
                            className={styles.input}
                            value={
                                form[
                                    field.key as keyof typeof form
                                    ]
                            }
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    [field.key]:
                                    e.target.value,
                                })
                            }
                        />
                    </div>
                ))}

                <div className={styles.actions}>
                    <button
                        onClick={save}
                        className={styles.button}
                    >
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
}