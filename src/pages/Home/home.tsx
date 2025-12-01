import React from "react";
import "./home.css";
import { Link } from "react-router-dom";
import litman from "../../assets/1.png";
import NewsletterSignup from "../../components/header/newLetter/newLetter.js";
import logoInverno from "../../assets/logoInverno.png";
import logoMae from "../../assets/logoMae.png";
import logoMove from "../../assets/logoMove.png";
import { useHomeViewModel } from "./viewModel/home_viewModel"; // ✅ IMPORTAR
import { Product } from "../../services/products_services"; // ✅ IMPORTAR

const Home: React.FC = () => {
  // ✅ USAR O VIEWMODEL
  const { loading, error, getProductsByCategory, getImageUrl } =
    useHomeViewModel();

  // ✅ LOADING STATE
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

  // ✅ ERROR STATE
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

  // ✅ BUSCAR PRODUTOS POR CATEGORIA
  const inverno = getProductsByCategory("inverno");
  const maeBebe = getProductsByCategory("mae-bebe");
  const mobilidade = getProductsByCategory("mobilidade");

  return (
    <>
      <NewsletterSignup />
      <h1 className="h1">DESTAQUES!</h1>

      <Section
        title="Inverno"
        products={inverno}
        bannerSrc={logoInverno}
        bannerAlt="Banner Inverno"
        getImageUrl={getImageUrl}
      />

      <Section
        title="Mamãe e bebê"
        products={maeBebe}
        bannerSrc={logoMae}
        bannerAlt="Banner Mamãe e bebê"
        getImageUrl={getImageUrl}
      />

      <Section
        title="Mobilidade"
        products={mobilidade}
        bannerSrc={logoMove}
        bannerAlt="Banner Mobilidade"
        getImageUrl={getImageUrl}
      />
    </>
  );
};

const chunk = <T,>(arr: T[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

const Section: React.FC<{
  title: string;
  products: Product[]; // ✅ TROCAR ProductHome por Product
  bannerSrc: string;
  bannerAlt: string;
  getImageUrl: (product: Product) => string; // ✅ ADICIONAR
}> = ({ title, products, bannerSrc, bannerAlt, getImageUrl }) => {
  const chunks = chunk(products, 8);

  // ✅ SE NÃO TIVER PRODUTOS, NÃO MOSTRA A SEÇÃO
  if (products.length === 0) {
    return null;
  }

  return (
    <>
      <h2 className="section-title">{title}</h2>

      {chunks.map((group, idx) => (
        <React.Fragment key={`${title}-chunk-${idx}`}>
          <div className="home-container">
            {group.map((product) => {
              const imageUrl = getImageUrl(product);

              return (
                <Link
                  to={`/product/${product.slug}`} // ✅ USAR SLUG
                  key={product.id}
                  className="product-link"
                >
                  <div className="card-container">
                    <div className="product-card">
                      <img
                        src={imageUrl} // ✅ SÓ A IMAGEM REAL
                        alt={product.name}
                        className="product-image"
                      />
                      <h2>{product.name}</h2>
                      <p className="product-price">
                        R$ {product.price.toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* banner depois de cada bloco de 8 */}
          <div className="home-container-image">
            <div className="card-container" style={{ width: "100%" }}>
              <div className="banner-card">
                <img src={bannerSrc} alt={bannerAlt} className="banner-image" />
              </div>
            </div>
          </div>
        </React.Fragment>
      ))}
    </>
  );
};

export default Home;
