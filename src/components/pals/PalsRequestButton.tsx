import { useState } from 'react'
import { palsApi } from '../../features/pals/pals.api'
import { APP_STRINGS } from '../../lib/constants'

interface PalsRequestButtonProps {
    addresseeId: string
}

export function PalsRequestButton({ addresseeId }: PalsRequestButtonProps) {
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    return (
        <button
            disabled={loading || sent}
            onClick={async () => {
                setLoading(true)
                try {
                    await palsApi.sendRequest(addresseeId)
                    setSent(true)
                } finally {
                    setLoading(false)
                }
            }}
        >
            {sent ? 'Requested' : loading ? 'Sending...' : APP_STRINGS.addPal}
        </button>
    )
}
