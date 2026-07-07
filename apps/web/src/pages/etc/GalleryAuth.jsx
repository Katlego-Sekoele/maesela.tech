import { useState } from 'react';

export default function GalleryAuth({ onSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        const { token } = await res.json();
        sessionStorage.setItem('gallery_token', token);
        onSuccess(token);
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
    <div className="gallery-auth">
      <form className="gallery-auth__form" onSubmit={handleSubmit}>
        <p className="gallery-auth__label muted-text">password required</p>
        <div className="gallery-auth__row">
          <input
            className="gallery-auth__input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="enter password"
            autoComplete="current-password"
            disabled={loading}
          />
          <button
            className="gallery-auth__btn"
            type="submit"
            disabled={loading || !password}
          >
            {loading ? '...' : 'enter'}
          </button>
        </div>
        {error && <p className="gallery-auth__error">{error}</p>}
      </form>
    </div>
  );
}
