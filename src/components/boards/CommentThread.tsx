import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { boardsApi } from '../../features/boards/boards.api'
import { commentSchema } from '../../lib/validators'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'

type CommentInput = z.infer<typeof commentSchema>

export function CommentThread({ postId }: { postId: string }) {
    const { data, refetch } = useQuery({
        queryKey: ['comments', postId],
        queryFn: () => boardsApi.listComments(postId),
        enabled: Boolean(postId),
    })

    const { register, handleSubmit, reset } = useForm<CommentInput>({
        resolver: zodResolver(commentSchema),
        defaultValues: { content_md: '' },
    })

    return (
        <section className="stack">
            <h5>Comments</h5>
            {(data ?? []).map((comment) => (
                <article key={comment.id} className="card stack">
                    <p>{comment.content_md}</p>
                </article>
            ))}
            <form
                className="stack"
                onSubmit={handleSubmit(async (values) => {
                    await boardsApi.createComment(postId, values.content_md)
                    reset()
                    await refetch()
                })}
            >
                <textarea {...register('content_md')} rows={3} placeholder="Reply in markdown" />
                <button type="submit">Comment</button>
            </form>
        </section>
    )
}
