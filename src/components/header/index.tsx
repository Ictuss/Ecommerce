import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import principalLogo from "../../assets/icons/banner.png";
import ContactInfo from "./component/contactInfo/contactInfo";
import SearchInfo from "./component/searchInfo/searchInfo";
import NewsletterSignup from "./newLetter/newLetter";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <ContactInfo />
      <SearchInfo />
      <div className="navbar-container">
        <nav className="">
          <button
            className="menu-toggle"
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          ></button>

          <ul className={`nav-links ${menuOpen ? "is-open" : ""}`}>
            <li>
              <Link to="/" className="link" onClick={() => setMenuOpen(false)}>
                Página Inicial
              </Link>
            </li>
            {/* <li><Link to="/modelos" className="link" onClick={() => setMenuOpen(false)}>Modelos</Link></li> */}
            <li>
              <Link
                to="/blog"
                className="link"
                onClick={() => setMenuOpen(false)}
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                to="/contato"
                className="link"
                onClick={() => setMenuOpen(false)}
              >
                Contato
              </Link>
            </li>
            <li>
              <Link
                to="/sobre-nos"
                className="link"
                onClick={() => setMenuOpen(false)}
              >
                Sobre Nós
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      {/* BANNER PRINCIPAL */}
      <div className="logoPrincipal-container">
        <img
          src={principalLogo}
          className="logoPrincipal"
          alt="Banner Principal"
        />
      </div>

      <NewsletterSignup/>
    </>
  );
};

export default Header;
