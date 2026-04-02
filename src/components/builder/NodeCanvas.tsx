import React, { useCallback } from 'react'
import {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Background,
    Controls,
    MiniMap,
    ReactFlow,
    type Connection,
    type Edge,
    type EdgeChange,
    type Node,
    type NodeChange,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useQuery } from '@tanstack/react-query'
import { builderApi } from '../../features/builder/builder.api'
import { executeGraph } from '../../engine/graphEngine'
import { nodeTypes } from '../../engine/nodes/index'
import { nodeRegistry } from '../../engine/registry'
import { useBuilderStore } from '../../features/builder/builder.store'
import { GraphToolbar } from './GraphToolbar'
import { NodePalette } from './NodePalette'
import { GraphSidebar } from './GraphSidebar'
import type { NodeGraph } from '../../lib/types'

export function NodeCanvas() {
    const {
        nodes,
        edges,
        setNodes,
        setEdges,
        selectNode,
        pushHistory,
        undo,
        redo,
        isRunning,
        setRunning,
        setExecutionResult,
    } = useBuilderStore()

    const { data: graphs = [], refetch } = useQuery({
        queryKey: ['node-graphs'],
        queryFn: builderApi.listGraphs,
    })

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes(applyNodeChanges(changes, nodes)),
        [nodes, setNodes],
    )

    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges(applyEdgeChanges(changes, edges)),
        [edges, setEdges],
    )

    const onConnect = useCallback(
        (connection: Connection | Edge) => {
            pushHistory()
            setEdges(addEdge(connection, edges))
        },
        [edges, setEdges, pushHistory],
    )

    const onNodeClick = useCallback(
        (_: React.MouseEvent, node: Node) => selectNode(node.id),
        [selectNode],
    )

    const onPaneClick = useCallback(() => selectNode(null), [selectNode])

    const addNode = (type: string) => {
        pushHistory()
        const def = nodeRegistry.get(type)
        const id = `${type}-${crypto.randomUUID().slice(0, 6)}`
        setNodes([
            ...nodes,
            {
                id,
                type,
                position: { x: 160 + nodes.length * 28, y: 120 + nodes.length * 22 },
                data: { ...(def?.defaultData ?? { label: type }) },
            },
        ])
    }

    const onExecute = async () => {
        setRunning(true)
        setExecutionResult(null)
        try {
            const result = await executeGraph(nodes, edges)
            setExecutionResult(result)
        } finally {
            setRunning(false)
        }
    }

    const saveGraph = async () => {
        await builderApi.saveGraph('Untitled Graph', {
            nodes: nodes as unknown as NodeGraph['graph']['nodes'],
            edges: edges as unknown as NodeGraph['graph']['edges'],
        })
        await refetch()
    }

    const loadGraph = (graph: NodeGraph) => {
        pushHistory()
        setNodes(graph.graph.nodes as unknown as Node[])
        setEdges(graph.graph.edges as unknown as Edge[])
    }

    return (
        <section className="builder-layout">
            <NodePalette onAdd={addNode} />
            <div className="builder-main">
                <GraphToolbar
                    onExecute={() => {
                        void onExecute()
                    }}
                    onSave={() => {
                        void saveGraph()
                    }}
                    onUndo={undo}
                    onRedo={redo}
                    isRunning={isRunning}
                />
                <div className="canvas-wrap">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        nodeTypes={nodeTypes}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onNodeClick={onNodeClick}
                        onPaneClick={onPaneClick}
                        fitView
                    >
                        <MiniMap />
                        <Controls />
                        <Background />
                    </ReactFlow>
                </div>
            </div>
            <GraphSidebar graphs={graphs} onLoad={loadGraph} />
        </section>
    )
}
