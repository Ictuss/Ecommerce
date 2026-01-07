import React, { useState } from "react";
import "./home.css";
import NewsletterSignup from "../../components/header/newLetter/newLetter.js";
import CategoryCarousel from "../../components/CategoryCarousel/CategoryCarousel";
import { useHomeViewModel } from "./viewModel/home_viewModel";

const Home: React.FC = () => {
  const {
    loading,
    error,
    categories,
    getProductsByCategory,
    getImageUrl,
    getBannerUrl,
  } = useHomeViewModel();

  const [showAll, setShowAll] = useState(false);

  if (loading) {
    return (
      <>
        <NewsletterSignup />
        <div style={{ textAlign: "center", padding: "50px", fontSize: "24px" }}>
          Carregando produtos...
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NewsletterSignup />
        <div
          style={{
            textAlign: "center",
            padding: "50px",
            fontSize: "24px",
            color: "red",
          }}
        >
          Erro: {error}
        </div>
      </>
    );
  }

  // Separar categorias com e sem banner
  const categoriasComBanner = categories.filter((category) => {
    const bannerUrl = getBannerUrl(category);
    const produtos = getProductsByCategory(category.slug);
    return bannerUrl && produtos.length > 0;
  });

  const categoriasSemBanner = categories.filter((category) => {
    const bannerUrl = getBannerUrl(category);
    const produtos = getProductsByCategory(category.slug);
    return !bannerUrl && produtos.length > 0;
  });

  // Determina quais categorias mostrar
  const categoriasParaMostrar = showAll
    ? [...categoriasComBanner, ...categoriasSemBanner]
    : categoriasComBanner;

  return (
    <>
      <NewsletterSignup />
      <h1 className="h1">DESTAQUES!</h1>

      {categoriasParaMostrar.map((category) => {
        const produtos = getProductsByCategory(category.slug);
        const bannerUrl = getBannerUrl(category);

        return (
          <CategoryCarousel
            key={category.id}
            title={category.name}
            products={produtos}
            bannerSrc={bannerUrl || undefined}
            bannerAlt={bannerUrl ? `Banner ${category.name}` : undefined}
            getImageUrl={getImageUrl}
          />
        );
      })}

      {/* Botão para mostrar mais categorias */}
      {!showAll && categoriasSemBanner.length > 0 && (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <button
            onClick={() => setShowAll(true)}
            style={{
              padding: "15px 40px",
              fontSize: "18px",
              backgroundColor: "#ff0000",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#f56868ff")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#ff0000")
            }
          >
            Ver Mais Categorias
          </button>
        </div>
      )}
    </>
  );
};

export default Home;
