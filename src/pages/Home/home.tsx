import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import { mockProducts } from "../../mock/mockProdutcs.js";
import litman from "../../assets/1.png";
import NewsletterSignup from "../../components/header/newLetter/newLetter.js";
import logoInverno from "../../assets/logoInverno.png";
import logoMae from "../../assets/logoMae.png";
import logoMove from "../../assets/logoMove.png";

type Product = {
  id: string | number;
  name: string;
  price: string;
  image: string;
  path: string;
  category: "inverno" | "mae-bebe" | "mobilidade"; // <-- add mobilidade
};

const chunk = <T,>(arr: T[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

const Section: React.FC<{
  title: string;
  products: Product[];
  bannerSrc: string;
  bannerAlt: string;
}> = ({ title, products, bannerSrc, bannerAlt }) => {
  const chunks = chunk(products, 8);

  return (
    <>
      <h2 className="section-title">{title}</h2>

      {chunks.map((group, idx) => (
        <React.Fragment key={`${title}-chunk-${idx}`}>
          <div className="home-container">
            {group.map((product) => (
              <Link to={product.path} key={product.id}>
                <div className="card-container">
                  <div className="product-card">
                    <img
                      src={product.image === "litman" ? litman : product.image}
                      alt={product.name}
                      className="product-image"
                    />
                    <h2>{product.name}</h2>
                    <p className="product-price">{product.price}</p>
                  </div>
                </div>
              </Link>
            ))}
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

const Home: React.FC = () => {
  const inverno = (mockProducts as Product[]).filter(
    (p) => p.category === "inverno"
  );
  const maeBebe = (mockProducts as Product[]).filter(
    (p) => p.category === "mae-bebe"
  );
  const mobilidade = (mockProducts as Product[]).filter(
    (p) => p.category === "mobilidade"
  );

  return (
    <>
      <NewsletterSignup />
      <h1 className="h1">Destaques</h1>

      <Section
        title="Inverno"
        products={inverno}
        bannerSrc={logoInverno}
        bannerAlt="Banner Inverno"
      />

      <Section
        title="Mamãe e bebê"
        products={maeBebe}
        bannerSrc={logoMae}
        bannerAlt="Banner Mamãe e bebê"
      />

      <Section
        title="Mobilidade"
        products={mobilidade}
        bannerSrc={logoMove}
        bannerAlt="Banner Mobilidade"
      />
    </>
  );
};

export default Home;
