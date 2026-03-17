import { useEffect } from 'react';
import PhotoGallery from './PhotoGallery';

export default function ETC() {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => document.head.removeChild(meta);
  }, []);

  return <PhotoGallery />;
}
