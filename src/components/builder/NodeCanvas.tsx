import {
  addEdge,
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type Connection,
  type Edge,
  type Node,
  useEdgesState,
  useNodesState,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { builderApi } from '../../features/builder/builder.api'
import { executeFlow } from '../../features/builder/flow.exec'
import { GraphToolbar } from './GraphToolbar'
import { NodePalette } from './NodePalette'
import { GraphSidebar } from './GraphSidebar'
import { EdgeConnector } from './EdgeConnector'
import type { NodeGraph } from '../../lib/types'

const initialNodes: Node[] = [
  { id: 'input-1', type: 'input', position: { x: 100, y: 80 }, data: { label: 'Input', value: 'hello' } },
  { id: 'logic-1', type: 'default', position: { x: 320, y: 150 }, data: { label: 'Logic' } },
  { id: 'output-1', type: 'output', position: { x: 560, y: 220 }, data: { label: 'Output' } },
]

export function NodeCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const [runtimeOutput, setRuntimeOutput] = useState<Record<string, unknown>>({})

  const { data: graphs = [], refetch } = useQuery({
    queryKey: ['node-graphs'],
    queryFn: builderApi.listGraphs,
  })

  const flowView = useMemo(() => ({ nodes, edges }), [nodes, edges])

  const onConnect = (connection: Edge | Connection) => {
    setEdges((currentEdges) => addEdge(connection, currentEdges))
  }

  const addNode = (type: string) => {
    const id = `${type}-${crypto.randomUUID().slice(0, 6)}`
    setNodes((current) => [
      ...current,
      {
        id,
        type: type === 'logic' ? 'default' : type,
        position: { x: 140 + current.length * 24, y: 100 + current.length * 20 },
        data: { label: `${type} node` },
      },
    ])
  }

  const saveGraph = async () => {
    await builderApi.saveGraph('Untitled Graph', {
      nodes: flowView.nodes as unknown as NodeGraph['graph']['nodes'],
      edges: flowView.edges as unknown as NodeGraph['graph']['edges'],
    })
    await refetch()
  }

  const loadGraph = (graph: NodeGraph) => {
    setNodes(graph.graph.nodes as unknown as Node[])
    setEdges(graph.graph.edges as unknown as Edge[])
  }

  return (
    <section className="builder-layout">
      <NodePalette onAdd={addNode} />
      <div className="stack card">
        <GraphToolbar
          onExecute={() => {
            const result = executeFlow(nodes, edges)
            setRuntimeOutput(result.output)
          }}
          onSave={() => {
            void saveGraph()
          }}
        />
        <EdgeConnector />
        <div className="canvas-wrap">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          >
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        </div>
        <pre className="runtime-output">{JSON.stringify(runtimeOutput, null, 2)}</pre>
      </div>
      <GraphSidebar graphs={graphs} onLoad={loadGraph} />
    </section>
  )
}
