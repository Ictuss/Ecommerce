import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from "../../services/api";
import "./blogDetail.css";
import type { BlogPostPageData } from "../../types/blog";
import PostHighlight from '../Blog/components/blogCard';
import dorPulso from "../../assets/dorPulso.png";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostPageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Função para construir URL das imagens
  const buildImageUrl = (imageUrl: string | undefined): string => {
    if (!imageUrl) return dorPulso;
    
    // Se a URL já é completa (começa com http)
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // Construir URL completa
    const baseUrl = 'http://localhost:3000';
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const cleanImageUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    return `${cleanBaseUrl}${cleanImageUrl}`;
  };

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        const blogPost: BlogPostPageData | null = await apiService.fetchBlogPostBySlug(slug || '');
        
        if (!blogPost) {
          setError('Post não encontrado');
          return;
        }

        console.log('Post carregado:', blogPost);
        console.log('FeaturedImage:', blogPost.featuredImage);

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
        <Link to="/blog" className="back-link">← Voltar para o blog</Link>
      </div>
    );
  }

  // Construir URL da imagem em destaque
  const featuredImageUrl = post.featuredImage ? buildImageUrl(post.featuredImage.url) : null;

  return (
    <main className="blog-post">
      <header className="blog-post-header">
        <Link to="/blog" className="back-link">← Voltar para o blog</Link>
        
        {/* Imagem em destaque como hero */}
        {featuredImageUrl && (
          <div className="featured-image">
            <img 
              src={featuredImageUrl}
              alt={post.featuredImage?.alt || post.title}
              onError={(e) => {
                console.log('Erro ao carregar imagem:', featuredImageUrl);
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
      </header>

      <div className="blog-post-content">
        {/* Conteúdo principal */}
        <div className="post-content">
          {post.content.split('\n').map((paragraph, index) => (
            paragraph.trim() && <p key={index}>{paragraph}</p>
          ))}
        </div>
        
        {/* Galeria de imagens se existir */}
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
                        console.log('Erro ao carregar imagem da galeria:', galleryImageUrl);
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

      {/* Seção de posts relacionados */}
      <div className="section-divider">Mais matérias:</div>
      
      <div className="anothers-posts">
        <PostHighlight
          title="Seu pulso está dolorido? Confira as possíveis causas."
          text="Você trabalha com movimentos repetitivos? Passa muito tempo com as mãos no teclado ou mouse? Especialistas relatam o número crescente de pacientes com LER. Confira alguns produtos que podem te ajudar!"
          date="12/05/2020"
          image={dorPulso}
        />
      </div>
      
      <div className="anothers-posts">
        <PostHighlight
          title="Seu pulso está dolorido? Confira as possíveis causas."
          text="Você trabalha com movimentos repetitivos? Passa muito tempo com as mãos no teclado ou mouse? Especialistas relatam o número crescente de pacientes com LER. Confira alguns produtos que podem te ajudar!"
          date="12/05/2020"
          image={dorPulso}
        />
      </div>
      
      <div className="anothers-posts">
        <PostHighlight
          title="Seu pulso está dolorido? Confira as possíveis causas."
          text="Você trabalha com movimentos repetitivos? Passa muito tempo com as mãos no teclado ou mouse? Especialistas relatam o número crescente de pacientes com LER. Confira alguns produtos que podem te ajudar!"
          date="12/05/2020"
          image={dorPulso}
        />
      </div>

      {/* Tags */}
      <div className="blog-post-content">
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
    </main>
  );
};

export default BlogPost;