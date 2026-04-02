import { supabase } from '../../lib/supabase'
import type { NodeGraph } from '../../lib/types'

async function listGraphs(): Promise<NodeGraph[]> {
    const { data, error } = await supabase
        .from('node_graphs')
        .select('*')
        .order('updated_at', { ascending: false })
    if (error) throw error
    return (data ?? []) as NodeGraph[]
}

async function saveGraph(name: string, graph: NodeGraph['graph'], graphId?: string): Promise<void> {
    if (graphId) {
        const { error } = await supabase
            .from('node_graphs')
            .update({ name, graph })
            .eq('id', graphId)
        if (error) throw error
        return
    }

    const { error } = await supabase.from('node_graphs').insert({ name, graph })
    if (error) throw error
}

export const builderApi = {
    listGraphs,
    saveGraph,
}
