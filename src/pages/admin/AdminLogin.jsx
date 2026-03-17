import { useState } from 'react';

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    // Validate by making a real API call
    try {
      const res = await fetch('/api/admin/passwords', {
        headers: { 'x-admin-password': password },
      });
      if (res.ok) {
        onLogin(password);
      } else {
        setError('Incorrect password.');
        setPassword('');
      }
    } catch {
      setError('Could not connect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <h1 className="admin-login__title">admin</h1>
      <form className="admin-login__form" onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'baseline' }}>
          <input
            className="admin-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            autoComplete="current-password"
            disabled={loading}
            style={{ width: '14rem', flex: 'none' }}
          />
          <button className="admin-btn" type="submit" disabled={loading || !password}>
            {loading ? '...' : 'enter'}
          </button>
        </div>
        {error && <p className="admin-error">{error}</p>}
      </form>
    </div>
  );
}
