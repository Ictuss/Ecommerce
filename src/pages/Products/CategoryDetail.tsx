import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./CategoryDetail.css";
import { useHomeViewModel } from "../Home/viewModel/home_viewModel";

const CategoryDetail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoriaSlug = searchParams.get("categoria") || "";

  const { 
    loading, 
    error, 
    categories, // ← Pega as categorias do viewModel
    getProductsByCategory, 
    getImageUrl,
    getBannerUrl // ← Pega a função de banner
  } = useHomeViewModel();
  
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

  // ← NOVO: Busca categoria dinâmica
  const categoria = categories.find((cat) => cat.slug === categoriaSlug);

  // Categoria não existe
  if (!categoria) {
    return (
      <div className="category-detail-empty">
        <h1>Categoria não encontrada</h1>
        <Link to="/" className="btn-voltar">
          Voltar para Home
        </Link>
      </div>
    );
  }

  const products = getProductsByCategory(categoriaSlug);

  // Sem produtos
  if (products.length === 0) {
    return (
      <div className="category-detail-empty">
        <h1>{categoria.name}</h1>
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

  // ← NOVO: Pega URL do banner
  const bannerUrl = getBannerUrl(categoria);

  return (
    <div className="category-detail">
      {/* Banner - só mostra se existir */}
      {bannerUrl && (
        <div className="category-detail-banner">
          <img src={bannerUrl} alt={categoria.name} />
        </div>
      )}

      {/* Título */}
      <h1 className="category-detail-title">{categoria.name}</h1>
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