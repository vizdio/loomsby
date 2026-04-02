import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import { postSchema } from '../../lib/validators'

type PostInput = z.infer<typeof postSchema>

export function PostEditor({
    onSubmitPost,
}: {
    onSubmitPost: (input: PostInput) => Promise<void>
}) {
    const { register, handleSubmit, reset, formState } = useForm<PostInput>({
        resolver: zodResolver(postSchema),
        defaultValues: { title: '', content_md: '' },
    })

    return (
        <form
            className="card stack"
            onSubmit={handleSubmit(async (values) => {
                await onSubmitPost(values)
                reset()
            })}
        >
            <h3>Create Post</h3>
            <input {...register('title')} placeholder="Title" />
            <textarea {...register('content_md')} rows={6} placeholder="Markdown supported" />
            {formState.errors.title && <p className="error">{formState.errors.title.message}</p>}
            {formState.errors.content_md && (
                <p className="error">{formState.errors.content_md.message}</p>
            )}
            <button type="submit" disabled={formState.isSubmitting}>
                Publish
            </button>
        </form>
    )
}
