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

  return (
    <>
      <ArticleList />
      {token ? (
        <PhotoGallery token={token} onAuthExpired={handleAuthExpired} />
      ) : (
        <div className="gallery-wrapper">
          <div className="gallery-header">
            <h1 className="gallery-title">photography</h1>
          </div>
          <GalleryAuth onSuccess={setToken} />
        </div>
      )}
    </>
  );
}
