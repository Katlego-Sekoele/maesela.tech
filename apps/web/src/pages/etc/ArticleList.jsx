import { useState, useEffect } from 'react';

const fmt = new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric' });

function formatDate(dateStr) {
  return fmt.format(new Date(dateStr + 'T12:00:00'));
}

export default function ArticleList() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch('/api/articles')
      .then((r) => r.json())
      .then((data) => setArticles(data.articles ?? []))
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
