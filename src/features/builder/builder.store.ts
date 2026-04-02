import { create } from 'zustand'
import type { Edge, Node } from 'reactflow'

interface BuilderState {
    nodes: Node[]
    edges: Edge[]
    setNodes: (nodes: Node[]) => void
    setEdges: (edges: Edge[]) => void
}

export const useBuilderStore = create<BuilderState>((set) => ({
    nodes: [],
    edges: [],
    setNodes: (nodes) => set({ nodes }),
    setEdges: (edges) => set({ edges }),
}))
