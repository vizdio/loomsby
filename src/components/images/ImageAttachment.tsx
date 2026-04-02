import type { ImageRecord } from '../../lib/types'

interface ImageAttachmentProps {
    image: ImageRecord
    onOpen: (imageId: string) => void
}

export function ImageAttachment({ image, onOpen }: ImageAttachmentProps) {
    return (
        <button
            className="image-attachment"
            onClick={() => onOpen(image.id)}
            aria-label="Open attached image"
        >
            <img
                loading="lazy"
                src={image.thumbnail_url ?? image.url}
                alt="Attachment thumbnail"
                className="image-attachment__thumb"
            />
        </button>
    )
}
