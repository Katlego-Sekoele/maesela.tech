import { useState, useEffect } from 'react';

const fmt = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' });

export default function PasswordsSection({ adminPassword, onUnauth }) {
  const [passwords, setPasswords] = useState([]);
  const [label, setLabel] = useState('');
  const [saving, setSaving] = useState(false);
  const [newPassword, setNewPassword] = useState(null);
  const [error, setError] = useState(null);

  const authHeader = { 'x-admin-password': adminPassword };
  const jsonHeaders = { ...authHeader, 'Content-Type': 'application/json' };

  const load = async () => {
    const res = await fetch('/api/admin/passwords', { headers: authHeader });
    if (res.status === 401) { onUnauth(); return; }
    const data = await res.json();
    setPasswords(data.passwords ?? []);
  };

  useEffect(() => { load(); }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    setNewPassword(null);
    try {
      const res = await fetch('/api/admin/passwords', {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify({ label }),
      });
      if (res.status === 401) { onUnauth(); return; }
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? 'Failed to generate password.');
        return;
      }
      const data = await res.json();
      setNewPassword(data.password);
      setLabel('');
      await load();
    } catch {
      setError('Failed to generate password.');
    } finally {
      setSaving(false);
    }
  };

  const handleRevoke = async (id) => {
    const res = await fetch('/api/admin/passwords', {
      method: 'DELETE',
      headers: jsonHeaders,
      body: JSON.stringify({ id }),
    });
    if (res.status === 401) { onUnauth(); return; }
    if (res.ok) await load();
  };

  return (
    <section className="admin-section">
      <h2 className="admin-section__title">gallery passwords</h2>

      {newPassword && (
        <div className="admin-callout">
          <p className="admin-callout__label">new password (copy now — not shown again)</p>
          <code className="admin-callout__code">{newPassword}</code>
          <button className="admin-btn" onClick={() => setNewPassword(null)}>dismiss</button>
        </div>
      )}

      <form className="admin-form admin-form--row" onSubmit={handleGenerate}>
        <input
          className="admin-input"
          type="text"
          placeholder="label (e.g. shared with family)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          required
        />
        <button className="admin-btn" type="submit" disabled={saving}>
          {saving ? '...' : 'generate'}
        </button>
        {error && <p className="admin-error">{error}</p>}
      </form>

      <div className="admin-list">
        {passwords.map((p) => (
          <div key={p.id} className="admin-list__item">
            <div className="admin-list__item-info">
              <span className="admin-list__item-title">{p.label}</span>
              <span className="muted-text admin-list__item-meta">
                {fmt.format(new Date(p.createdAt))}
                {p.revokedAt && ' · revoked'}
              </span>
            </div>
            {!p.revokedAt && (
              <button className="admin-btn admin-btn--danger" onClick={() => handleRevoke(p.id)}>
                revoke
              </button>
            )}
          </div>
        ))}
        {!passwords.length && <p className="muted-text">no passwords yet</p>}
      </div>
    </section>
  );
}
