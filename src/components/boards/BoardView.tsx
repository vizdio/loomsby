import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { boardsApi } from '../../features/boards/boards.api'
import { useRealtimeChannel } from '../../hooks/useRealtimeChannel'
import { supabase } from '../../lib/supabase'
import { PostCard } from './PostCard'
import { PostEditor } from './PostEditor'
import { CommentThread } from './CommentThread'
import { ImageLightbox } from '../images/ImageLightbox'

export function BoardView({ boardId }: { boardId: string | null }) {
    const [selectedImageId, setSelectedImageId] = useState<string | null>(null)

    const { data, refetch } = useQuery({
        queryKey: ['posts', boardId],
        queryFn: () => boardsApi.listPosts(boardId ?? ''),
        enabled: Boolean(boardId),
    })

    const { data: board } = useQuery({
        queryKey: ['board', boardId],
        queryFn: () => boardsApi.getBoard(boardId ?? ''),
        enabled: Boolean(boardId),
    })

    useRealtimeChannel(
        () =>
            supabase.channel(`board:${boardId ?? 'none'}`).on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'posts',
                    filter: `board_id=eq.${boardId}`,
                },
                () => {
                    void refetch()
                },
            ),
        [boardId, refetch],
    )

    useEffect(() => {
        if (!boardId) return
        void refetch()
    }, [boardId, refetch])

    const allImages = useMemo(() => (data ?? []).flatMap((post) => post.images ?? []), [data])

    if (!boardId) {
        return <section className="card">Select a board to begin.</section>
    }

    return (
        <section className="stack">
            <PostEditor
                boardId={boardId}
                boardImagesPrivate={Boolean(board?.images_private)}
                onSubmitPost={async ({ title, content_md, imageIds }) => {
                    await boardsApi.createPost(boardId, title, content_md, imageIds)
                    await refetch()
                }}
            />
            {(data ?? []).map((post) => (
                <div key={post.id} className="stack">
                    <PostCard
                        post={post}
                        onOpenImage={setSelectedImageId}
                        onModerate={async (postId, action) => {
                            await boardsApi.moderatePost(postId, action)
                            await refetch()
                        }}
                    />
                    <CommentThread postId={post.id} />
                </div>
            ))}

            <ImageLightbox
                images={allImages}
                selectedId={selectedImageId}
                onClose={() => setSelectedImageId(null)}
            />
        </section>
    )
}
