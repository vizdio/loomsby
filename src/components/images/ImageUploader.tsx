import { useRef, useState } from 'react'
import { imagesApi, type UploadImageParams } from '../../features/images/images.api'
import type { ImageUploadResult } from '../../lib/types'

interface ImageUploaderProps {
    uploadParams: Omit<UploadImageParams, 'file'>
    onUploaded: (result: ImageUploadResult) => void
}

export function ImageUploader({ uploadParams, onUploaded }: ImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [error, setError] = useState<string | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleUpload = async (file: File) => {
        setError(null)
        setLoading(true)
        setProgress(20)
        try {
            const result = await imagesApi.uploadImage({ ...uploadParams, file })
            setProgress(100)
            onUploaded(result)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed')
        } finally {
            setLoading(false)
            window.setTimeout(() => setProgress(0), 400)
        }
    }

    return (
        <div className="stack">
            <button
                type="button"
                className={`image-upload-dropzone ${isDragging ? 'dragging' : ''}`}
                onClick={() => inputRef.current?.click()}
                onDragOver={(event) => {
                    event.preventDefault()
                    setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(event) => {
                    event.preventDefault()
                    setIsDragging(false)
                    const file = event.dataTransfer.files?.[0]
                    if (file) {
                        void handleUpload(file)
                    }
                }}
                aria-label="Upload image"
            >
                <strong>
                    {loading ? 'Uploading image...' : 'Drop image here or click to upload'}
                </strong>
                <span className="muted-text">Supports JPG, PNG, WEBP, GIF, AVIF up to 8MB.</span>
            </button>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (file) {
                        void handleUpload(file)
                    }
                }}
            />

            {progress > 0 && progress < 100 && (
                <div className="upload-progress" role="status" aria-live="polite">
                    <div className="upload-progress__bar" style={{ width: `${progress}%` }} />
                </div>
            )}

            {error && <small className="error">{error}</small>}
        </div>
    )
}
