'use client'

import React from 'react'

export type Tag = { id: string; label: string; color: string; icon?: string }

export default function TagInline({ title, tagIds, tags }: { title: string; tagIds?: string[]; tags: Tag[] }) {
  const resolved = (tagIds || []).map((tid) => tags.find((t) => t.id === tid)).filter(Boolean) as Tag[]
  return (
    <span className="tag-row" style={{ pointerEvents: 'none' }}>
      {resolved.map((t) => (
        <span key={t.id} className="tag-pill" style={{ color: t.color }}>
          <span className={`fa-solid ${t.icon || 'fa-circle'}`} aria-hidden="true" />
        </span>
      ))}
      <span className="tag-title">{title}</span>
    </span>
  )
}


