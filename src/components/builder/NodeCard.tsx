import type { ReactNode } from 'react'

interface NodeCardProps {
  title: string
  children?: ReactNode
}

export function NodeCard({ title, children }: NodeCardProps) {
  return (
    <article className="node-card">
      <strong>{title}</strong>
      {children}
    </article>
  )
}
