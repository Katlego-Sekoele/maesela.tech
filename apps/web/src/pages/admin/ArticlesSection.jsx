import { useState, useEffect } from 'react';

const fmt = new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric' });

export default function ArticlesSection({ adminPassword, onUnauth }) {
  const [articles, setArticles] = useState([]);
  const [form, setForm] = useState({ title: '', url: '', description: '', readDate: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const headers = { 'x-admin-password': adminPassword, 'Content-Type': 'application/json' };

  const load = async () => {
    const res = await fetch('/api/admin/articles', { headers: { 'x-admin-password': adminPassword } });
    if (res.status === 401) { onUnauth(); return; }
    const data = await res.json();
    setArticles(data.articles ?? []);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const res = await fetch('/api/admin/articles', {
        method: 'POST',
        headers,
        body: JSON.stringify(form),
      });
      if (res.status === 401) { onUnauth(); return; }
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? 'Failed to add article.');
        return;
      }
      setForm({ title: '', url: '', description: '', readDate: '' });
      await load();
    } catch {
      setError('Failed to add article.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch('/api/admin/articles', {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ id }),
    });
    if (res.status === 401) { onUnauth(); return; }
    if (res.ok) await load();
  };

  return (
    <section className="admin-section">
      <h2 className="admin-section__title">articles</h2>

      <form className="admin-form" onSubmit={handleAdd}>
        <input
          className="admin-input"
          type="text"
          placeholder="title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          className="admin-input"
          type="url"
          placeholder="url"
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          required
        />
        <input
          className="admin-input"
          type="text"
          placeholder="description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          className="admin-input"
          type="date"
          placeholder="date read"
          value={form.readDate}
          onChange={(e) => setForm({ ...form, readDate: e.target.value })}
          required
        />
        <button className="admin-btn" type="submit" disabled={saving}>
          {saving ? '...' : 'add article'}
        </button>
        {error && <p className="admin-error">{error}</p>}
      </form>

      <div className="admin-list">
        {articles.map((a) => (
          <div key={a.id} className="admin-list__item">
            <div className="admin-list__item-info">
              <a href={a.url} target="_blank" rel="noopener noreferrer" className="admin-list__item-title">
                {a.title}
              </a>
              <span className="muted-text admin-list__item-meta">
                {fmt.format(new Date(a.readDate + 'T12:00:00'))}
              </span>
            </div>
            <button className="admin-btn admin-btn--danger" onClick={() => handleDelete(a.id)}>
              delete
            </button>
          </div>
        ))}
        {!articles.length && <p className="muted-text">no articles yet</p>}
      </div>
    </section>
  );
}
