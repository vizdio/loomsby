import type { ImageRecord } from '../../lib/types'

export function ImageGrid({
    images,
    onSelect,
    onDelete,
}: {
    images: ImageRecord[]
    onSelect: (imageId: string) => void
    onDelete?: (image: ImageRecord) => void
}) {
    return (
        <div className="image-grid">
            {images.map((image) => (
                <div key={image.id} className="image-tile-wrap">
                    <button
                        className="image-tile"
                        onClick={() => onSelect(image.id)}
                        aria-label="Open uploaded image"
                    >
                        <img loading="lazy" src={image.thumbnail_url ?? image.url} alt="Shared" />
                    </button>
                    {onDelete && (
                        <button
                            type="button"
                            className="image-delete-btn"
                            onClick={() => onDelete(image)}
                            aria-label="Delete uploaded image"
                            title="Delete image"
                        >
                            Delete
                        </button>
                    )}
                </div>
            ))}
        </div>
    )
}
