import type { PalsStatus } from '../../lib/constants'

const statusLabels: Record<PalsStatus, string> = {
  pending: 'Pending',
  accepted: 'Pal',
  blocked: 'Blocked',
}

export function PalsStatusBadge({ status }: { status: PalsStatus }) {
  return <span className={`badge ${status}`}>{statusLabels[status]}</span>
}
