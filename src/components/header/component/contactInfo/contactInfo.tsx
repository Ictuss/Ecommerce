import React from "react";
import loc from "../../../../assets/icons/localização.png";
import telefone from "../../../..//assets/icons/telefone.png";
import wpp from "../../../../assets/icons/whatsapp.png";
import email from "../../../../assets/icons/email.png";
import logoBranca from "../../../../assets/icons/logo_branca.png";
import "./ContactInfo.css";

const ContactInfo: React.FC = () => {
  return (
    <div className="contact-bar" aria-label="Informações de contato">
      {/* Logo */}
      <div className="logo">
        <img src={logoBranca} alt="ICTUS" className="logo-branca" />
      </div>

      {/* Endereço */}
      <div className="contact-item address">
        <img src={loc} alt="" className="icon" aria-hidden="true" />
        <span className="contact-text">
          <span className="addr-line">Rua Getúlio Vargas, 1951</span>
          <span className="addr-line">Centro</span>
          <span className="addr-line">Guarapuava - PR</span>
        </span>
      </div>

      {/* WhatsApp */}
      <div className="contact-item">
        <img src={wpp} alt="" className="icon" aria-hidden="true" />
        <a
          className="contact-text link"
          href="https://wa.me/5542991383593"
          target="_blank"
          rel="noreferrer"
        >
          42 9 9138 3593
        </a>
      </div>

      {/* Telefone */}
      <div className="contact-item">
        <img src={telefone} alt="" className="icon" aria-hidden="true" />
        <a className="contact-text link" href="tel:+554236221080">
          42 3622 1080
        </a>
      </div>

      {/* E-mail */}
      <div className="contact-item">
        <img src={email} alt="" className="icon" aria-hidden="true" />
        <a
          className="contact-text link"
          href="mailto:ictus@ictusvirtual.com.br"
        >
          ictus@ictusvirtual.com.br
        </a>
      </div>
    </div>
  );
};

export default ContactInfo;
