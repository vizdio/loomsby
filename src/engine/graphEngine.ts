import type { Edge, Node } from 'reactflow'
import type { GraphExecutionResult, ExecutionContext } from './types'
import type { PrimValue } from './script/types'
import { nodeRegistry } from './registry'
import { topologicalSort } from './topologicalSort'
import { tokenize } from './script/tokenizer'
import { parse } from './script/parser'
import { interpret, triggerEvent, createContext } from './script/interpreter'

export async function executeGraph(nodes: Node[], edges: Edge[]): Promise<GraphExecutionResult> {
    const logs: string[] = []
    const displayOutputs: Record<string, string[]> = {}
    const nodeOutputs: Record<string, Record<string, PrimValue>> = {}
    const globalVars = new Map<string, PrimValue>()
    let error: string | undefined

    const order = topologicalSort(nodes, edges)

    /** Gather values arriving at a node's input handles via edges. */
    const resolveInputs = (nodeId: string): Record<string, PrimValue> => {
        const inputs: Record<string, PrimValue> = {}
        for (const edge of edges) {
            if (edge.target !== nodeId) continue
            const sourceOutputs = nodeOutputs[edge.source] ?? {}
            const value = sourceOutputs[edge.sourceHandle ?? 'value'] ?? null
            inputs[edge.targetHandle ?? 'value'] = value
        }
        return inputs
    }

    const makeContext = (_nodeId: string): ExecutionContext => ({
        getVariable: (name) => globalVars.get(name) ?? null,
        setVariable: (name, value) => {
            globalVars.set(name, value)
        },
        emitLog: (msg) => {
            logs.push(msg)
        },
        emitOutput: (nid, msg) => {
            if (!displayOutputs[nid]) displayOutputs[nid] = []
            displayOutputs[nid].push(msg)
        },
    })

    /** Run the LoomScript attached to a node (if any). */
    const runScript = (nodeId: string, inputs: Record<string, PrimValue>) => {
        const node = nodes.find((n) => n.id === nodeId)
        const script = ((node?.data as Record<string, unknown>)?.script as string | undefined) ?? ''
        if (!script.trim()) return

        try {
            const ctx = createContext(inputs)
            for (const [k, v] of globalVars) ctx.variables.set(k, v)
            interpret(parse(tokenize(script)), ctx)
            triggerEvent('load', ctx)
            logs.push(...ctx.logs)
            if (ctx.outputs.length > 0) {
                if (!displayOutputs[nodeId]) displayOutputs[nodeId] = []
                displayOutputs[nodeId].push(...ctx.outputs)
            }
            for (const [k, v] of ctx.variables) globalVars.set(k, v)
        } catch (err) {
            logs.push(
                `Script error in node ${nodeId}: ${err instanceof Error ? err.message : String(err)}`,
            )
        }
    }

    for (const nodeId of order) {
        const node = nodes.find((n) => n.id === nodeId)
        if (!node) continue

        try {
            const inputs = resolveInputs(nodeId)
            const ctx = makeContext(nodeId)
            const def = nodeRegistry.get(node.type ?? '')

            const outputs: Record<string, PrimValue> = def
                ? await def.execute(inputs, node.data as Record<string, unknown>, ctx)
                : { ...inputs }

            nodeOutputs[nodeId] = outputs
            runScript(nodeId, inputs)
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err)
            logs.push(`Error executing node '${nodeId}': ${msg}`)
            error = msg
        }
    }

    return { nodeOutputs, logs, displayOutputs, error }
}
