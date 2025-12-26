import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Product } from "../../services/products_services";
import { useHomeViewModel } from "../Home/viewModel/home_viewModel";
import "./SearchResults.css";

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("q") || "";
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const { loading, error, products, getImageUrl } = useHomeViewModel();

  useEffect(() => {
    if (products && searchTerm) {
      // Filtrar produtos baseado no termo de busca
      const results = products.filter((product) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          product.name.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower) ||
          (typeof product.category === 'object' ? product.category.name : '').toLowerCase().includes(searchLower)
        );
      });
      setFilteredProducts(results);
    } else {
      setFilteredProducts([]);
    }
  }, [searchTerm, products]);

  if (loading) {
    return (
      <div className="search-results-container">
        <div className="loading-message">Buscando produtos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="search-results-container">
        <div className="error-message">Erro ao buscar produtos: {error}</div>
      </div>
    );
  }

  return (
    <div className="search-results-container">
      <div className="search-header">
        <h1>Resultados da busca</h1>
        <p className="search-term">
          {filteredProducts.length > 0
            ? `${filteredProducts.length} resultado(s) para "${searchTerm}"`
            : `Nenhum resultado encontrado para "${searchTerm}"`}
        </p>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="search-results-grid">
          {filteredProducts.map((product) => {
            const imageUrl = getImageUrl(product);

            return (
              <Link
                to={`/product/${product.slug}`}
                key={product.id}
                className="search-product-link"
              >
                <div className="search-product-card">
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="search-product-image"
                  />
                  <h2 className="search-product-name">{product.name}</h2>
                  <p className="search-product-price">
                    R$ {product.price.toFixed(2).replace(".", ",")}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="no-results">
          <p>Não encontramos produtos para sua busca.</p>
          <p className="suggestion">
            Tente usar palavras-chave diferentes ou navegue pelas nossas
            categorias.
          </p>
          <Link to="/" className="back-home-btn">
            Voltar para a página inicial
          </Link>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
