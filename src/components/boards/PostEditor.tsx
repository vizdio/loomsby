import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import type { z } from 'zod'
import { postSchema } from '../../lib/validators'
import { ImageUploader } from '../images/ImageUploader'
import { IMAGE_CONTEXTS } from '../../lib/constants'
import type { ImageRecord } from '../../lib/types'

type PostInput = z.infer<typeof postSchema>

export function PostEditor({
    boardId,
    onSubmitPost,
}: {
    boardId: string
    onSubmitPost: (input: PostInput & { imageIds: string[] }) => Promise<void>
}) {
    const [attachments, setAttachments] = useState<ImageRecord[]>([])

    const { register, handleSubmit, reset, formState } = useForm<PostInput>({
        resolver: zodResolver(postSchema),
        defaultValues: { title: '', content_md: '' },
    })

    return (
        <form
            className="card stack"
            onSubmit={handleSubmit(async (values) => {
                await onSubmitPost({
                    ...values,
                    imageIds: attachments.map((img) => img.id),
                })
                reset()
                setAttachments([])
            })}
        >
            <h3>Create Post</h3>
            <input {...register('title')} placeholder="Title" />
            <textarea {...register('content_md')} rows={6} placeholder="Markdown supported" />

            <ImageUploader
                uploadParams={{
                    context: IMAGE_CONTEXTS.board,
                    boardId,
                    makePublic: true,
                }}
                onUploaded={(result) => {
                    setAttachments((current) => [result.image, ...current])
                }}
            />

            {attachments.length > 0 && (
                <div className="row gap-sm wrap">
                    {attachments.map((image) => (
                        <img
                            key={image.id}
                            className="media-thumb"
                            src={image.url}
                            alt="Attachment preview"
                        />
                    ))}
                </div>
            )}

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
