import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import logoPreta from "../../../../assets/logoPreta.png";
import "./searchInfo.css";
import iconZap from "../../../../assets/whatsapp.png";
import iconInfo from "../../../../assets/info.png";

const SearchInfo: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const whatsappNumber = "554291383593";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navega para a página de resultados com o termo de busca
      navigate(`/busca?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(e as any);
    }
  };

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
          <form onSubmit={handleSearch} className="search-form">
            <label className="search-box" aria-label="Buscar produtos">
              <span className="search-icon" aria-hidden>
                🔍
              </span>
              <input
                type="text"
                placeholder="O que você procura?"
                aria-label="O que você procura?"
                value={searchTerm}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
              />
            </label>
          </form>
        </div>
        <div className="link-div">
          <li className="link">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="link link-whatsapp"
            >
              Fale Conosco!{" "}
              <img src={iconZap} alt="WhatsApp" className="link-icon" />
            </a>
          </li>
          <li className="link">
            <Link to="/sobre" className="link-sobre">
              Sobre Nós{" "}
              <img src={iconInfo} alt="Informações" className="link-icon" />
            </Link>
          </li>
        </div>
      </div>
    </>
  );
};

export default SearchInfo;
