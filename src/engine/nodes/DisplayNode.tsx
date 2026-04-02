import { Handle, Position, type NodeProps } from 'reactflow'
import { useBuilderStore } from '../../features/builder/builder.store'

export interface DisplayNodeData {
    label: string
}

export function DisplayNode({ id, data, selected }: NodeProps<DisplayNodeData>) {
    const result = useBuilderStore((s) => s.executionResult)
    const lines = result?.displayOutputs[id] ?? []
    const inVal = result?.nodeOutputs[id]?.value

    return (
        <div className={`lm-node lm-node--display${selected ? ' lm-node--selected' : ''}`}>
            <Handle type="target" position={Position.Left} id="value" />
            <div className="lm-node__header" style={{ background: '#3e9b6b' }}>
                {data.label || 'Display'}
            </div>
            <div className="lm-node__body lm-node__body--display">
                {inVal !== undefined && <span className="lm-node__value">{String(inVal)}</span>}
                {lines.map((line, i) => (
                    <div key={i} className="lm-node__output-line">
                        {line}
                    </div>
                ))}
                {inVal === undefined && lines.length === 0 && (
                    <span className="lm-node__placeholder">no output yet</span>
                )}
            </div>
        </div>
    )
}
