import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from "../../services/api";
import "./blogDetail.css";
import type { BlogPostPageData } from "../../types/blog";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostPageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        const blogPost: BlogPostPageData | null = await apiService.fetchBlogPostBySlug(slug || '');
        
        if (!blogPost) {
          setError('Post não encontrado');
          return;
        }

        setPost(blogPost);
        
      } catch (err) {
        console.error('Erro ao carregar post:', err);
        setError('Erro ao carregar o post.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="loading-container">
        <h2>Carregando post...</h2>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="error-container">
        <h2>{error}</h2>
        <Link to="/blog">← Voltar para o blog</Link>
      </div>
    );
  }

  return (
    <article className="blog-post">
      <header className="blog-post-header">
        <Link to="/blog" className="back-link">← Voltar para o blog</Link>
        
        <h1 className="blog-post-title">{post.title}</h1>
        
        <div className="blog-post-meta">
          <span className="post-date">
            {new Date(post.publishedAt).toLocaleDateString('pt-BR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
          
          <span className="post-category">{post.category}</span>
          
          {post.featured && (
            <span className="featured-badge">Em destaque</span>
          )}
        </div>

        {post.featuredImage && (
          <div className="featured-image">
            <img 
              src={post.featuredImage.url} 
              alt={post.featuredImage.alt || post.title}
            />
          </div>
        )}

        {post.excerpt && (
          <div className="post-excerpt">
            <p>{post.excerpt}</p>
          </div>
        )}
      </header>

      <div className="blog-post-content">
        {/* Renderizar conteúdo como texto simples com quebras de linha */}
        <div className="post-content">
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        
        {/* Galeria de imagens se existir */}
        {post.gallery && post.gallery.length > 0 && (
          <div className="post-gallery">
            <h3>Galeria</h3>
            <div className="gallery-grid">
              {post.gallery.map((item: any, index: number) => (
                <div key={index} className="gallery-item">
                  <img 
                    src={item.image.url} 
                    alt={item.image.alt || `Imagem ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="post-tags">
            <h4>Tags:</h4>
            {post.tags.map((tagObj: any, index: number) => (
              <span key={index} className="tag">
                {tagObj.tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* SEO Meta se existir */}
      {post.seo && (
        <div style={{ display: 'none' }}>
          <meta name="description" content={post.seo.metaDescription} />
          <title>{post.seo.metaTitle || post.title}</title>
        </div>
      )}
    </article>
  );
};

export default BlogPost;