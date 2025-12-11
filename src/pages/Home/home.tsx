import React from "react";
import "./home.css";
import NewsletterSignup from "../../components/header/newLetter/newLetter.js";
import CategoryCarousel from "../../components/CategoryCarousel/CategoryCarousel";
import logoInverno from "../../assets/logoInverno.png";
import logoMae from "../../assets/logoMae.png";
import logoMove from "../../assets/logoMove.png";
import { useHomeViewModel } from "./viewModel/home_viewModel";

const Home: React.FC = () => {
  const { loading, error, getProductsByCategory, getImageUrl } =
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

  const inverno = getProductsByCategory("inverno");
  const maeBebe = getProductsByCategory("mae-bebe");
  const mobilidade = getProductsByCategory("mobilidade");

  return (
    <>
      <NewsletterSignup />
      <h1 className="h1">DESTAQUES!</h1>

      {/* ✅ USANDO O NOVO COMPONENTE DE CARROSSEL */}
      <CategoryCarousel
        title="Inverno"
        products={inverno}
        bannerSrc={logoInverno}
        bannerAlt="Banner Inverno"
        getImageUrl={getImageUrl}
      />

      <CategoryCarousel
        title="Mamãe e bebê"
        products={maeBebe}
        bannerSrc={logoMae}
        bannerAlt="Banner Mamãe e bebê"
        getImageUrl={getImageUrl}
      />

      <CategoryCarousel
        title="Mobilidade"
        products={mobilidade}
        bannerSrc={logoMove}
        bannerAlt="Banner Mobilidade"
        getImageUrl={getImageUrl}
      />
    </>
  );
};

export default Home;
