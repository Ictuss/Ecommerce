import React from 'react';
import PostHighlight from './components/blogCard';
import { posts } from "../../mock/posts";
import { Link } from 'react-router-dom';
import dorPulso from "../../assets/dorPulso.png";
import "./blog.css";
const Blog: React.FC = () => {
  return (
    <div className="containerblog-list">
      {posts.map((p) => (
        <Link to={`/blog/${p.slug}`} key={p.slug} className="hl-link">
          <PostHighlight
            title={p.title}
            text={p.excerpt}
            date={p.date}
            image={dorPulso}
          />
        </Link>
      ))}
    </div>
  );
};

export default Blog;