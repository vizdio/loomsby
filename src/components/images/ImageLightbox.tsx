import { useEffect, useMemo, useState } from 'react'
import type { ImageRecord } from '../../lib/types'

interface ImageLightboxProps {
    images: ImageRecord[]
    selectedId: string | null
    onClose: () => void
}

export function ImageLightbox({ images, selectedId, onClose }: ImageLightboxProps) {
    const [zoom, setZoom] = useState(1)
    const [touchStartX, setTouchStartX] = useState<number | null>(null)
    const [activeIndex, setActiveIndex] = useState(0)

    const selectedIndex = useMemo(
        () => images.findIndex((img) => img.id === selectedId),
        [images, selectedId],
    )

    useEffect(() => {
        if (selectedIndex >= 0) {
            setActiveIndex(selectedIndex)
            setZoom(1)
        }
    }, [selectedIndex])

    useEffect(() => {
        if (!selectedId) return
        const listener = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose()
            if (event.key === 'ArrowRight') setActiveIndex((i) => (i + 1) % images.length)
            if (event.key === 'ArrowLeft')
                setActiveIndex((i) => (i - 1 + images.length) % images.length)
        }
        window.addEventListener('keydown', listener)
        return () => window.removeEventListener('keydown', listener)
    }, [selectedId, onClose, images.length])

    if (!selectedId || images.length === 0) return null

    const image = images[activeIndex]

    return (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={onClose}>
            <div className="lightbox-controls" onClick={(event) => event.stopPropagation()}>
                <button
                    className="btn-secondary"
                    onClick={() => setActiveIndex((i) => (i - 1 + images.length) % images.length)}
                >
                    Prev
                </button>
                <button
                    className="btn-secondary"
                    onClick={() => setZoom((z) => Math.max(1, z - 0.25))}
                >
                    -
                </button>
                <span className="muted-text">{Math.round(zoom * 100)}%</span>
                <button
                    className="btn-secondary"
                    onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
                >
                    +
                </button>
                <button
                    className="btn-secondary"
                    onClick={() => setActiveIndex((i) => (i + 1) % images.length)}
                >
                    Next
                </button>
                <button className="btn-secondary" onClick={onClose}>
                    Close
                </button>
            </div>

            <img
                onClick={(event) => event.stopPropagation()}
                src={image.url}
                alt="Expanded"
                style={{ transform: `scale(${zoom})` }}
                onTouchStart={(event) => setTouchStartX(event.changedTouches[0]?.clientX ?? null)}
                onTouchEnd={(event) => {
                    if (touchStartX === null) return
                    const diff = event.changedTouches[0].clientX - touchStartX
                    if (diff > 40) setActiveIndex((i) => (i - 1 + images.length) % images.length)
                    if (diff < -40) setActiveIndex((i) => (i + 1) % images.length)
                    setTouchStartX(null)
                }}
            />
        </div>
    )
}
