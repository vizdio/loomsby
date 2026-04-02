import type { Edge, Node } from 'reactflow'

interface FlowRuntimeResult {
    output: Record<string, unknown>
}

export function executeFlow(nodes: Node[], edges: Edge[]): FlowRuntimeResult {
    const values = new Map<string, unknown>()

    for (const node of nodes) {
        if (node.type === 'input') {
            values.set(node.id, node.data?.value ?? null)
        }
    }

    for (const edge of edges) {
        const sourceValue = values.get(edge.source)
        if (sourceValue !== undefined) {
            values.set(edge.target, sourceValue)
        }
    }

    const output: Record<string, unknown> = {}
    for (const node of nodes) {
        if (node.type === 'output') {
            output[node.id] = values.get(node.id) ?? null
        }
    }

    return { output }
}
