'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function VerifyButton({
                                         droneId,
                                     }: {
    droneId: string
}) {
    const router = useRouter()

    const [loading, setLoading] = useState(false)

    async function handleVerify() {
        setLoading(true)

        const response = await fetch(
            `/api/drone/${droneId}/verify`,
            {
                method: 'POST',
            }
        )

        setLoading(false)

        if (!response.ok) {
            alert('Verification failed')
            return
        }

        router.refresh()
    }

    return (
        <button
            onClick={handleVerify}
            disabled={loading}
            style={{
                padding: '10px 20px',
                cursor: 'pointer',
            }}
        >
            {loading ? 'Verifying...' : 'Verify'}
        </button>
    )
}