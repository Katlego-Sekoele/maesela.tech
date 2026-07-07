import { useEffect, useState } from 'react';
import PhotoGallery from './PhotoGallery';
import ArticleList from './ArticleList';
import GalleryAuth from './GalleryAuth';

export default function ETC() {
  const [token, setToken] = useState(() => sessionStorage.getItem('gallery_token'));

  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow, noarchive, noimageindex, nosnippet';
    document.head.appendChild(meta);
    return () => document.head.removeChild(meta);
  }, []);

  const handleAuthExpired = () => {
    sessionStorage.removeItem('gallery_token');
    setToken(null);
  };

  const handleUnlock = (t) => {
    sessionStorage.setItem('gallery_token', t);
    setToken(t);
  };

  return (
    <div className="page page--wide etc-page">
      <ArticleList />

      {/* Public photos show to everyone; the password unlocks sensitive ones. */}
      <PhotoGallery token={token} onAuthExpired={handleAuthExpired} />

      {!token && (
        <div className="gallery-unlock">
          <p className="gallery-unlock__label muted-text">
            Some photos are private. Enter the gallery password to see them.
          </p>
          <GalleryAuth onSuccess={handleUnlock} />
        </div>
      )}
    </div>
  );
}
