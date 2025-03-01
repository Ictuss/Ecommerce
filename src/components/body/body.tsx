// Body.tsx
import React from 'react';
import './Body.css';

const Body: React.FC = () => {
  return (
    <div className="body-container">
      <nav className="navbar">
        <ul className="nav-links">
          <li>Início</li>
          <li>Modelos</li>
          <li>Blog</li>
          <li>Contato</li>
          <li>Sobre nós</li>
        </ul>
        <div className="search-box">
          <input type="text" placeholder="Pesquisar..." />
          <span className="search-icon">🔍</span>
        </div>
      </nav>
    </div>
  );
};

export default Body;
