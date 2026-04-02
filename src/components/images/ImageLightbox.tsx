interface ImageLightboxProps {
  imageUrl: string | null
  onClose: () => void
}

export function ImageLightbox({ imageUrl, onClose }: ImageLightboxProps) {
  if (!imageUrl) return null

  return (
    <div className="lightbox" role="dialog" aria-modal="true">
      <button className="btn-secondary" onClick={onClose}>Close</button>
      <img src={imageUrl} alt="Expanded" />
    </div>
  )
}
