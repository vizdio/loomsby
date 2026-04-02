import { nodeRegistry } from '../../engine/registry'
// Side-effect import: registers all node execution definitions
import '../../engine/nodes/index'

export function NodePalette({ onAdd }: { onAdd: (type: string) => void }) {
    const defs = nodeRegistry.getAll()

    return (
        <aside className="card stack builder-palette">
            <h3>Palette</h3>
            {defs.map((def) => (
                <button
                    key={def.type}
                    className="btn-secondary palette-btn"
                    onClick={() => onAdd(def.type)}
                    title={def.description}
                >
                    <span className="palette-dot" style={{ background: def.color }} />
                    {def.label}
                </button>
            ))}
        </aside>
    )
}
