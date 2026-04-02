import { NODE_TYPES } from '../../lib/constants'

export function NodePalette({ onAdd }: { onAdd: (type: string) => void }) {
  return (
    <aside className="card stack">
      <h3>Palette</h3>
      {Object.values(NODE_TYPES).map((type) => (
        <button key={type} className="btn-secondary" onClick={() => onAdd(type)}>
          Add {type}
        </button>
      ))}
    </aside>
  )
}
