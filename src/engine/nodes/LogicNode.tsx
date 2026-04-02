import { Handle, Position, type NodeProps } from 'reactflow'
import { useBuilderStore } from '../../features/builder/builder.store'

export interface LogicNodeData {
    label: string
    script: string
}

export function LogicNode({ id, data, selected }: NodeProps<LogicNodeData>) {
    const result = useBuilderStore((s) => s.executionResult)
    const outVal = result?.nodeOutputs[id]?.output

    const preview = (data.script || '').split('\n').slice(0, 2).join(' ').slice(0, 60)

    return (
        <div className={`lm-node lm-node--logic${selected ? ' lm-node--selected' : ''}`}>
            <Handle type="target" position={Position.Left} id="input" />
            <div className="lm-node__header" style={{ background: '#7b5ea7' }}>
                {data.label || 'Logic'}
            </div>
            <div className="lm-node__body">
                <code className="lm-node__script-preview">{preview || <em>no script</em>}</code>
                {outVal !== undefined && (
                    <span className="lm-node__runtime">out: {String(outVal)}</span>
                )}
            </div>
            <Handle type="source" position={Position.Right} id="output" />
        </div>
    )
}
