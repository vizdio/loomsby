import { Handle, Position, type NodeProps } from 'reactflow'
import { useBuilderStore } from '../../features/builder/builder.store'

export interface InputNodeData {
    label: string
    value: string
}

export function InputNode({ id, data, selected }: NodeProps<InputNodeData>) {
    const result = useBuilderStore((s) => s.executionResult)
    const output = result?.nodeOutputs[id]?.value

    return (
        <div className={`lm-node lm-node--input${selected ? ' lm-node--selected' : ''}`}>
            <div className="lm-node__header" style={{ background: '#4f86c6' }}>
                {data.label || 'Input'}
            </div>
            <div className="lm-node__body">
                <span className="lm-node__value">{data.value || <em>empty</em>}</span>
                {output !== undefined && (
                    <span className="lm-node__runtime">→ {String(output)}</span>
                )}
            </div>
            <Handle type="source" position={Position.Right} id="value" />
        </div>
    )
}
