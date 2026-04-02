import { useState } from 'react'
import { ImageUploader } from '../components/images/ImageUploader'
import { ImageGrid } from '../components/images/ImageGrid'
import { ImageLightbox } from '../components/images/ImageLightbox'
import type { ImageRecord } from '../lib/types'
import { IMAGE_CONTEXTS } from '../lib/constants'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export function ProfilePage() {
    const { user } = useAuth()
    const [images, setImages] = useState<ImageRecord[]>([])
    const [selectedImageId, setSelectedImageId] = useState<string | null>(null)

    const handleUploaded = async (image: ImageRecord) => {
        setImages((current) => [image, ...current])
        if (!user) return
        if (image.context !== IMAGE_CONTEXTS.profile) return

        const { error } = await supabase
            .from('profiles')
            .update({ avatar_url: image.url })
            .eq('id', user.id)
        if (error) throw error
    }

    return (
        <main className="page stack">
            <section className="card stack">
                <h2>Profile Media</h2>
                <ImageUploader
                    uploadParams={{
                        context: IMAGE_CONTEXTS.profile,
                        makePublic: true,
                    }}
                    onUploaded={({ image }) => {
                        void handleUploaded(image)
                    }}
                />
            </section>
            <section className="card stack">
                <h3>Uploaded Images</h3>
                <ImageGrid images={images} onSelect={setSelectedImageId} />
            </section>
            <ImageLightbox
                images={images}
                selectedId={selectedImageId}
                onClose={() => setSelectedImageId(null)}
            />
        </main>
    )
}
