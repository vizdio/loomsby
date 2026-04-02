import type { NodeTypeDefinition } from './types'

class NodeRegistry {
    private readonly defs = new Map<string, NodeTypeDefinition>()

    register<TData extends Record<string, unknown>>(def: NodeTypeDefinition<TData>): void {
        this.defs.set(def.type, def as NodeTypeDefinition)
    }

    get(type: string): NodeTypeDefinition | undefined {
        return this.defs.get(type)
    }

    getAll(): NodeTypeDefinition[] {
        return Array.from(this.defs.values())
    }
}

export const nodeRegistry = new NodeRegistry()
