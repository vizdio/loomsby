import type { ChatMessage } from '../../lib/types'
import { formatDate } from '../../utils/format'

interface MessageBubbleProps {
    message: ChatMessage
    isMine: boolean
}

export function MessageBubble({ message, isMine }: MessageBubbleProps) {
    return (
        <article className={`bubble ${isMine ? 'mine' : 'theirs'}`}>
            <p>{message.content}</p>
            {message.image_url && (
                <img className="media" src={message.image_url} alt="Shared in chat" />
            )}
            <small>{formatDate(message.created_at)}</small>
        </article>
    )
}
