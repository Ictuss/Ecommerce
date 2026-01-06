import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./CategoryCarousel.css";
import { Product } from "../../services/products_services";

interface CategoryCarouselProps {
  title: string;
  products: Product[];
  bannerSrc?: string;
  bannerAlt?: string;
  getImageUrl: (product: Product) => string;
}

const CategoryCarousel: React.FC<CategoryCarouselProps> = ({
  title,
  products,
  bannerSrc,
  bannerAlt,
  getImageUrl,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;

  // Se não tiver produtos, não mostra nada
  if (products.length === 0) {
    return null;
  }

  // Dividir produtos em páginas de 8
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const currentProducts = products.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  // Função auxiliar para formatar preço
  const formatPrice = (price: number | null | undefined): string => {
    if (price == null || isNaN(price)) {
      return "Consulte-nos";
    }
    return `R$ ${price.toFixed(2).replace(".", ",")}`;
  };

  return (
    <section className="category-section">
      <h2 className="section-title">{title}</h2>

      {/* Container do carrossel */}
      <div className="carousel-wrapper">
        {/* Botão anterior - só aparece no desktop */}
        {totalPages > 1 && (
          <button
            className="carousel-btn carousel-btn-prev"
            onClick={goToPrevPage}
            aria-label="Página anterior"
          >
            ‹
          </button>
        )}

        {/* Grid de produtos */}
        <div className="products-grid">
          {currentProducts.map((product) => {
            const imageUrl = getImageUrl(product);

            return (
              <Link
                to={`/product/${product.slug}`}
                key={product.id}
                className="product-link"
              >
                <div className="product-card">
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="product-image"
                  />
                  <h2>{product.name}</h2>
                  <p className="product-price">{formatPrice(product.price)}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Botão próximo - só aparece no desktop */}
        {totalPages > 1 && (
          <button
            className="carousel-btn carousel-btn-next"
            onClick={goToNextPage}
            aria-label="Próxima página"
          >
            ›
          </button>
        )}
      </div>

      {/* Indicador de páginas (bolinhas) - só desktop */}
      {totalPages > 1 && (
        <div className="carousel-dots">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentPage ? "active" : ""}`}
              onClick={() => setCurrentPage(index)}
              aria-label={`Ir para página ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Banner da categoria - SÓ RENDERIZA SE TIVER bannerSrc */}
      {bannerSrc && (
        <div className="category-banner">
          <img
            src={bannerSrc}
            alt={bannerAlt || title}
            className="banner-image"
          />
        </div>
      )}
    </section>
  );
};

export default CategoryCarousel;
