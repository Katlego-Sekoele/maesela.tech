import { useState, useRef } from 'react';

export default function UploadSection({ adminPassword }) {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    setResult(null);
    setError(null);

    const form = new FormData();
    form.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'x-admin-password': adminPassword },
        body: form,
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data.pathname);
      } else {
        setError(data.error ?? 'Upload failed.');
      }
    } catch {
      setError('Upload failed.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  return (
    <section className="admin-section">
      <h2 className="admin-section__title">upload image</h2>
      <div
        className="admin-dropzone"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
      >
        <p className="muted-text">
          {uploading ? 'uploading...' : 'drag & drop or click to select'}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => handleUpload(e.target.files?.[0])}
        />
      </div>
      {result && (
        <p className="admin-success">uploaded: <code>{result}</code></p>
      )}
      {error && <p className="admin-error">{error}</p>}
    </section>
  );
}
