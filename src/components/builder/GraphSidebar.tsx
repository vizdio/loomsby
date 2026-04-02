import type { NodeGraph } from '../../lib/types'

interface GraphSidebarProps {
    graphs: NodeGraph[]
    onLoad: (graph: NodeGraph) => void
}

export function GraphSidebar({ graphs, onLoad }: GraphSidebarProps) {
    return (
        <aside className="card stack">
            <h3>Saved Graphs</h3>
            {graphs.map((graph) => (
                <button key={graph.id} className="btn-secondary" onClick={() => onLoad(graph)}>
                    {graph.name}
                </button>
            ))}
        </aside>
    )
}
