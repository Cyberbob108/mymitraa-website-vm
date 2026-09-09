import { createContext, useContext, useState, useEffect } from 'react';

const InsightsContext = createContext();

const INITIAL_ARTICLES = [
  {
    id: 1,
    slug: 'cyber-security',
    title: 'Cyber Security Threats in 2026',
    excerpt: 'Explore the latest cyber security challenges and how to protect your business.',
    content: `<h2>Understanding Modern Cyber Threats</h2>
<p>As we move into 2026, cyber security threats continue to evolve. Organizations must stay vigilant and implement comprehensive security strategies.</p>
<h3>Key Areas of Focus</h3>
<ul>
<li>Zero Trust Architecture</li>
<li>AI-powered threat detection</li>
<li>Supply chain security</li>
<li>Cloud security</li>
</ul>
<h3>Best Practices</h3>
<p>Organizations should adopt a multi-layered approach to security, combining technological solutions with employee training and awareness programs.</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop',
    author: 'John Smith',
    category: 'Cyber Security',
    status: 'published',
    publishedDate: '2026-01-15',
    createdDate: '2026-01-15',
    updatedDate: '2026-01-15',
    seoTitle: 'Cyber Security Threats in 2026 | MiTRAA',
    metaDescription: 'Learn about the latest cyber security threats and how to protect your business in 2026.',
    canonicalUrl: '/insights/cyber-security',
    ogImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=630&fit=crop',
  },
  {
    id: 2,
    slug: 'digital-transformation',
    title: 'Digital Transformation: A Complete Guide',
    excerpt: 'Navigate your organization through digital transformation with proven strategies.',
    content: `<h2>What is Digital Transformation?</h2>
<p>Digital transformation is the integration of digital technology into all areas of business, fundamentally changing how you operate and deliver value to customers.</p>
<h3>The Four Pillars</h3>
<ul>
<li>Process Optimization</li>
<li>Customer Experience Enhancement</li>
<li>Business Model Innovation</li>
<li>Cultural Transformation</li>
</ul>
<h3>Getting Started</h3>
<p>Begin with a clear vision, assess your current state, and develop a roadmap that aligns with business goals. Don't forget the human element - change management is crucial.</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    author: 'Sarah Johnson',
    category: 'Digital Transformation',
    status: 'published',
    publishedDate: '2026-01-10',
    createdDate: '2026-01-10',
    updatedDate: '2026-01-10',
    seoTitle: 'Digital Transformation Guide | MiTRAA Tech',
    metaDescription: 'Complete guide to digital transformation with proven strategies and best practices.',
    canonicalUrl: '/insights/digital-transformation',
    ogImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=630&fit=crop',
  },
  {
    id: 3,
    slug: 'artificial-intelligence',
    title: 'Artificial Intelligence in Business',
    excerpt: 'How AI is revolutionizing industries and creating new opportunities.',
    content: `<h2>The AI Revolution</h2>
<p>Artificial Intelligence is no longer just a buzzword - it's transforming every aspect of business operations.</p>
<h3>Current Applications</h3>
<ul>
<li>Customer Service Automation</li>
<li>Predictive Analytics</li>
<li>Process Automation</li>
<li>Content Creation</li>
</ul>
<h3>Future Outlook</h3>
<p>As AI technology matures, organizations that embrace it early will gain significant competitive advantages in their markets.</p>`,
    featuredImage: 'https://images.unsplash.com/photo-1677442d019cecf59f37a1d52e3e32e34b0a90b7?w=800&h=400&fit=crop',
    author: 'Mike Chen',
    category: 'Artificial Intelligence',
    status: 'published',
    publishedDate: '2026-01-05',
    createdDate: '2026-01-05',
    updatedDate: '2026-01-05',
    seoTitle: 'AI in Business: Opportunities & Strategies | MiTRAA',
    metaDescription: 'Discover how artificial intelligence is revolutionizing business and creating new opportunities.',
    canonicalUrl: '/insights/artificial-intelligence',
    ogImage: 'https://images.unsplash.com/photo-1677442d019cecf59f37a1d52e3e32e34b0a90b7?w=1200&h=630&fit=crop',
  },
];

const CATEGORIES = [
  'Cyber Security',
  'Digital Transformation',
  'Artificial Intelligence',
  'Cloud',
  'Technology',
];

export const InsightsProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);

  // Initialize from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('insights_articles');
    if (stored) {
      setArticles(JSON.parse(stored));
    } else {
      setArticles(INITIAL_ARTICLES);
      localStorage.setItem('insights_articles', JSON.stringify(INITIAL_ARTICLES));
    }
  }, []);

  const saveArticles = (newArticles) => {
    setArticles(newArticles);
    localStorage.setItem('insights_articles', JSON.stringify(newArticles));
  };

  const getPublishedArticles = () => {
    return articles.filter((a) => a.status === 'published').sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
  };

  const getArticleBySlug = (slug) => {
    return articles.find((a) => a.slug === slug);
  };

  const createArticle = (article) => {
    const newArticle = {
      ...article,
      id: Math.max(0, ...articles.map((a) => a.id)) + 1,
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0],
    };
    saveArticles([...articles, newArticle]);
    return newArticle;
  };

  const updateArticle = (id, updates) => {
    const updated = articles.map((a) =>
      a.id === id
        ? {
            ...a,
            ...updates,
            updatedDate: new Date().toISOString().split('T')[0],
          }
        : a
    );
    saveArticles(updated);
  };

  const deleteArticle = (id) => {
    saveArticles(articles.filter((a) => a.id !== id));
  };

  const slugExists = (slug, excludeId = null) => {
    return articles.some(
      (a) => a.slug === slug && (excludeId === null || a.id !== excludeId)
    );
  };

  const getRelatedArticles = (slug, limit = 3) => {
    const article = getArticleBySlug(slug);
    if (!article) return [];
    return getPublishedArticles()
      .filter((a) => a.slug !== slug && a.category === article.category)
      .slice(0, limit);
  };

  return (
    <InsightsContext.Provider
      value={{
        articles,
        getPublishedArticles,
        getArticleBySlug,
        createArticle,
        updateArticle,
        deleteArticle,
        slugExists,
        getRelatedArticles,
        categories: CATEGORIES,
      }}
    >
      {children}
    </InsightsContext.Provider>
  );
};

export const useInsights = () => useContext(InsightsContext);
