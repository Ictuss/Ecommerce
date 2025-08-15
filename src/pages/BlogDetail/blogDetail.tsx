// pages/BlogDetail/BlogDetail.tsx
import React from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import "./blogDetail.css";
import { posts } from "../../mock/posts";

const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = posts.find((p) => p.slug === slug);
  if (!post) return <Navigate to="/blog" replace />;

  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <main className="blog">
      <article className="container">
        <div className="blog-hero">
          <img src={post.hero} alt={post.title} className="hero-img" />
        </div>

        <header className="blog-header">
          <h1 className="blog-title">{post.title}</h1>
          <p className="blog-lead">{post.excerpt}</p>
        </header>

        <section className="blog-content">
          {post.content.map((para, i) => <p key={i}>{para}</p>)}
        </section>
      </article>

      <div className="section-divider">Mais notícias</div>

      <section className="related container">
        {related.map((item) => (
          <Link to={`/blog/${item.slug}`} className="related-card" key={item.slug}>
            <img src={item.thumb} alt={item.title} loading="lazy" />
            <div className="related-body">
              <h3>{item.title}</h3>
              <p>{item.excerpt}</p>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
};

export default BlogDetail;
