import type { NodeTypes } from 'reactflow'
import { nodeRegistry } from '../registry'

// ─── React components ────────────────────────────────────────────────────────
export { InputNode } from './InputNode'
export { OutputNode } from './OutputNode'
export { LogicNode } from './LogicNode'
export { DisplayNode } from './DisplayNode'
export { EventNode } from './EventNode'

// ─── React Flow nodeTypes map ─────────────────────────────────────────────────
import { InputNode } from './InputNode'
import { OutputNode } from './OutputNode'
import { LogicNode } from './LogicNode'
import { DisplayNode } from './DisplayNode'
import { EventNode } from './EventNode'

export const nodeTypes: NodeTypes = {
    'lm-input': InputNode,
    'lm-output': OutputNode,
    'lm-logic': LogicNode,
    'lm-display': DisplayNode,
    'lm-event': EventNode,
}

// ─── Execution definitions ────────────────────────────────────────────────────
nodeRegistry.register({
    type: 'lm-input',
    label: 'Input',
    description: 'Static text or number value injected into the graph.',
    color: '#4f86c6',
    inputs: [],
    outputs: [{ id: 'value', label: 'Value', valueType: 'any' }],
    defaultData: { label: 'Input', value: '' },
    scriptHooks: ['load'],
    async execute(_inputs, data) {
        return { value: (data.value as string) ?? '' }
    },
})

nodeRegistry.register({
    type: 'lm-output',
    label: 'Output',
    description: 'Displays the final value that exits the graph.',
    color: '#e07b54',
    inputs: [{ id: 'value', label: 'Value', valueType: 'any' }],
    outputs: [],
    defaultData: { label: 'Output' },
    scriptHooks: ['receive'],
    async execute(inputs) {
        return { value: inputs['value'] ?? null }
    },
})

nodeRegistry.register({
    type: 'lm-logic',
    label: 'Logic',
    description: 'Runs a LoomScript; set `output` to pass a value downstream.',
    color: '#7b5ea7',
    inputs: [{ id: 'input', label: 'Input', valueType: 'any' }],
    outputs: [{ id: 'output', label: 'Output', valueType: 'any' }],
    defaultData: { label: 'Logic', script: '' },
    scriptHooks: ['load', 'receive'],
    async execute(inputs, _data, ctx) {
        // The script is run separately in graphEngine via runScript();
        // here we just forward the input so downstream nodes have a base value.
        const out = ctx.getVariable('output') ?? inputs['input'] ?? null
        return { output: out }
    },
})

nodeRegistry.register({
    type: 'lm-display',
    label: 'Display',
    description: 'Renders an incoming value and any `show` output from scripts.',
    color: '#3e9b6b',
    inputs: [{ id: 'value', label: 'Value', valueType: 'any' }],
    outputs: [],
    defaultData: { label: 'Display', assetUrls: [] },
    scriptHooks: ['receive'],
    async execute(inputs) {
        return { value: inputs['value'] ?? null }
    },
})

nodeRegistry.register({
    type: 'lm-event',
    label: 'Event',
    description: 'Fires a named event that scripts can listen for with `on`.',
    color: '#c9a227',
    inputs: [],
    outputs: [{ id: 'trigger', label: 'Trigger', valueType: 'boolean' }],
    defaultData: { label: 'Event', eventName: 'load' },
    scriptHooks: [],
    async execute() {
        return { trigger: true }
    },
})
