import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-content">
        {/* Logo */}
        <div className="logo">
          <span>ICTUS</span>
          <span className="heart">❤️</span>
        </div>

        {/* Informações de Contato */}
        <div className="contact-info">
          <div className="contact-item">
            <img src="/assets/icons/icon-location.png" alt="Location Icon" className="icon" />
            <span>Rua Getúlio Vargas 1951, Centro, Guarapuava PR</span>
          </div>
          <div className="contact-item">
            <img src="/assets/icons/icon-whatsapp.png" alt="WhatsApp Icon" className="icon" />
            <span>42 9 9138 3593</span>
          </div>
          <div className="contact-item">
            <img src="/assets/icons/icon-telefone.png" alt="Phone Icon" className="icon" />
            <span>42 3622 1080</span>
          </div>
          <div className="contact-item">
            <span className="icon">✉️</span> {/* Mantive o emoji por enquanto, pois não vi um icon-email.png */}
            <span>ictus@ictusvirtual.com.br</span>
          </div>
        </div>
      </div>

      {/* Navbar com Links de Rotas */}
      <div className="navbar-container">
        <nav className="navbar">
          <ul className="nav-links">
            <li>
              <Link to="/" className='link'>Página Inicial</Link>
            </li>
            <li>
              <Link to="/modelos" className='link'>Modelos</Link>
            </li>
            <li>
              <Link to="/blog" className='link'>Blog</Link>
            </li>
            <li>
              <Link to="/contato" className='link'>Contato</Link>
            </li>
            <li>
              <Link to="/sobre-nos" className='link'>Sobre Nós</Link>
            </li>
          </ul>
          <div className="search-box">
            <input type="text" placeholder="Pesquisar..." />
            <span className="search-icon">🔍</span>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;