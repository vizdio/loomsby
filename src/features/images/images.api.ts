import { supabase } from '../../lib/supabase'
import { STORAGE_BUCKETS } from '../../lib/constants'

async function uploadImage(file: File, folder = 'uploads'): Promise<string> {
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const path = `${folder}/${crypto.randomUUID()}.${ext}`

    const { error } = await supabase.storage.from(STORAGE_BUCKETS.media).upload(path, file, {
        cacheControl: '3600',
        upsert: false,
    })

    if (error) throw error

    const { data } = supabase.storage.from(STORAGE_BUCKETS.media).getPublicUrl(path)
    return data.publicUrl
}

async function uploadAvatar(file: File): Promise<string> {
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const path = `avatars/${crypto.randomUUID()}.${ext}`

    const { error } = await supabase.storage.from(STORAGE_BUCKETS.avatars).upload(path, file, {
        cacheControl: '3600',
        upsert: true,
    })

    if (error) throw error

    const { data } = supabase.storage.from(STORAGE_BUCKETS.avatars).getPublicUrl(path)
    return data.publicUrl
}

export const imagesApi = {
    uploadImage,
    uploadAvatar,
}
