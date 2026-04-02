import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { palsApi } from '../../features/pals/pals.api'
import { PalsRequestButton } from './PalsRequestButton'

export function UserSearch({ currentUserId }: { currentUserId: string }) {
    const [query, setQuery] = useState('')

    const { data, isFetching } = useQuery({
        queryKey: ['user-search', currentUserId, query],
        queryFn: () => palsApi.searchUsers(query, currentUserId),
        enabled: query.trim().length > 1,
    })

    return (
        <section className="card stack">
            <h3>Find users</h3>
            <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by username or name"
            />
            {isFetching && <p>Searching...</p>}
            <div className="stack">
                {(data ?? []).map((profile) => (
                    <div key={profile.id} className="row spread wrap">
                        <span>{profile.username ?? profile.full_name ?? profile.id}</span>
                        <PalsRequestButton addresseeId={profile.id} />
                    </div>
                ))}
            </div>
        </section>
    )
}
