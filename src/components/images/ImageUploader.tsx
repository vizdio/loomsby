import { useState } from 'react'
import { imagesApi } from '../../features/images/images.api'

interface ImageUploaderProps {
    onUploaded: (url: string) => void
    folder?: string
}

export function ImageUploader({ onUploaded, folder }: ImageUploaderProps) {
    const [loading, setLoading] = useState(false)

    return (
        <label className="stack">
            Upload image
            <input
                type="file"
                accept="image/*"
                onChange={async (event) => {
                    const file = event.target.files?.[0]
                    if (!file) return
                    setLoading(true)
                    try {
                        const url = await imagesApi.uploadImage(file, folder)
                        onUploaded(url)
                    } finally {
                        setLoading(false)
                    }
                }}
            />
            {loading && <small>Uploading...</small>}
        </label>
    )
}
