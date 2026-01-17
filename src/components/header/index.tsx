import React, { useState, useEffect } from "react";
import { Link, useMatch } from "react-router-dom";
import "./Header.css";
import principalLogo from "../../assets/icons/banner.png";
import logoBlog from "../../assets/logoBlog.png";
import ContactInfo from "./component/contactInfo/contactInfo";
import SearchInfo from "./component/searchInfo/searchInfo";
import logoVideo from "../../assets/logoVideo.png";
import CartButton from "../cart/CartButton";
import { categoryService, Category } from "../../services/categories_services";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [produtosOpen, setProdutosOpen] = useState(false);
  const [categorias, setCategorias] = useState<Category[]>([]);

  useEffect(() => {
    categoryService
      .getAll()
      .then((data) => setCategorias(data.docs))
      .catch((err) => console.error("Erro ao carregar categorias:", err));
  }, []);

  const blogMatch = useMatch("/blog/*");
  const isBlog = Boolean(blogMatch);

  const productDetailMatch = useMatch("/product/:slug");
  const isProductDetail = Boolean(productDetailMatch);

  const videoListMatch = useMatch("/videos");
  const videoDetailMatch = useMatch("/videos/:id");
  const isVideoPage = Boolean(videoListMatch || videoDetailMatch);

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
        <nav>
          <button
            className="menu-toggle"
            aria-label="Abrir menu"
            onClick={() => setMenuOpen((v) => !v)}
          ></button>

          <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
            <li>
              <Link to="/" className="link">
                Inicio
              </Link>
            </li>

            <li className="dropdown">
              <button
                type="button"
                className="link produtos-btn"
                onClick={() => setProdutosOpen((v) => !v)}
              >
                <span className="produtos-text">Produtos</span>
                <span className={`arrow ${produtosOpen ? "open" : ""}`}>▼</span>
              </button>

              {produtosOpen && (
                <div className="dropdown-menu-wrapper">
                  <ul className="dropdown-menu dropdown-menu-grid">
                    <li className="dropdown-header">
                      <Link to="/" onClick={() => setProdutosOpen(false)}>
                        Ver Todos os Produtos
                      </Link>
                    </li>

                    {categorias.map((cat) => (
                      <li key={cat.id}>
                        <Link
                          to={`/produtos?categoria=${cat.slug}`}
                          onClick={() => setProdutosOpen(false)}
                        >
                          {cat.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
            <li>
              <Link to="/produtos?categoria=sob-encomenda" className="link">
                Sob Encomenda
              </Link>
            </li>
            <li>
              <Link to="/blog" className="link">
                Blog
              </Link>
            </li>
            <li>
              <Link to="/videos" className="link">
                Videos
              </Link>
            </li>
            <li className="cart-menu-item">
              <CartButton showLabel={true} />
            </li>
          </ul>
        </nav>
      </div>

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
