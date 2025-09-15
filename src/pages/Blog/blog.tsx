import { useState, useEffect } from "react";
import PostHighlight from "./components/blogCard";
import { apiService } from "../../services/api";
import { Link } from "react-router-dom";
import dorPulso from "../../assets/dorPulso.png";
import "./blog.css";
import type { BlogPostFromPayload, FormattedBlogPost } from "../../types/blog";

const Blog = () => {
  const [posts, setPosts] = useState<FormattedBlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        setLoading(true);
        const blogPosts: BlogPostFromPayload[] =
          await apiService.fetchBlogPosts();

        console.log("Posts completos:", JSON.stringify(blogPosts, null, 2));
        
        // Formatar posts para o componente
// Formatar posts para o componente
const formattedPosts: FormattedBlogPost[] = blogPosts
  .map((post: BlogPostFromPayload) => {
    let imageUrl = dorPulso; // Valor padrão

    if (post.featuredImage && post.featuredImage.url) {
      if (post.featuredImage.url.startsWith("http")) {
        imageUrl = post.featuredImage.url;
      } else {
        const baseUrl = "http://localhost:3000";
        const cleanBaseUrl = baseUrl.endsWith("/")
          ? baseUrl.slice(0, -1)
          : baseUrl;
        const cleanImageUrl = post.featuredImage.url.startsWith("/")
          ? post.featuredImage.url
          : `/${post.featuredImage.url}`;
        imageUrl = `${cleanBaseUrl}${cleanImageUrl}`;
      }
    }

    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      // aqui você mantém a data formatada para exibir
      date: new Date(post.publishedAt).toLocaleDateString("pt-BR"),
      // mas também guarda a data bruta para ordenar
      rawDate: new Date(post.publishedAt),
      image: imageUrl,
      category: post.category,
      featured: post.featured,
    };
  })
  // ordena por data decrescente (mais recente primeiro)
  .sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());

setPosts(formattedPosts);

      } catch (err) {
        console.error("Erro ao carregar posts:", err);
        setError("Erro ao carregar posts do blog.");
      } finally {
        setLoading(false);
      }
    };

    loadBlogPosts();
  }, []);

  if (loading) {
    return (
      <div
        className="loading-container"
        style={{ textAlign: "center", padding: "50px" }}
      >
        <h2>Carregando posts...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="error-container"
        style={{ textAlign: "center", padding: "50px" }}
      >
        <h2>{error}</h2>
        <button onClick={() => window.location.reload()}>
          Tentar novamente
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div
        className="empty-container"
        style={{ textAlign: "center", padding: "50px" }}
      >
        <h2>Nenhum post encontrado</h2>
        <p>Adicione posts no painel administrativo.</p>
      </div>
    );
  }

  return (
    <div className="containerblog-list">
      {posts.map((post: FormattedBlogPost) => (
        <Link to={`/blog/${post.slug}`} key={post.id} className="hl-link">
          <PostHighlight
            title={post.title}
            text={post.excerpt}
            date={post.date}
            image={post.image}
          />
        </Link>
      ))}
    </div>
  );
};

export default Blog;