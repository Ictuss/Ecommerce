import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./CategoriasPage.css";
import { Category, categoryService } from "../../services/categories_services";

const CategoryIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
  </svg>
);

const CategoriasPage: React.FC = () => {
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryService
      .getAll()
      .then((data) => {
        setCategorias(data.docs);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar categorias:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="categorias-page">
      {/* Hero Section */}
      <div className="categorias-hero">
        <div className="categorias-hero-content">
          <h1>Todas as Categorias</h1>
          <p>
            Explore nossa linha completa de produtos médicos, odontológicos e
            hospitalares organizados por categoria
          </p>
        </div>
      </div>

      {/* Grid de Categorias */}
      <div className="categorias-container">
        {loading ? (
          <div className="categorias-loading">
            <div className="spinner"></div>
            <p>Carregando categorias...</p>
          </div>
        ) : (
          <div className="categorias-grid">
            {categorias.map((categoria) => (
              <Link
                key={categoria.id}
                to={`/produtos?categoria=${categoria.slug}`}
                className="categoria-card"
              >
                <div className="categoria-icon">
                  <CategoryIcon />
                </div>
                <h3 className="categoria-name">{categoria.name}</h3>
                <span className="categoria-arrow">→</span>
              </Link>
            ))}
          </div>
        )}

        {!loading && categorias.length === 0 && (
          <div className="categorias-empty">
            <p>Nenhuma categoria encontrada.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriasPage;
