'use client'

import React from 'react'

export type Tag = { id: string; label: string; color: string; icon?: string }
export type Status = 'Planned' | 'Authorized' | 'Canceled'

export default function TagTile({ title, tagIds, tags, status = 'Planned' }: { title: string; tagIds?: string[]; tags: Tag[]; status?: Status }) {
  const resolved = (tagIds || []).map((tid) => tags.find((t) => t.id === tid)).filter(Boolean) as Tag[]
  const style = styleForStatus(status)
  return (
    <div style={style.container}>
      <span style={style.innerRow as React.CSSProperties}>
        {resolved.map((t) => (
          <span key={t.id} className={`fa-solid ${t.icon || 'fa-circle'}`} aria-hidden="true" style={{ color: t.color }} />
        ))}
        <span>{title}</span>
      </span>
    </div>
  )
}

function styleForStatus(status: Status) {
  const map = {
    Planned: { bg: 'rgba(56,189,248,0.18)', border: '#38bdf8' },
    Authorized: { bg: 'rgba(34,197,94,0.18)', border: '#22c55e' },
    Canceled: { bg: 'rgba(245,158,11,0.15)', border: '#f59e0b' },
  }[status]
  return {
    container: {
      display: 'inline-block',
      background: map.bg,
      border: `2px solid ${map.border}`,
      padding: '2px 8px',
      borderRadius: 8,
      fontWeight: 700,
    } as React.CSSProperties,
    innerRow: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
    },
  }
}


