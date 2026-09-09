import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO/SEO';
import Footer from '../../components/Footer/Footer';
import { useInsights } from '../../Context/InsightsContext';
import './Insights.css';

function Insights() {
  const { getPublishedArticles, categories } = useInsights();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const articles = getPublishedArticles();
  
  const filteredArticles = selectedCategory
    ? articles.filter((a) => a.category === selectedCategory)
    : articles;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'MiTRAA Insights',
    description: 'Industry insights, thought leadership, and expert analysis on technology and business trends.',
    url: 'https://mymitraa.com/insights',
  };

  return (
    <>
      <SEO
        title="Insights | Industry Articles & Thought Leadership"
        description="Discover MiTRAA's latest insights on cybersecurity, digital transformation, AI, and technology trends."
        canonical="/insights"
        ogImage="https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&h=630&fit=crop"
        schema={schema}
      />
      
      <div className="insights-page">
        {/* Hero Section */}
        <section className="insights-hero">
          <div className="insights-hero-content">
            <h1>Insights & Articles</h1>
            <p>Expert perspectives on technology, innovation, and industry trends</p>
          </div>
        </section>

        {/* Filter Section */}
        <section className="insights-filters">
          <div className="filters-container">
            <button
              className={`filter-btn ${!selectedCategory ? 'active' : ''}`}
              onClick={() => setSelectedCategory(null)}
            >
              All Articles
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Articles Grid */}
        <section className="insights-grid">
          <div className="articles-container">
            {filteredArticles.length > 0 ? (
              <div className="articles-list">
                {filteredArticles.map((article) => (
                  <Link
                    key={article.id}
                    to={`/insights/${article.slug}`}
                    className="article-card"
                  >
                    <div className="article-card-image">
                      <img src={article.featuredImage} alt={article.title} />
                      <span className="article-category">{article.category}</span>
                    </div>
                    <div className="article-card-content">
                      <h3>{article.title}</h3>
                      <p className="article-excerpt">{article.excerpt}</p>
                      <div className="article-meta">
                        <span className="author">By {article.author}</span>
                        <span className="date">
                          {new Date(article.publishedDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="no-articles">
                <p>No articles found in this category.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default Insights;
