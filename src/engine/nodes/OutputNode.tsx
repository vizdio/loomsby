import { Handle, Position, type NodeProps } from 'reactflow'
import { useBuilderStore } from '../../features/builder/builder.store'

export interface OutputNodeData {
    label: string
}

export function OutputNode({ id, data, selected }: NodeProps<OutputNodeData>) {
    const result = useBuilderStore((s) => s.executionResult)
    const received = result?.nodeOutputs[id]?.value

    return (
        <div className={`lm-node lm-node--output${selected ? ' lm-node--selected' : ''}`}>
            <Handle type="target" position={Position.Left} id="value" />
            <div className="lm-node__header" style={{ background: '#e07b54' }}>
                {data.label || 'Output'}
            </div>
            <div className="lm-node__body">
                {received !== undefined ? (
                    <span className="lm-node__value">{String(received)}</span>
                ) : (
                    <span className="lm-node__placeholder">awaiting input</span>
                )}
            </div>
        </div>
    )
}
