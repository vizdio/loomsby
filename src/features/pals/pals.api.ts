import { supabase } from '../../lib/supabase'
import type { Pal, Profile } from '../../lib/types'

async function searchUsers(query: string, currentUserId: string): Promise<Profile[]> {
  if (!query.trim()) return []

  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, full_name, avatar_url, bio, created_at')
    .neq('id', currentUserId)
    .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
    .limit(20)

  if (error) throw error
  return (data ?? []) as Profile[]
}

async function sendRequest(addresseeId: string): Promise<void> {
  const { error } = await supabase.from('pals').insert({ addressee_id: addresseeId, status: 'pending' })
  if (error) throw error
}

async function listPals(userId: string): Promise<Pal[]> {
  const { data, error } = await supabase
    .from('pals')
    .select('*')
    .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as Pal[]
}

async function updateStatus(palId: string, status: Pal['status']): Promise<void> {
  const { error } = await supabase.from('pals').update({ status }).eq('id', palId)
  if (error) throw error
}

async function removePal(palId: string): Promise<void> {
  const { error } = await supabase.from('pals').delete().eq('id', palId)
  if (error) throw error
}

export const palsApi = {
  searchUsers,
  sendRequest,
  listPals,
  updateStatus,
  removePal,
}
