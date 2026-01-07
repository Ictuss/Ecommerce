import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { apiService } from "../../services/api";
import "./blogDetail.css";
import type { BlogPostPageData, BlogPostFromPayload } from "../../types/blog";
import PostHighlight from "../Blog/components/blogCard";
import dorPulso from "../../assets/dorPulso.png";
import { buildImageUrl } from "../../config/env";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostPageData | null>(null);
  const [related, setRelated] = useState<BlogPostFromPayload[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        const blogPost: BlogPostPageData | null =
          await apiService.fetchBlogPostBySlug(slug || "");
        if (!blogPost) {
          setError("Post não encontrado");
          return;
        }
        setPost(blogPost);
      } catch (err) {
        console.error("Erro ao carregar post:", err);
        setError("Erro ao carregar o post.");
      } finally {
        setLoading(false);
      }
    };
    if (slug) loadPost();
  }, [slug]);

  useEffect(() => {
    const loadRelated = async () => {
      try {
        const allPosts: BlogPostFromPayload[] =
          await apiService.fetchBlogPosts();
        if (!post) {
          setRelated([]);
          return;
        }

        // Helper: ordena por mais recente e limita
        const topRecent = (list: BlogPostFromPayload[], limit = 3) =>
          list
            .filter((p) => p.slug !== post.slug)
            .sort((a, b) => {
              const da = new Date(a.publishedAt || 0).getTime();
              const db = new Date(b.publishedAt || 0).getTime();
              return db - da;
            })
            .slice(0, limit);

        let sameCategorySorted: BlogPostFromPayload[] = [];

        if (post.category) {
          sameCategorySorted = topRecent(
            allPosts.filter((p) => p.category === post.category)
          );
        }

        // Fallback: se não houver da mesma categoria, pega os mais recentes gerais
        if (sameCategorySorted.length === 0) {
          setRelated(topRecent(allPosts));
        } else {
          setRelated(sameCategorySorted);
        }
      } catch (err) {
        console.error("Erro ao carregar relacionados:", err);
        // Fallback de rede/erro: tenta ao menos mostrar os mais recentes gerais
        try {
          const allPosts: BlogPostFromPayload[] =
            await apiService.fetchBlogPosts();
          if (post) {
            const recent = allPosts
              .filter((p) => p.slug !== post.slug)
              .sort((a, b) => {
                const da = new Date(a.publishedAt || 0).getTime();
                const db = new Date(b.publishedAt || 0).getTime();
                return db - da;
              })
              .slice(0, 3);
            setRelated(recent);
          } else {
            setRelated([]);
          }
        } catch {
          setRelated([]);
        }
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
        <Link to="/blog" className="back-link">
          ← Voltar para o blog
        </Link>
      </div>
    );
  }

  const featuredImageUrl = post.featuredImage
    ? buildImageUrl(post.featuredImage.url)
    : dorPulso;

  return (
    <main className="blog-post">
      <header className="blog-post-header">
        <Link to="/blog" className="back-link">
          ← Voltar para o blog
        </Link>

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
            {new Date(post.publishedAt).toLocaleDateString("pt-BR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="post-category">{post.category}</span>
          {post.featured && <span className="featured-badge">Em destaque</span>}
        </div>
      </header>

      <div className="blog-post-content">
        <div className="post-content">
          {post.content
            .split("\n")
            .map(
              (paragraph, index) =>
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
                      onError={(e) => {
                        e.currentTarget.src = dorPulso;
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <div className="bottom-actions">
        <Link to="/blog" className="back-link">
          ← Voltar para o blog
        </Link>
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
                  date={new Date(r.publishedAt).toLocaleDateString("pt-BR")}
                  image={img}
                />
              </Link>
            );
          })}
        </div>
      )}

      {/* Tags */}
      <div className="blog-post-content"></div>
    </main>
  );
};

export default BlogPost;
