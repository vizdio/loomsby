import type { Edge, Node } from 'reactflow'

/**
 * Kahn's algorithm — returns node IDs in execution order.
 * Any cycles are appended at the end (safety net).
 */
export function topologicalSort(nodes: Node[], edges: Edge[]): string[] {
    const inDegree = new Map<string, number>()
    const adjacency = new Map<string, string[]>()

    for (const n of nodes) {
        inDegree.set(n.id, 0)
        adjacency.set(n.id, [])
    }

    for (const edge of edges) {
        inDegree.set(edge.target, (inDegree.get(edge.target) ?? 0) + 1)
        const list = adjacency.get(edge.source) ?? []
        list.push(edge.target)
        adjacency.set(edge.source, list)
    }

    const queue = nodes.filter((n) => (inDegree.get(n.id) ?? 0) === 0).map((n) => n.id)
    const sorted: string[] = []

    while (queue.length > 0) {
        const id = queue.shift()!
        sorted.push(id)
        for (const neighbor of adjacency.get(id) ?? []) {
            const deg = (inDegree.get(neighbor) ?? 1) - 1
            inDegree.set(neighbor, deg)
            if (deg === 0) queue.push(neighbor)
        }
    }

    // Append any nodes not yet reached (cycles)
    const seen = new Set(sorted)
    for (const n of nodes) {
        if (!seen.has(n.id)) sorted.push(n.id)
    }

    return sorted
}
