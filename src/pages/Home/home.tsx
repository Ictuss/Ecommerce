import React from "react";
import "./home.css";
import NewsletterSignup from "../../components/header/newLetter/newLetter.js";
import CategoryCarousel from "../../components/CategoryCarousel/CategoryCarousel";
import { useHomeViewModel } from "./viewModel/home_viewModel";

const Home: React.FC = () => {
  const { loading, error, categories, getProductsByCategory, getImageUrl, getBannerUrl } =
    useHomeViewModel();

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
        <div style={{ textAlign: "center", padding: "50px", fontSize: "24px", color: "red" }}>
          Erro: {error}
        </div>
      </>
    );
  }

  return (
    <>
      <NewsletterSignup />
      <h1 className="h1">DESTAQUES!</h1>

      {categories.map((category) => {
        const produtos = getProductsByCategory(category.slug);
        const bannerUrl = getBannerUrl(category);
        
        if (produtos.length === 0) return null;

        return (
          <CategoryCarousel
            key={category.id}
            title={category.name}
            products={produtos}
            // ← ALTERADO: Só passa bannerSrc se tiver URL válida
            bannerSrc={bannerUrl || undefined}
            bannerAlt={bannerUrl ? `Banner ${category.name}` : undefined}
            getImageUrl={getImageUrl}
          />
        );
      })}
    </>
  );
};

export default Home;