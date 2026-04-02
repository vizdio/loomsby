import type { ChatMessage } from '../../lib/types'
import { formatDate } from '../../utils/format'
import { ImageAttachment } from '../images/ImageAttachment'

interface MessageBubbleProps {
    message: ChatMessage
    isMine: boolean
    onOpenImage: (imageId: string) => void
}

export function MessageBubble({ message, isMine, onOpenImage }: MessageBubbleProps) {
    const attachment = message.image
        ? message.image
        : message.image_url
          ? {
                id: `${message.id}-legacy-image`,
                user_id: message.sender_id,
                bucket: '',
                path: '',
                url: message.image_url,
                thumbnail_url: null,
                context: 'chat' as const,
                created_at: message.created_at,
            }
          : null

    return (
        <article className={`bubble ${isMine ? 'mine' : 'theirs'}`}>
            <p>{message.content}</p>
            {attachment && <ImageAttachment image={attachment} onOpen={onOpenImage} />}
            <small>{formatDate(message.created_at)}</small>
        </article>
    )
}
