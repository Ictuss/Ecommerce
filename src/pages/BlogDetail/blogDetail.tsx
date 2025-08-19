// pages/BlogDetail/BlogDetail.tsx
import React from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import "./blogDetail.css";
import { posts } from "../../mock/posts";
import dorPulso from "../../assets/dorPulso.png";
import PostHighlight from "../Blog/components/blogCard";

const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = posts.find((p) => p.slug === slug);
  if (!post) return <Navigate to="/blog" replace />;

  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <main className="blog">
      <article className="">
        <div className="blog-hero">
          <img src={dorPulso} alt={post.title} className="hero-img" />
        </div>

        <header className="blog-header">
          <h1 className="blog-title">{post.title}</h1>
          <p className="blog-lead">{post.excerpt}</p>
        </header>

        <section className="blog-content">
          {post.content.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </section>
      </article>

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
    </main>
  );
};

export default BlogDetail;
