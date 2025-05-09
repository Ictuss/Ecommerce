import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logoBranca from '../../assets/icons/logo_branca.png';
import loc from "../../assets/icons/localização.png";
import telefone from "../../assets/icons/telefone.png"
import wpp from "../../assets/icons/whatsapp.png"
import email from "../../assets/icons/email.png"
import principalLogo from "../../assets/icons/banner.png"

const Header: React.FC = () => {
  return (
    <>
      {/* TOPO VERMELHO */}
      <header className="header">
        <div className="header-content">
          {/* Logo */}
          <div className="logo">
            <img src={logoBranca} alt="Logo" className='logo-branca' />
          </div>

          {/* Informações de Contato */}
          <div className="contact-info">
            <div className="contact-item">
              <img src={loc} alt="Location Icon" className="icon" />
              <span>Rua Getúlio Vargas 1951, Centro, Guarapuava PR</span>
            </div>
            <div className="contact-item">
              <img src={wpp} alt="WhatsApp Icon" className="icon" />
              <span>42 9 9138 3593</span>
            </div>
            <div className="contact-item">
              <img src={telefone} alt="Phone Icon" className="icon" />
              <span>42 3622 1080</span>
            </div>
            <div className="contact-item">
              <img src={email} className='icon' />
              <span>ictus@ictusvirtual.com.br</span>
            </div>
          </div>
        </div>
      </header>

      {/* BANNER PRINCIPAL */}
      <div className="logoPrincipal-container">
        <img src={principalLogo} className='logoPrincipal' alt="Banner Principal" />
      </div>

      {/* NAVBAR (oculta por enquanto) */}
      <div className="navbar-container">
        <nav className="navbar">
          <ul className="nav-links">
            <li><Link to="/" className='link'>Página Inicial</Link></li>
            <li><Link to="/modelos" className='link'>Modelos</Link></li>
            <li><Link to="/blog" className='link'>Blog</Link></li>
            <li><Link to="/contato" className='link'>Contato</Link></li>
            <li><Link to="/sobre-nos" className='link'>Sobre Nós</Link></li>
          </ul>
          <div className="search-box">
          <span className="search-icon">🔍</span>
            <input type="text" placeholder="" />
           
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;
