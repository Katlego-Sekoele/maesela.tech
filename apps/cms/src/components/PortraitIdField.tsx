'use client'
import React from 'react'
import { useField } from '@payloadcms/ui'

/**
 * Text field for the About-page portrait's photo id, with a live preview
 * (via the same-origin /api/site/photo proxy, which allows logged-in admins
 * to view any photo regardless of its sensitive flag).
 */
export const PortraitIdField: React.FC<{ path?: string }> = (props) => {
  const path = props.path || 'portraitId'
  const { value, setValue } = useField<string>({ path })

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>Portrait photo ID</label>
      <p style={{ margin: '0 0 8px', opacity: 0.7, fontSize: 13 }}>
        Find the ID in Gallery → Photos → open a photo (it&apos;s in the URL, e.g.{' '}
        <code>/admin/collections/photos/258</code> → <code>258</code>).
      </p>
      <input
        type="text"
        inputMode="numeric"
        value={value ?? ''}
        onChange={(e) => setValue(e.target.value)}
        placeholder="e.g. 258"
        style={{ maxWidth: 220 }}
      />
      {value ? (
        <div style={{ marginTop: 10 }}>
          <img
            src={`/api/site/photo?id=${value}&w=500&q=78`}
            alt=""
            style={{
              maxWidth: '100%',
              maxHeight: 280,
              borderRadius: 8,
              border: '1px solid var(--theme-elevation-150)',
              display: 'block',
            }}
            onError={(e) => {
              ;(e.currentTarget as HTMLImageElement).style.display = 'none'
            }}
          />
        </div>
      ) : null}
    </div>
  )
}
