// Header.tsx
import React from 'react';
import './Header.css'; // Importe o CSS aqui

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
            <span className="icon">📍</span>
            <span>Rua Getúlio Vargas 1951, Centro, Guarapuava PR</span>
          </div>
          <div className="contact-item">
            <span className="icon">📱</span>
            <span>42 9 9138 3593</span>
          </div>
          <div className="contact-item">
            <span className="icon">📞</span>
            <span>42 3622 1080</span>
          </div>
          <div className="contact-item">
            <span className="icon">✉️</span>
            <span>ictus@ictusvirtual.com.br</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;