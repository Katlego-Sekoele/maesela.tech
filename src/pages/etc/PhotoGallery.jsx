import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import './styles.css';

const DENSITIES = [
  { label: 'Airy', cols: 2 },
  { label: 'Normal', cols: 3 },
  { label: 'Dense', cols: 5 },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.92 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

const THUMB_WIDTH = 900;
const PHOTO_PROXY_VERSION = 'orientation-fix-v3';
const PAGE_SIZE = 24;

function pseudoRandom(seed) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function scoreHeights(heights) {
  const maxHeight = Math.max(...heights);
  const minHeight = Math.min(...heights);
  let jaggedness = 0;
  for (let i = 0; i < heights.length - 1; i += 1) {
    jaggedness += Math.abs(heights[i] - heights[i + 1]);
  }

  return (maxHeight - minHeight) * 3 + jaggedness * 0.85 + maxHeight * 0.03;
}

function buildMosaicLayout(items, cols) {
  const heights = Array.from({ length: cols }, () => 0);
  const layout = new Map();

  items.forEach((photo) => {
    const scale = Number((0.8 + pseudoRandom(photo.id * 1.73) * 0.4).toFixed(3));
    const prefersWide = pseudoRandom(photo.id * 2.31 + 17) > 0.74;
    const spanOptions = [1];
    if (cols > 2 && prefersWide) spanOptions.unshift(2);

    let bestCandidate = null;

    spanOptions.forEach((colSpan) => {
      const maxStart = cols - colSpan;
      if (maxStart < 0) return;

      const baseRows = colSpan === 2 ? 21 : 17;
      const rowSpan = Math.max(13, Math.round(baseRows * scale));

      for (let startCol = 0; startCol <= maxStart; startCol += 1) {
        const impacted = heights.slice(startCol, startCol + colSpan);
        const rowStart = Math.max(...impacted) + 1;
        const nextHeights = [...heights];
        for (let i = startCol; i < startCol + colSpan; i += 1) {
          nextHeights[i] = rowStart - 1 + rowSpan;
        }

        const score = scoreHeights(nextHeights) + (rowStart - 1) * 0.08;
        if (!bestCandidate || score < bestCandidate.score) {
          bestCandidate = {
            score,
            colStart: startCol + 1,
            rowStart,
            colSpan,
            rowSpan,
            scale,
            nextHeights,
          };
        }
      }
    });

    if (!bestCandidate) return;
    layout.set(photo.id, bestCandidate);
    for (let i = 0; i < cols; i += 1) {
      heights[i] = bestCandidate.nextHeights[i];
    }
  });

  return layout;
}

function proxyUrl(blobUrl, width, quality) {
  const params = new URLSearchParams({ url: blobUrl, v: PHOTO_PROXY_VERSION });
  if (width) params.set('w', String(width));
  if (quality) params.set('q', String(quality));
  return `/api/photo?${params}`;
}

function PhotoCard({ photo, index, tile }) {
  const [requestedStage, setRequestedStage] = useState(0);
  const [loadedStages, setLoadedStages] = useState([false, false, false]);
  const lastStage = 2;
  const stageSrc = useMemo(() => ([
    proxyUrl(photo.url, 140, 24),
    proxyUrl(photo.url, 460, 52),
    proxyUrl(photo.url, THUMB_WIDTH, 84),
  ]), [photo.url]);

  useEffect(() => {
    setRequestedStage(0);
    setLoadedStages([false, false, false]);
  }, [photo.id]);

  const cardStyle = {
    gridColumn: `${tile.colStart} / span ${tile.colSpan}`,
    gridRow: `${tile.rowStart} / span ${tile.rowSpan}`,
  };

  const handleStageLoad = (loadedStage) => {
    setLoadedStages((prev) => {
      if (prev[loadedStage]) return prev;
      const next = [...prev];
      next[loadedStage] = true;
      return next;
    });

    if (loadedStage < lastStage) {
      window.setTimeout(() => {
        setRequestedStage((current) => Math.max(current, loadedStage + 1));
      }, loadedStage === 0 ? 140 : 220);
    }
  };

  const visibleStage = loadedStages[2] ? 2 : loadedStages[1] ? 1 : 0;

  return (
    <motion.div
      className="photo-card"
      variants={cardVariants}
      style={cardStyle}
    >
      <div className="photo-card__stack">
        {stageSrc.map((src, stageIndex) => (
          <img
            key={`${photo.id}-${stageIndex}`}
            src={stageIndex <= requestedStage ? src : undefined}
            alt={photo.alt}
            loading={index < 4 && stageIndex === 0 ? 'eager' : 'lazy'}
            fetchpriority={index === 0 && stageIndex === 0 ? 'high' : 'auto'}
            decoding="async"
            className={`photo-card__image photo-card__image--stage-${stageIndex}${visibleStage === stageIndex ? ' is-visible' : ''}`}
            onLoad={() => handleStageLoad(stageIndex)}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function PhotoGallery() {
  const [densityIndex, setDensityIndex] = useState(1);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const sentinelRef = useRef(null);

  const loadPage = useCallback(async (offset) => {
    const params = new URLSearchParams({
      offset: String(offset),
      limit: String(PAGE_SIZE),
    });
    const response = await fetch(`/api/photos?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Could not load photos.');
    }

    const payload = await response.json();
    const nextPhotos = payload.photos ?? [];
    setPhotos((prev) => (offset === 0 ? nextPhotos : [...prev, ...nextPhotos]));
    setHasMore(Boolean(payload.hasMore));
  }, []);

  useEffect(() => {
    loadPage(0)
      .catch(() => setError('Could not load photos.'))
      .finally(() => setLoading(false));
  }, [loadPage]);

  const loadMore = useCallback(async () => {
    if (loading || loadingMore || !hasMore || error) return;
    setLoadingMore(true);
    try {
      await loadPage(photos.length);
    } catch {
      setError('Could not load more photos.');
    } finally {
      setLoadingMore(false);
    }
  }, [error, hasMore, loadPage, loading, loadingMore, photos.length]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: '300px 0px' },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  const cols = DENSITIES[densityIndex].cols;
  const layout = useMemo(() => buildMosaicLayout(photos, cols), [photos, cols]);

  if (loading) return null;

  if (error || !photos.length) {
    return (
      <div className="gallery-empty">
        <p className="muted-text">{error ?? 'Photos coming soon.'}</p>
      </div>
    );
  }

  return (
    <div className="gallery-wrapper">
      <div className="gallery-header section-title">
        <h1 className="gallery-title">photography</h1>
        <div className="density-controls">
          {DENSITIES.map((d, i) => (
            <motion.button
              key={d.label}
              className={`density-btn ${i === densityIndex ? 'density-btn--active' : ''}`}
              onClick={() => setDensityIndex(i)}
              whileHover={{ opacity: 1 }}
              whileTap={{ scale: 0.92 }}
            >
              {d.label}
            </motion.button>
          ))}
        </div>
      </div>

      <motion.div
        className="masonry-grid"
        style={{ '--gallery-cols': cols }}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {photos.map((photo, index) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            index={index}
            tile={layout.get(photo.id)}
          />
        ))}
      </motion.div>
      <div ref={sentinelRef} className="gallery-scroll-sentinel" aria-hidden="true" />
      {loadingMore && <p className="gallery-loading-more muted-text">Loading more photos...</p>}
    </div>
  );
}
