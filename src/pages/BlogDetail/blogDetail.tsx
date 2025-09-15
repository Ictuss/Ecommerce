import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from "../../services/api";
import "./blogDetail.css";
import type { BlogPostPageData, BlogPostFromPayload } from "../../types/blog";
import PostHighlight from '../Blog/components/blogCard';
import dorPulso from "../../assets/dorPulso.png";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostPageData | null>(null);
  const [related, setRelated] = useState<BlogPostFromPayload[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const buildImageUrl = (imageUrl?: string): string => {
    if (!imageUrl) return dorPulso;
    if (imageUrl.startsWith('http')) return imageUrl;
    const baseUrl = 'http://localhost:3000';
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const cleanImageUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    return `${cleanBaseUrl}${cleanImageUrl}`;
  };

  // 1) Carrega o post principal
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
    if (slug) loadPost();
  }, [slug]);

  // 2) Depois que o post carregar, busca e monta os “Mais matérias” dinâmicos
  useEffect(() => {
    const loadRelated = async () => {
      if (!post?.category) {
        setRelated([]);
        return;
      }
      try {
        const allPosts: BlogPostFromPayload[] = await apiService.fetchBlogPosts();

        const sameCategorySorted = allPosts
          // mesma categoria
          .filter(p => p.category === post.category)
          // exclui o próprio post
          .filter(p => p.slug !== post.slug)
          // ordena por mais recente
          .sort((a, b) => {
            const da = new Date(a.publishedAt).getTime();
            const db = new Date(b.publishedAt).getTime();
            return db - da;
          })
          // limita a 3 (ajuste como quiser)
          .slice(0, 3);

        setRelated(sameCategorySorted);
      } catch (err) {
        console.error('Erro ao carregar relacionados:', err);
        // não quebra a página; só fica sem relacionados
        setRelated([]);
      }
    };

    loadRelated();
  }, [post]);

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
        <Link to="/blog" className="back-link">← Voltar para o blog</Link>
      </div>
    );
  }

  const featuredImageUrl = post.featuredImage ? buildImageUrl(post.featuredImage.url) : null;

  return (
    <main className="blog-post">
      <header className="blog-post-header">
        <Link to="/blog" className="back-link">← Voltar para o blog</Link>

        {featuredImageUrl && (
          <div className="featured-image">
            <img
              src={featuredImageUrl}
              alt={post.featuredImage?.alt || post.title}
              onError={(e) => {
                e.currentTarget.src = dorPulso;
              }}
            />
          </div>
        )}

        <h1 className="blog-post-title">{post.title}</h1>

        {post.excerpt && (
          <div className="post-excerpt">
            <p>{post.excerpt}</p>
          </div>
        )}

        <div className="blog-post-meta">
          <span className="post-date">
            {new Date(post.publishedAt).toLocaleDateString('pt-BR', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}
          </span>
          <span className="post-category">{post.category}</span>
          {post.featured && <span className="featured-badge">Em destaque</span>}
        </div>
      </header>

      <div className="blog-post-content">
        <div className="post-content">
          {post.content.split('\n').map((paragraph, index) =>
            paragraph.trim() && <p key={index}>{paragraph}</p>
          )}
        </div>

        {post.gallery && post.gallery.length > 0 && (
          <div className="post-gallery">
            <h3>Galeria</h3>
            <div className="gallery-grid">
              {post.gallery.map((item: any, index: number) => {
                const galleryImageUrl = buildImageUrl(item.image?.url);
                return (
                  <div key={index} className="gallery-item">
                    <img
                      src={galleryImageUrl}
                      alt={item.image?.alt || `Imagem ${index + 1}`}
                      onError={(e) => { e.currentTarget.src = dorPulso; }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Mais matérias dinâmico */}
      <div className="section-divider">Mais matérias</div>

      {related.length === 0 ? (
        <div className="anothers-posts empty">
          <p>Nenhuma matéria da mesma categoria por enquanto.</p>
        </div>
      ) : (
        <div className="anothers-posts-grid">
          {related.map((r) => {
            const img = buildImageUrl(r.featuredImage?.url);
            return (
              <Link to={`/blog/${r.slug}`} key={r.id} className="hl-link">
                <PostHighlight
                  title={r.title}
                  text={r.excerpt}
                  date={new Date(r.publishedAt).toLocaleDateString('pt-BR')}
                  image={img}
                />
              </Link>
            );
          })}
        </div>
      )}

      {/* Tags */}
      <div className="blog-post-content">
        {post.tags && post.tags.length > 0 && (
          <div className="post-tags">
            <h4>Tags:</h4>
            {post.tags.map((tagObj: any, index: number) => (
              <span key={index} className="tag">{tagObj.tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* SEO Meta */}
      {post.seo && (
        <div style={{ display: 'none' }}>
          <meta name="description" content={post.seo.metaDescription} />
          <title>{post.seo.metaTitle || post.title}</title>
        </div>
      )}
    </main>
  );
};

export default BlogPost;
