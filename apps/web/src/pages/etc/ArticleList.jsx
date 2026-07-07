import { useState, useEffect } from 'react';
import { CMS_URL } from '../../config';

const fmt = new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric' });

function formatDate(dateStr) {
  if (!dateStr) return '';
  return fmt.format(new Date(dateStr));
}

export default function ArticleList() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch(`${CMS_URL}/api/articles?limit=200&sort=-readDate&depth=0`)
      .then((r) => r.json())
      .then((data) => setArticles(data.docs ?? []))
      .catch(() => {});
  }, []);

  if (!articles.length) return null;

  return (
    <section className="article-list">
      <div className="article-list__header">
        <h1 className="article-list__heading">reading</h1>
      </div>
      <div className="article-list__items">
        {articles.map((article) => (
          <article key={article.id}>
            <p className="article-card__title">
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                {article.title}
              </a>
            </p>
            {article.description && (
              <p className="article-card__desc">{article.description}</p>
            )}
            <p className="article-card__meta">{formatDate(article.readDate)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
