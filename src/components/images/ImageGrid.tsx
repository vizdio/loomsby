import type { ImageRecord } from '../../lib/types'

export function ImageGrid({
    images,
    onSelect,
}: {
    images: ImageRecord[]
    onSelect: (imageId: string) => void
}) {
    return (
        <div className="image-grid">
            {images.map((image) => (
                <button
                    key={image.id}
                    className="image-tile"
                    onClick={() => onSelect(image.id)}
                    aria-label="Open uploaded image"
                >
                    <img loading="lazy" src={image.thumbnail_url ?? image.url} alt="Shared" />
                </button>
            ))}
        </div>
    )
}
