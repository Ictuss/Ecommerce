import React from 'react';
import PostHighlight from './components/blogCard';

const Blog: React.FC = () => {
  return (
    <div>
      <h1>Blog</h1>
      <p>Leia nossos artigos no blog.</p>
      <PostHighlight/>
    </div>
  );
};

export default Blog;