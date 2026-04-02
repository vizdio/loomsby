import { useState } from 'react'
import { ImageUploader } from '../components/images/ImageUploader'
import { ImageGrid } from '../components/images/ImageGrid'
import { ImageLightbox } from '../components/images/ImageLightbox'

export function ProfilePage() {
  const [images, setImages] = useState<string[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  return (
    <main className="page stack">
      <section className="card stack">
        <h2>Profile Media</h2>
        <ImageUploader
          folder="profiles"
          onUploaded={(url) => {
            setImages((current) => [url, ...current])
          }}
        />
      </section>
      <section className="card stack">
        <h3>Uploaded Images</h3>
        <ImageGrid images={images} onSelect={setSelectedImage} />
      </section>
      <ImageLightbox imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />
    </main>
  )
}
