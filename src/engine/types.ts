import type { PrimValue } from './script/types'

export type NodeValueType = 'string' | 'number' | 'boolean' | 'any'

export interface NodePort {
    id: string
    label: string
    valueType: NodeValueType
}

export interface ExecutionContext {
    getVariable: (name: string) => PrimValue
    setVariable: (name: string, value: PrimValue) => void
    emitLog: (message: string) => void
    emitOutput: (nodeId: string, message: string) => void
}

export interface NodeTypeDefinition<
    TData extends Record<string, unknown> = Record<string, unknown>,
> {
    /** Unique identifier used as the React Flow node `type`. */
    type: string
    label: string
    description: string
    /** Tailwind-compatible hex colour used for the node header. */
    color: string
    inputs: NodePort[]
    outputs: NodePort[]
    defaultData: TData
    /** Event names that scripts can attach `on <event>` handlers to. */
    scriptHooks: string[]
    execute: (
        inputs: Record<string, PrimValue>,
        data: TData,
        ctx: ExecutionContext,
    ) => Promise<Record<string, PrimValue>>
}

export interface GraphExecutionResult {
    /** nodeId → { portId → value } collected outputs */
    nodeOutputs: Record<string, Record<string, PrimValue>>
    /** show / log lines accumulated across all nodes */
    logs: string[]
    /** nodeId → lines emitted by show statements */
    displayOutputs: Record<string, string[]>
    error?: string
}
