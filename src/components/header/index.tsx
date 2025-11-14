import React, { useState } from "react";
import { Link, useLocation, useMatch } from "react-router-dom";
import "./Header.css";
import principalLogo from "../../assets/icons/banner.png";
import logoBlog from "../../assets/logoBlog.png";
import ContactInfo from "./component/contactInfo/contactInfo";
import SearchInfo from "./component/searchInfo/searchInfo";
import NewsletterSignup from "./newLetter/newLetter";
import logoVideo from "../../assets/logoVideo.png";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();
  const isBlog = location.pathname.startsWith("/blog");
  const isProductDetail = Boolean(useMatch("/product/:id")); // ✅ /product/<id>

  //const logoToShow = isBlog ? logoBlog : principalLogo;
  const isVideoPage = location.pathname === "/videos";
  const isVideoDetail = Boolean(useMatch("/video/:id"));
  const logoToShow =
    isVideoPage || isVideoDetail
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

          <ul className={`nav-links`}>
            <li>
              <Link to="/" className="link" onClick={() => setMenuOpen(false)}>
                Inicio
              </Link>
            </li>
            {/* <li><Link to="/modelos" className="link" onClick={() => setMenuOpen(false)}>Modelos</Link></li> */}
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
              <Link to="/videos" className="link" onClick={() => setMenuOpen(false)}>
                Videos
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      {/* BANNER PRINCIPAL */}
    {!isProductDetail && (
        <div className="logoPrincipal-container">
          <img src={logoToShow} className="logoPrincipal" alt="Banner Principal" />
        </div>
      )}
    </>
  );
};

export default Header;
