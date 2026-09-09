import { useParams, useNavigate } from 'react-router-dom';
import { useInsights } from '../../Context/InsightsContext';
import SEO from '../../components/SEO/SEO';
import Footer from '../../components/Footer/Footer';
import './InsightArticle.css';
import { Link } from 'react-router-dom';

function InsightArticle() {
  const { slug } = useParams();
  const { getArticleBySlug, getRelatedArticles } = useInsights();
  const navigate = useNavigate();
  const article = getArticleBySlug(slug);
  
  if (!article) {
    return (
      <div className="article-not-found">
        <h1>Article Not Found</h1>
        <p>The article you're looking for doesn't exist.</p>
        <Link to="/insights">Back to Insights</Link>
      </div>
    );
  }

  if (article.status !== 'published') {
    return (
      <div className="article-not-found">
        <h1>Article Not Published</h1>
        <p>This article is not available publicly.</p>
        <Link to="/insights">Back to Insights</Link>
      </div>
    );
  }

  const relatedArticles = getRelatedArticles(slug);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    image: article.ogImage,
    datePublished: article.publishedDate,
    dateModified: article.updatedDate,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'MiTRAA',
      logo: {
        '@type': 'ImageObject',
        url: 'https://mymitraa.com/logo.png',
      },
    },
  };

  return (
    <>
      <SEO
        title={article.seoTitle}
        description={article.metaDescription}
        canonical={article.canonicalUrl}
        ogImage={article.ogImage}
        schema={schema}
      />

      <article className="article-page">
        {/* Article Header */}
        <header className="article-header">
          <div className="article-header-content">
            <span className="article-category-badge">{article.category}</span>
            <h1>{article.title}</h1>
            <p className="article-subtitle">{article.excerpt}</p>
            <div className="article-info">
              <span className="author-name">By {article.author}</span>
              <span className="published-date">
                {new Date(article.publishedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="article-featured-image">
          <img src={article.featuredImage} alt={article.title} />
        </div>

        {/* Article Content */}
        <div className="article-container">
          <div className="article-body">
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>

          {/* Sidebar */}
          <aside className="article-sidebar">
            <div className="sidebar-widget">
              <h3>Share</h3>
              <div className="share-buttons">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=https://mymitraa.com/insights/${slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-btn facebook"
                >
                  Facebook
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=https://mymitraa.com/insights/${slug}&text=${article.title}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-btn twitter"
                >
                  Twitter
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=https://mymitraa.com/insights/${slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-btn linkedin"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="related-articles">
            <div className="related-container">
              <h2>Related Articles</h2>
              <div className="related-grid">
                {relatedArticles.map((relatedArticle) => (
                  <Link
                    key={relatedArticle.id}
                    to={`/insights/${relatedArticle.slug}`}
                    className="related-card"
                  >
                    <img src={relatedArticle.featuredImage} alt={relatedArticle.title} />
                    <h3>{relatedArticle.title}</h3>
                    <p>{relatedArticle.excerpt}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>

      <Footer />
    </>
  );
}

export default InsightArticle;
