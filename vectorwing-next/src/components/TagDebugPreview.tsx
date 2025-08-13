'use client'

import React, { useEffect, useMemo, useRef } from 'react'

type Item = { id: string; title: string; tags?: string[] }
type Tag = { id: string; label: string; color: string; icon?: string }

export default function TagDebugPreview({ item, tags, onOpen }: { item: Item; tags: Tag[]; onOpen?: (id: string) => void }) {
  const html = useMemo(() => buildHtml(item, tags), [item, tags])
  const htmlRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // Debug logs for font and DOM
    // eslint-disable-next-line no-console
    console.log('[TagDebugPreview] item', item)
    // eslint-disable-next-line no-console
    console.log('[TagDebugPreview] availableTags', tags)
    // eslint-disable-next-line no-console
    console.log('[TagDebugPreview] html', html)
    const el = htmlRef.current
    if (el) {
      const firstIcon = el.querySelector('.fa-solid') as HTMLElement | null
      if (firstIcon) {
        // eslint-disable-next-line no-console
        console.log('[TagDebugPreview] firstIcon classes', firstIcon.className)
        // eslint-disable-next-line no-console
        console.log('[TagDebugPreview] firstIcon computed font-family', window.getComputedStyle(firstIcon).fontFamily)
      } else {
        // eslint-disable-next-line no-console
        console.log('[TagDebugPreview] no .fa-solid element found in HTML preview')
      }
    }
  }, [html, item, tags])

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <div>
        <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>HTML preview</div>
        <div
          ref={htmlRef}
          style={tileStyle}
          role="button"
          onDoubleClick={() => onOpen?.(item.id)}
          title="Double‑click to edit"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
      <div>
        <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>JSX preview</div>
        <div style={tileStyle} role="button" onDoubleClick={() => onOpen?.(item.id)} title="Double‑click to edit">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            {(item.tags || []).map((tid) => {
              const t = tags.find((x) => x.id === tid)
              if (!t) return null
              return <span key={tid} className={`fa-solid ${t.icon || 'fa-circle'}`} aria-hidden="true" style={{ color: t.color }} />
            })}
            <span>{item.title}</span>
          </span>
        </div>
      </div>
    </div>
  )
}

function buildHtml(item: Item, tags: Tag[]) {
  const tagsHtml = (item.tags || [])
    .map((tid) => {
      const t = tags.find((x) => x.id === tid)
      if (!t) return ''
      const iconHtml = `<span class='fa-solid ${t.icon || 'fa-circle'}' aria-hidden='true'></span>`
      return `<span class='tag-pill' style='color:${t.color}'>${iconHtml}</span>`
    })
    .join('')
  const safeTitle = escapeHtml(item.title)
  return `<span class='tag-row'>${tagsHtml}<span class='tag-title'>${safeTitle}</span></span>`
}

function escapeHtml(text: string) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

const tileStyle: React.CSSProperties = {
  display: 'inline-block',
  background: 'rgba(56,189,248,0.18)',
  border: '2px solid #38bdf8',
  padding: '2px 8px',
  borderRadius: 8,
  fontWeight: 700,
}


