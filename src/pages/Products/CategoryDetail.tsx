import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./CategoryDetail.css";
import { useHomeViewModel } from "../Home/viewModel/home_viewModel";

// Banners
import logoInverno from "../../assets/logoInverno.png";
import logoMae from "../../assets/logoMae.png";
import logoMove from "../../assets/logoMove.png";

// Config das categorias
const CATEGORIAS: Record<string, { title: string; banner: string }> = {
  mobilidade: { title: "Mobilidade", banner: logoMove },
  "mae-bebe": { title: "Mamãe e Bebê", banner: logoMae },
  inverno: { title: "Inverno", banner: logoInverno },
  "produtos-ortopedicos": { title: "Produtos Ortopédicos", banner: logoMove },
  "produtos-terapeuticos": { title: "Produtos Terapêuticos", banner: logoMove },
  estetica: { title: "Estética", banner: logoMove },
};

const CategoryDetail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoria = searchParams.get("categoria") || "";

  const { loading, error, getProductsByCategory, getImageUrl } =
    useHomeViewModel();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;

  if (loading) {
    return (
      <div className="category-detail-loading">Carregando produtos...</div>
    );
  }

  if (error) {
    return <div className="category-detail-error">Erro: {error}</div>;
  }

  const config = CATEGORIAS[categoria];

  // Categoria não existe
  if (!config) {
    return (
      <div className="category-detail-empty">
        <h1>Categoria não encontrada</h1>
        <Link to="/" className="btn-voltar">
          Voltar para Home
        </Link>
      </div>
    );
  }

  const products = getProductsByCategory(categoria);

  // Sem produtos
  if (products.length === 0) {
    return (
      <div className="category-detail-empty">
        <h1>{config.title}</h1>
        <p>Nenhum produto encontrado nesta categoria.</p>
        <Link to="/" className="btn-voltar">
          Voltar para Home
        </Link>
      </div>
    );
  }

  // Paginação
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const currentProducts = products.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const goToNextPage = () => setCurrentPage((prev) => (prev + 1) % totalPages);
  const goToPrevPage = () =>
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);

  return (
    <div className="category-detail">
      {/* Banner */}
      <div className="category-detail-banner">
        <img src={config.banner} alt={config.title} />
      </div>

      {/* Título */}
      <h1 className="category-detail-title">{config.title}</h1>
      <p className="category-detail-count">{products.length} produtos</p>

      {/* Grid de produtos */}
      <section className="category-section">
        <div className="carousel-wrapper">
          {totalPages > 1 && (
            <button
              className="carousel-btn carousel-btn-prev"
              onClick={goToPrevPage}
            >
              ‹
            </button>
          )}

          <div className="products-grid">
            {currentProducts.map((product) => (
              <Link
                to={`/product/${product.slug}`}
                key={product.id}
                className="product-link"
              >
                <div className="product-card">
                  <img
                    src={getImageUrl(product)}
                    alt={product.name}
                    className="product-image"
                  />
                  <h2>{product.name}</h2>
                  <p className="product-price">
                    R$ {product.price.toFixed(2).replace(".", ",")}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <button
              className="carousel-btn carousel-btn-next"
              onClick={goToNextPage}
            >
              ›
            </button>
          )}
        </div>

        {/* Bolinhas de paginação */}
        {totalPages > 1 && (
          <div className="carousel-dots">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentPage ? "active" : ""}`}
                onClick={() => setCurrentPage(index)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Voltar */}
      <div className="category-detail-footer">
        <Link to="/" className="btn-voltar">
          ← Voltar para Home
        </Link>
      </div>
    </div>
  );
};

export default CategoryDetail;
