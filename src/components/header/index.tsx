import React, { useState } from "react";
import { Link, useLocation, useMatch } from "react-router-dom";
import "./Header.css";
import principalLogo from "../../assets/icons/banner.png";
import logoBlog from "../../assets/logoBlog.png";
import ContactInfo from "./component/contactInfo/contactInfo";
import SearchInfo from "./component/searchInfo/searchInfo";
import NewsletterSignup from "./newLetter/newLetter";
import logoVideo from "../../assets/logoVideo.png";
import CartButton from "../cart/CartButton";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();

  // BLOG
  const blogMatch = useMatch("/blog/*"); // cobre /blog e /blog/alguma-coisa
  const isBlog = Boolean(blogMatch);

  // PRODUCT DETAIL – alinhar com ProductDetail (usa slug)
  const productDetailMatch = useMatch("/product/:slug");
  const isProductDetail = Boolean(productDetailMatch);

  // VIDEOS – lista e detalhe
  const videoListMatch = useMatch("/videos");
  const videoDetailMatch = useMatch("/videos/:id"); // ajuste conforme sua rota real
  const isVideoPage = Boolean(videoListMatch || videoDetailMatch);

  // LOGO DINÂMICO
  const logoToShow = isVideoPage
    ? logoVideo
    : isBlog
    ? logoBlog
    : principalLogo;

  return (
    <>
      <ContactInfo />
      <SearchInfo />

      <div className="navbar-container">
        <nav className="">
          <button
            className="menu-toggle"
            aria-label="Abrir menu"
            onClick={() => setMenuOpen((v) => !v)}
          ></button>

          <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
            <li>
              <Link to="/" className="link" onClick={() => setMenuOpen(false)}>
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/" className="link" onClick={() => setMenuOpen(false)}>
                Produtos
              </Link>
            </li>
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
                to="/videos"
                className="link"
                onClick={() => setMenuOpen(false)}
              >
                Videos
              </Link>
            </li>
            <CartButton />
          </ul>
        </nav>
      </div>

      {/* BANNER PRINCIPAL */}
      {!isProductDetail && (
        <div className="logoPrincipal-container">
          <img
            src={logoToShow}
            className="logoPrincipal"
            alt="Banner Principal"
          />
        </div>
      )}
    </>
  );
};

export default Header;
