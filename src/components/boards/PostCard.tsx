import Markdown from 'react-markdown'
import type { Post } from '../../lib/types'
import { formatDate } from '../../utils/format'
import { ImageAttachment } from '../images/ImageAttachment'

interface PostCardProps {
    post: Post
    onModerate: (postId: string, action: 'delete' | 'pin' | 'lock') => Promise<void>
    onOpenImage: (imageId: string) => void
}

export function PostCard({ post, onModerate, onOpenImage }: PostCardProps) {
    return (
        <article className="card stack">
            <div className="row spread wrap">
                <h4>{post.title}</h4>
                <small>{formatDate(post.created_at)}</small>
            </div>
            {post.image_url && (
                <img className="media" src={post.image_url} alt="Attached to post" />
            )}
            {post.images && post.images.length > 0 && (
                <div className="row gap-sm wrap">
                    {post.images.map((image) => (
                        <ImageAttachment key={image.id} image={image} onOpen={onOpenImage} />
                    ))}
                </div>
            )}
            <Markdown>{post.content_md}</Markdown>
            <div className="row gap-sm">
                <button className="btn-secondary" onClick={() => void onModerate(post.id, 'pin')}>
                    Pin
                </button>
                <button className="btn-secondary" onClick={() => void onModerate(post.id, 'lock')}>
                    Lock
                </button>
                <button className="btn-danger" onClick={() => void onModerate(post.id, 'delete')}>
                    Delete
                </button>
            </div>
        </article>
    )
}
