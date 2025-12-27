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
  const [categoriasExpanded, setCategoriasExpanded] = useState(false); // ← NOVO
  const [categorias, setCategorias] = useState<Category[]>([]);

  const LIMIT_INITIAL = 6; // ← Quantas categorias mostrar inicialmente

  useEffect(() => {
    categoryService.getAll()
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

  // ← NOVO: Categorias a mostrar (limitadas ou todas)
  const categoriasToShow = categoriasExpanded 
    ? categorias 
    : categorias.slice(0, LIMIT_INITIAL);

  const hasMore = categorias.length > LIMIT_INITIAL;

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
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/" onClick={() => setProdutosOpen(false)}>
                      Ver Todos
                    </Link>
                  </li>
                  
                  {/* ← ALTERADO: Usa categoriasToShow em vez de categorias */}
                  {categoriasToShow.map((cat) => (
                    <li key={cat.id}>
                      <Link
                        to={`/produtos?categoria=${cat.slug}`}
                        onClick={() => setProdutosOpen(false)}
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}

                  {/* ← NOVO: Botão "Ver mais" / "Ver menos" */}
                  {hasMore && (
                    <li>
                      <button
                        type="button"
                        onClick={() => setCategoriasExpanded((v) => !v)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          background: 'none',
                          border: 'none',
                          padding: '10px 16px',
                          color: '#333',
                          cursor: 'pointer',
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '14px',
                          fontWeight: '500',
                        }}
                      >
                        {categoriasExpanded ? '▲ Ver menos' : '▼ Ver mais categorias'}
                      </button>
                    </li>
                  )}
                </ul>
              )}
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
            <CartButton />
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