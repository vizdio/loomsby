export function ImageGrid({ images, onSelect }: { images: string[]; onSelect: (url: string) => void }) {
  return (
    <div className="image-grid">
      {images.map((url) => (
        <button key={url} className="image-tile" onClick={() => onSelect(url)}>
          <img src={url} alt="Shared" />
        </button>
      ))}
    </div>
  )
}
