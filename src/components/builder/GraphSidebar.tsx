import { useBuilderStore } from '../../features/builder/builder.store'
import { nodeRegistry } from '../../engine/registry'
import { ScriptEditor } from './ScriptEditor'
import type { NodeGraph } from '../../lib/types'
import { ImageUploader } from '../images/ImageUploader'
import { IMAGE_CONTEXTS } from '../../lib/constants'

interface GraphSidebarProps {
    graphs: NodeGraph[]
    onLoad: (graph: NodeGraph) => void
}

export function GraphSidebar({ graphs, onLoad }: GraphSidebarProps) {
    const { nodes, selectedNodeId, updateNodeData, executionResult } = useBuilderStore()
    const selectedNode = nodes.find((n) => n.id === selectedNodeId)
    const def = selectedNode ? nodeRegistry.get(selectedNode.type ?? '') : undefined

    const data = (selectedNode?.data ?? {}) as Record<string, unknown>

    const patch = (key: string, value: unknown) => {
        if (!selectedNode) return
        updateNodeData(selectedNode.id, { [key]: value })
    }

    return (
        <aside className="card stack builder-sidebar">
            {selectedNode ? (
                <div className="stack">
                    <h3>{def?.label ?? selectedNode.type}</h3>
                    <p className="muted-text">{def?.description ?? ''}</p>

                    <label className="field-label">
                        Label
                        <input
                            className="input"
                            value={(data['label'] as string) ?? ''}
                            onChange={(e) => patch('label', e.target.value)}
                        />
                    </label>

                    {/* Input node: editable value */}
                    {selectedNode.type === 'lm-input' && (
                        <label className="field-label">
                            Value
                            <input
                                className="input"
                                value={(data['value'] as string) ?? ''}
                                onChange={(e) => patch('value', e.target.value)}
                            />
                        </label>
                    )}

                    {/* Event node: editable event name */}
                    {selectedNode.type === 'lm-event' && (
                        <label className="field-label">
                            Event name
                            <input
                                className="input"
                                value={(data['eventName'] as string) ?? 'load'}
                                onChange={(e) => patch('eventName', e.target.value)}
                            />
                        </label>
                    )}

                    {/* Script editor for nodes that support it */}
                    {def && def.scriptHooks.length > 0 && (
                        <ScriptEditor
                            value={(data['script'] as string) ?? ''}
                            onChange={(v) => patch('script', v)}
                            placeholder={`on load\n  -- write your script here\nend`}
                        />
                    )}

                    {selectedNode.type === 'lm-display' && (
                        <div className="stack">
                            <strong>Builder Assets</strong>
                            <ImageUploader
                                uploadParams={{
                                    context: IMAGE_CONTEXTS.builder,
                                }}
                                onUploaded={({ image }) => {
                                    const current =
                                        (data['assetUrls'] as string[] | undefined) ?? []
                                    patch('assetUrls', [image.url, ...current])
                                }}
                            />
                            <div className="row gap-sm wrap">
                                {((data['assetUrls'] as string[] | undefined) ?? []).map((url) => (
                                    <img
                                        key={url}
                                        className="builder-asset-thumb"
                                        src={url}
                                        alt="Builder asset"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Execution output for this node */}
                    {executionResult && (
                        <div className="stack">
                            {executionResult.displayOutputs[selectedNode.id]?.length > 0 && (
                                <div className="node-outputs">
                                    <strong>Outputs</strong>
                                    {executionResult.displayOutputs[selectedNode.id].map((l, i) => (
                                        <pre key={i} className="output-line">
                                            {l}
                                        </pre>
                                    ))}
                                </div>
                            )}
                            {executionResult.error && (
                                <pre className="error-text">{executionResult.error}</pre>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <div className="stack">
                    <h3>Saved Graphs</h3>
                    {graphs.length === 0 && <p className="muted-text">No saved graphs yet.</p>}
                    {graphs.map((graph) => (
                        <button
                            key={graph.id}
                            className="btn-secondary"
                            onClick={() => onLoad(graph)}
                        >
                            {graph.name}
                        </button>
                    ))}
                </div>
            )}
        </aside>
    )
}
