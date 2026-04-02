import { Handle, Position, type NodeProps } from 'reactflow'

export interface EventNodeData {
    label: string
    eventName: string
}

export function EventNode({ data, selected }: NodeProps<EventNodeData>) {
    return (
        <div className={`lm-node lm-node--event${selected ? ' lm-node--selected' : ''}`}>
            <div className="lm-node__header" style={{ background: '#c9a227' }}>
                {data.label || 'Event'}
            </div>
            <div className="lm-node__body">
                <span className="lm-node__value">on: {data.eventName || 'load'}</span>
            </div>
            <Handle type="source" position={Position.Right} id="trigger" />
        </div>
    )
}
