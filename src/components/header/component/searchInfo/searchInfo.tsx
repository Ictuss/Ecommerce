import React from "react";
import logoPreta from "../../../../assets/logoPreta.png";
import "./searchInfo.css";
import iconZap from "../../../../assets/whatsapp.png";
import iconInfo from "../../../../assets/info.png";
const SearchInfo: React.FC = () => {
  const whatsappNumber = "554291383593";

  // Link completo para o WhatsApp
  const whatsappLink = `https://wa.me/${whatsappNumber}`;
  return (
    <>
      <div className="container">
        <div className="logoPreta">
          <img
            src={logoPreta}
            className="logoPretaImg"
            alt="Banner Principal"
          />
        </div>
        <div className="si-search">
          <label className="search-box" aria-label="Buscar produtos">
            <span className="search-icon" aria-hidden>
              🔍
            </span>
            <input
              type="text"
              placeholder="O que você procura?"
              aria-label="O que você procura?"
            />
          </label>
        </div>
        <div className="link-div">
          <li className="link">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="link link-whatsapp" // Adicionei uma classe para estilização, se necessário
            >
              Fale Conosco!{" "}
              <img src={iconZap} alt="WhatsApp" className="link-icon" />
            </a>
          </li>
          <li className="link">
            Sobre Nós{" "}
            <img src={iconInfo} alt="Informações" className="link-icon" />
          </li>
        </div>
      </div>
    </>
  );
};

export default SearchInfo;
