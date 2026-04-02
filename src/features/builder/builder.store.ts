import { create } from 'zustand'
import type { Edge, Node } from 'reactflow'
import type { GraphExecutionResult } from '../../engine/types'

const HISTORY_LIMIT = 50

interface HistoryEntry {
    nodes: Node[]
    edges: Edge[]
}

interface BuilderState {
    nodes: Node[]
    edges: Edge[]
    selectedNodeId: string | null
    isRunning: boolean
    executionResult: GraphExecutionResult | null
    history: HistoryEntry[]
    historyIndex: number

    setNodes: (nodes: Node[]) => void
    setEdges: (edges: Edge[]) => void
    selectNode: (id: string | null) => void
    updateNodeData: (nodeId: string, patch: Record<string, unknown>) => void

    /** Call before any mutation you want to be undo-able. */
    pushHistory: () => void
    undo: () => void
    redo: () => void

    setRunning: (running: boolean) => void
    setExecutionResult: (result: GraphExecutionResult | null) => void
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
    nodes: [],
    edges: [],
    selectedNodeId: null,
    isRunning: false,
    executionResult: null,
    history: [],
    historyIndex: -1,

    setNodes: (nodes) => set({ nodes }),
    setEdges: (edges) => set({ edges }),

    selectNode: (id) => set({ selectedNodeId: id }),

    updateNodeData: (nodeId, patch) =>
        set((s) => ({
            nodes: s.nodes.map((n) =>
                n.id === nodeId ? { ...n, data: { ...n.data, ...patch } } : n,
            ),
        })),

    pushHistory: () =>
        set((s) => {
            const entry: HistoryEntry = { nodes: s.nodes, edges: s.edges }
            const trimmed = s.history.slice(0, s.historyIndex + 1)
            const next = [...trimmed, entry].slice(-HISTORY_LIMIT)
            return { history: next, historyIndex: next.length - 1 }
        }),

    undo: () => {
        const { history, historyIndex } = get()
        if (historyIndex < 0) return
        const entry = history[historyIndex]
        set({ nodes: entry.nodes, edges: entry.edges, historyIndex: historyIndex - 1 })
    },

    redo: () => {
        const { history, historyIndex } = get()
        const next = historyIndex + 1
        if (next >= history.length) return
        const entry = history[next]
        set({ nodes: entry.nodes, edges: entry.edges, historyIndex: next })
    },

    setRunning: (running) => set({ isRunning: running }),
    setExecutionResult: (result) => set({ executionResult: result }),
}))
