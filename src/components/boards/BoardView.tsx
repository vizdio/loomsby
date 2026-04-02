import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { boardsApi } from '../../features/boards/boards.api'
import { useRealtimeChannel } from '../../hooks/useRealtimeChannel'
import { supabase } from '../../lib/supabase'
import { PostCard } from './PostCard'
import { PostEditor } from './PostEditor'
import { CommentThread } from './CommentThread'

export function BoardView({ boardId }: { boardId: string | null }) {
    const { data, refetch } = useQuery({
        queryKey: ['posts', boardId],
        queryFn: () => boardsApi.listPosts(boardId ?? ''),
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

    if (!boardId) {
        return <section className="card">Select a board to begin.</section>
    }

    return (
        <section className="stack">
            <PostEditor
                onSubmitPost={async ({ title, content_md }) => {
                    await boardsApi.createPost(boardId, title, content_md)
                    await refetch()
                }}
            />
            {(data ?? []).map((post) => (
                <div key={post.id} className="stack">
                    <PostCard
                        post={post}
                        onModerate={async (postId, action) => {
                            await boardsApi.moderatePost(postId, action)
                            await refetch()
                        }}
                    />
                    <CommentThread postId={post.id} />
                </div>
            ))}
        </section>
    )
}
