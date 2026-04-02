import { useQuery } from '@tanstack/react-query'
import { palsApi } from '../../features/pals/pals.api'
import { PalsStatusBadge } from './PalsStatusBadge'

export function PalsList({ userId }: { userId: string }) {
    const { data, refetch } = useQuery({
        queryKey: ['pals', userId],
        queryFn: () => palsApi.listPals(userId),
        enabled: Boolean(userId),
    })

    return (
        <section className="card stack">
            <h3>Connections</h3>
            {(data ?? []).map((pal) => (
                <article key={pal.id} className="row spread wrap">
                    <div className="row gap-sm">
                        <span>{pal.requester_id === userId ? 'Outgoing' : 'Incoming'}</span>
                        <PalsStatusBadge status={pal.status} />
                    </div>
                    <div className="row gap-sm">
                        {pal.status === 'pending' && (
                            <>
                                <button
                                    onClick={async () => {
                                        await palsApi.updateStatus(pal.id, 'accepted')
                                        await refetch()
                                    }}
                                >
                                    Accept
                                </button>
                                <button
                                    className="btn-secondary"
                                    onClick={async () => {
                                        await palsApi.removePal(pal.id)
                                        await refetch()
                                    }}
                                >
                                    Decline
                                </button>
                            </>
                        )}
                        {pal.status === 'accepted' && (
                            <>
                                <button
                                    className="btn-secondary"
                                    onClick={async () => {
                                        await palsApi.removePal(pal.id)
                                        await refetch()
                                    }}
                                >
                                    Remove
                                </button>
                                <button
                                    className="btn-danger"
                                    onClick={async () => {
                                        await palsApi.updateStatus(pal.id, 'blocked')
                                        await refetch()
                                    }}
                                >
                                    Block
                                </button>
                            </>
                        )}
                    </div>
                </article>
            ))}
        </section>
    )
}
