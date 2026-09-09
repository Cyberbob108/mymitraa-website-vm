import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInsights } from '../../Context/InsightsContext';
import { useAuth } from '../../Context/AuthContext';
import Footer from '../../components/Footer/Footer';
import './AdminInsights.css';

function AdminInsights() {
  const { authUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { articles, createArticle, updateArticle, deleteArticle, categories } = useInsights();
  const [tab, setTab] = useState('list');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    author: '',
    category: '',
    status: 'draft',
    publishedDate: '',
    seoTitle: '',
    metaDescription: '',
    ogImage: '',
  });

  // Check admin access
  if (!authUser || !isAdmin) {
    return (
      <div className="admin-access-denied">
        <h1>Access Denied</h1>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.slug || !formData.excerpt) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingId) {
      updateArticle(editingId, {
        ...formData,
        publishedDate: formData.status === 'published' ? formData.publishedDate || new Date().toISOString().split('T')[0] : formData.publishedDate,
      });
      alert('Article updated successfully!');
      setEditingId(null);
    } else {
      createArticle({
        ...formData,
        publishedDate: formData.status === 'published' ? new Date().toISOString().split('T')[0] : '',
      });
      alert('Article created successfully!');
    }

    resetForm();
    setTab('list');
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featuredImage: '',
      author: '',
      category: '',
      status: 'draft',
      publishedDate: '',
      seoTitle: '',
      metaDescription: '',
      ogImage: '',
    });
  };

  const handleEdit = (article) => {
    setFormData(article);
    setEditingId(article.id);
    setTab('editor');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      deleteArticle(id);
      alert('Article deleted successfully!');
    }
  };

  const draftArticles = articles.filter((a) => a.status === 'draft');
  const publishedArticles = articles.filter((a) => a.status === 'published');

  return (
    <>
      <div className="admin-insights-page">
        <div className="admin-header">
          <h1>Insights Management</h1>
          <p>Create, edit, and manage your articles</p>
        </div>

        <div className="admin-container">
          <div className="admin-tabs">
            <button
              className={`tab-btn ${tab === 'list' ? 'active' : ''}`}
              onClick={() => setTab('list')}
            >
              All Articles ({articles.length})
            </button>
            <button
              className={`tab-btn ${tab === 'published' ? 'active' : ''}`}
              onClick={() => setTab('published')}
            >
              Published ({publishedArticles.length})
            </button>
            <button
              className={`tab-btn ${tab === 'draft' ? 'active' : ''}`}
              onClick={() => setTab('draft')}
            >
              Drafts ({draftArticles.length})
            </button>
            <button
              className={`tab-btn ${tab === 'editor' ? 'active' : ''}`}
              onClick={() => {
                setTab('editor');
                resetForm();
                setEditingId(null);
              }}
            >
              + New Article
            </button>
          </div>

          {/* Article List */}
          {(tab === 'list' || tab === 'published' || tab === 'draft') && (
            <div className="admin-content">
              <div className="articles-table">
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Category</th>
                      <th>Author</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(tab === 'list'
                      ? articles
                      : tab === 'published'
                        ? publishedArticles
                        : draftArticles
                    ).map((article) => (
                      <tr key={article.id}>
                        <td>
                          <strong>{article.title}</strong>
                          <br />
                          <small className="slug-display">/{article.slug}</small>
                        </td>
                        <td>
                          <span className={`status-badge ${article.status}`}>
                            {article.status}
                          </span>
                        </td>
                        <td>{article.category}</td>
                        <td>{article.author}</td>
                        <td>
                          {new Date(article.publishedDate || article.createdDate).toLocaleDateString()}
                        </td>
                        <td>
                          <button
                            className="action-btn edit"
                            onClick={() => handleEdit(article)}
                          >
                            Edit
                          </button>
                          <button
                            className="action-btn delete"
                            onClick={() => handleDelete(article.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Article Editor */}
          {tab === 'editor' && (
            <div className="admin-content">
              <div className="editor-form">
                <h2>{editingId ? 'Edit Article' : 'Create New Article'}</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-grid">
                    {/* Title */}
                    <div className="form-group full-width">
                      <label>Title *</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleTitleChange}
                        placeholder="Article title"
                        required
                      />
                    </div>

                    {/* Slug */}
                    <div className="form-group full-width">
                      <label>Slug *</label>
                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        placeholder="article-slug"
                        required
                      />
                    </div>

                    {/* Excerpt */}
                    <div className="form-group full-width">
                      <label>Excerpt *</label>
                      <textarea
                        name="excerpt"
                        value={formData.excerpt}
                        onChange={handleInputChange}
                        placeholder="Brief summary of the article"
                        rows="2"
                        required
                      />
                    </div>

                    {/* Content */}
                    <div className="form-group full-width">
                      <label>Content (HTML)</label>
                      <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        placeholder="Article content (supports HTML)"
                        rows="10"
                      />
                    </div>

                    {/* Author */}
                    <div className="form-group">
                      <label>Author</label>
                      <input
                        type="text"
                        name="author"
                        value={formData.author}
                        onChange={handleInputChange}
                        placeholder="Author name"
                      />
                    </div>

                    {/* Category */}
                    <div className="form-group">
                      <label>Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                      >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Status */}
                    <div className="form-group">
                      <label>Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>

                    {/* Published Date */}
                    {formData.status === 'published' && (
                      <div className="form-group">
                        <label>Published Date</label>
                        <input
                          type="date"
                          name="publishedDate"
                          value={formData.publishedDate}
                          onChange={handleInputChange}
                        />
                      </div>
                    )}

                    {/* Featured Image */}
                    <div className="form-group full-width">
                      <label>Featured Image URL</label>
                      <input
                        type="url"
                        name="featuredImage"
                        value={formData.featuredImage}
                        onChange={handleInputChange}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    {/* OG Image */}
                    <div className="form-group full-width">
                      <label>OG Image URL (for social media)</label>
                      <input
                        type="url"
                        name="ogImage"
                        value={formData.ogImage}
                        onChange={handleInputChange}
                        placeholder="https://example.com/og-image.jpg"
                      />
                    </div>

                    {/* SEO Title */}
                    <div className="form-group full-width">
                      <label>SEO Title</label>
                      <input
                        type="text"
                        name="seoTitle"
                        value={formData.seoTitle}
                        onChange={handleInputChange}
                        placeholder="SEO title (60 chars)"
                        maxLength="60"
                      />
                    </div>

                    {/* Meta Description */}
                    <div className="form-group full-width">
                      <label>Meta Description</label>
                      <textarea
                        name="metaDescription"
                        value={formData.metaDescription}
                        onChange={handleInputChange}
                        placeholder="Meta description (160 chars)"
                        rows="2"
                        maxLength="160"
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-primary">
                      {editingId ? 'Update Article' : 'Create Article'}
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => {
                        resetForm();
                        setEditingId(null);
                        setTab('list');
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AdminInsights;
