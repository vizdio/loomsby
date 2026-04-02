import { IMAGE_CONTEXTS, STORAGE_BUCKETS } from '../../lib/constants'
import { supabase } from '../../lib/supabase'
import type { ImageContext, ImageRecord, ImageUploadResult } from '../../lib/types'

const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024
const ALLOWED_IMAGE_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']

type UploadBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS]

export interface UploadImageParams {
    file: File
    context: ImageContext
    bucket?: UploadBucket
    boardId?: string
    postId?: string
    threadId?: string
    messageId?: string
    nodeGraphId?: string
    makePublic?: boolean
}

function sanitizeFileName(name: string): string {
    return name.replace(/[^a-zA-Z0-9._-]/g, '-').slice(0, 80)
}

function assertValidFile(file: File): void {
    if (!ALLOWED_IMAGE_MIME.includes(file.type)) {
        throw new Error('Unsupported image type. Please upload jpeg, png, webp, gif, or avif.')
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
        throw new Error('Image is too large. Maximum file size is 8MB.')
    }
}

function defaultBucketForContext(context: ImageContext): UploadBucket {
    switch (context) {
        case IMAGE_CONTEXTS.chat:
            return STORAGE_BUCKETS.chatImages
        case IMAGE_CONTEXTS.board:
            return STORAGE_BUCKETS.boardImages
        case IMAGE_CONTEXTS.builder:
            return STORAGE_BUCKETS.builderAssets
        case IMAGE_CONTEXTS.profile:
        default:
            return STORAGE_BUCKETS.userImages
    }
}

async function resolveSignedUrl(
    bucket: UploadBucket,
    path: string,
    makePublic: boolean,
): Promise<string> {
    if (makePublic) {
        const { data } = supabase.storage.from(bucket).getPublicUrl(path)
        return data.publicUrl
    }

    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 60)
    if (error || !data?.signedUrl) throw error ?? new Error('Failed to create signed URL')
    return data.signedUrl
}

async function uploadImage(params: UploadImageParams): Promise<ImageUploadResult> {
    assertValidFile(params.file)

    const { data: authData } = await supabase.auth.getUser()
    const userId = authData.user?.id
    if (!userId) throw new Error('You must be signed in to upload images.')

    const bucket = params.bucket ?? defaultBucketForContext(params.context)
    const ext = params.file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const baseName = params.file.name.split('.').slice(0, -1).join('.') || 'image'
    const safeName = sanitizeFileName(baseName)
    const path = `${userId}/${params.context}/${crypto.randomUUID()}-${safeName}.${ext}`

    const { error: uploadError } = await supabase.storage.from(bucket).upload(path, params.file, {
        cacheControl: '3600',
        upsert: false,
        contentType: params.file.type,
    })
    if (uploadError) throw uploadError

    const signedUrl = await resolveSignedUrl(bucket, path, Boolean(params.makePublic))

    const insertPayload = {
        user_id: userId,
        bucket,
        path,
        url: signedUrl,
        thumbnail_url: null,
        context: params.context,
        board_id: params.boardId ?? null,
        post_id: params.postId ?? null,
        thread_id: params.threadId ?? null,
        message_id: params.messageId ?? null,
        node_graph_id: params.nodeGraphId ?? null,
    }

    const { data: image, error: imageInsertError } = await supabase
        .from('images')
        .insert(insertPayload)
        .select('*')
        .single()

    if (imageInsertError) {
        await supabase.storage.from(bucket).remove([path])
        throw imageInsertError
    }

    return { image: image as ImageRecord, signedUrl }
}

async function deleteImage(image: Pick<ImageRecord, 'id' | 'bucket' | 'path'>): Promise<void> {
    const { error: storageError } = await supabase.storage.from(image.bucket).remove([image.path])
    if (storageError) throw storageError

    const { error: dbError } = await supabase.from('images').delete().eq('id', image.id)
    if (dbError) throw dbError
}

async function refreshSignedUrl(image: Pick<ImageRecord, 'bucket' | 'path'>): Promise<string> {
    const { data, error } = await supabase.storage
        .from(image.bucket)
        .createSignedUrl(image.path, 3600)
    if (error || !data?.signedUrl) throw error ?? new Error('Failed to create signed URL')
    return data.signedUrl
}

async function attachImageToChatMessage(messageId: string, imageId: string): Promise<void> {
    const { error } = await supabase
        .from('chat_messages')
        .update({ image_id: imageId })
        .eq('id', messageId)
    if (error) throw error
}

async function attachImagesToPost(postId: string, imageIds: string[]): Promise<void> {
    if (imageIds.length === 0) return
    const rows = imageIds.map((imageId) => ({ post_id: postId, image_id: imageId }))
    const { error } = await supabase.from('post_images').insert(rows)
    if (error) throw error
}

export const imagesApi = {
    uploadImage,
    deleteImage,
    refreshSignedUrl,
    attachImageToChatMessage,
    attachImagesToPost,
    MAX_FILE_SIZE_BYTES,
    ALLOWED_IMAGE_MIME,
}
