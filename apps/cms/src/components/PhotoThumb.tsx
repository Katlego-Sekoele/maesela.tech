'use client'
import React from 'react'
import { useDocumentInfo } from '@payloadcms/ui'

/**
 * List-view thumbnail. The <img> hits the same-origin proxy, which serves the
 * private blob to logged-in admins (see /api/site/photo). Small + lazy so the
 * list stays responsive.
 */
export const PhotoThumbCell: React.FC<{ rowData?: { id?: string | number } }> = (props) => {
  const id = props?.rowData?.id
  if (id === undefined || id === null) return <span>—</span>
  return (
    <img
      src={`/api/site/photo?id=${id}&w=96&q=55`}
      alt=""
      loading="lazy"
      style={{
        height: 46,
        width: 46,
        objectFit: 'cover',
        borderRadius: 4,
        display: 'block',
        background: 'var(--theme-elevation-100)',
      }}
    />
  )
}

/**
 * Edit-view preview shown at the top of a photo's form, so you can see the
 * image while toggling "sensitive".
 */
export const PhotoPreviewField: React.FC = () => {
  const { id } = useDocumentInfo()
  if (!id) return <p style={{ opacity: 0.6 }}>Save the photo to preview it.</p>
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <img
        src={`/api/site/photo?id=${id}&w=760&q=78`}
        alt=""
        style={{
          maxWidth: '100%',
          maxHeight: '60vh',
          borderRadius: 8,
          border: '1px solid var(--theme-elevation-150)',
          display: 'block',
        }}
      />
    </div>
  )
}
