'use client'
import React, { useState } from 'react'

/**
 * Drag-and-drop / file-picker uploader shown above the Photos list. Posts each
 * file to the admin-only /api/site/admin/photos endpoint (which pushes to the
 * private Blob store and creates a `photos` doc), then reloads the list.
 */
export const PhotoUploader: React.FC = () => {
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleFiles = async (fileList: FileList | null) => {
    const files = Array.from(fileList || [])
    if (!files.length) return
    setBusy(true)
    setMessage(null)
    let uploaded = 0
    for (const file of files) {
      const body = new FormData()
      body.append('file', file)
      body.append('sensitive', 'true')
      try {
        const res = await fetch('/api/site/admin/photos', {
          method: 'POST',
          body,
          credentials: 'include',
        })
        if (res.ok) uploaded++
      } catch {
        /* continue with remaining files */
      }
    }
    setBusy(false)
    setMessage(
      uploaded === files.length
        ? `Uploaded ${uploaded} photo${uploaded === 1 ? '' : 's'}.`
        : `Uploaded ${uploaded}/${files.length} — some failed.`,
    )
    if (uploaded > 0) setTimeout(() => window.location.reload(), 900)
  }

  return (
    <div
      style={{
        margin: '1rem 0 1.5rem',
        padding: '1rem 1.25rem',
        border: '1px dashed var(--theme-elevation-250)',
        borderRadius: 6,
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault()
        handleFiles(e.dataTransfer.files)
      }}
    >
      <p style={{ margin: '0 0 0.4rem', fontWeight: 600 }}>Upload photos</p>
      <p style={{ margin: '0 0 0.75rem', opacity: 0.7, fontSize: 13 }}>
        Drag & drop images here, or choose files. New photos default to sensitive
        (password-gated) — toggle per-photo after upload.
      </p>
      <input
        type="file"
        accept="image/*"
        multiple
        disabled={busy}
        onChange={(e) => handleFiles(e.target.files)}
      />
      {busy && <p style={{ marginTop: 8 }}>Uploading…</p>}
      {message && !busy && <p style={{ marginTop: 8 }}>{message}</p>}
    </div>
  )
}
