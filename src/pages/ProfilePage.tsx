import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ImageUploader } from '../components/images/ImageUploader'
import { ImageGrid } from '../components/images/ImageGrid'
import { ImageLightbox } from '../components/images/ImageLightbox'
import type { ImageRecord } from '../lib/types'
import { IMAGE_CONTEXTS } from '../lib/constants'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { imagesApi } from '../features/images/images.api'

export function ProfilePage() {
    const { user } = useAuth()
    const [selectedImageId, setSelectedImageId] = useState<string | null>(null)

    const { data: images = [], refetch: refetchImages } = useQuery({
        queryKey: ['images', 'profile', user?.id],
        queryFn: () => imagesApi.listMyImagesByContext(IMAGE_CONTEXTS.profile),
        enabled: Boolean(user?.id),
    })

    const handleUploaded = async (image: ImageRecord) => {
        if (!user) return
        if (image.context !== IMAGE_CONTEXTS.profile) return

        const { error } = await supabase
            .from('profiles')
            .update({ avatar_url: image.url })
            .eq('id', user.id)
        if (error) throw error

        await refetchImages()
    }

    const handleDeleteImage = async (image: ImageRecord) => {
        await imagesApi.deleteImage(image)
        if (selectedImageId === image.id) {
            setSelectedImageId(null)
        }
        await refetchImages()
    }

    return (
        <main className="page stack">
            <section className="card stack">
                <h2>Profile Media</h2>
                <ImageUploader
                    uploadParams={{
                        context: IMAGE_CONTEXTS.profile,
                        makePublic: false,
                    }}
                    onUploaded={({ image }) => {
                        void handleUploaded(image)
                    }}
                />
            </section>
            <section className="card stack">
                <h3>Uploaded Images</h3>
                <ImageGrid
                    images={images}
                    onSelect={setSelectedImageId}
                    onDelete={(image) => {
                        void handleDeleteImage(image)
                    }}
                />
            </section>
            <ImageLightbox
                images={images}
                selectedId={selectedImageId}
                onClose={() => setSelectedImageId(null)}
            />
        </main>
    )
}
