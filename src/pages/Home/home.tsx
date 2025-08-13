import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import { mockProducts } from "../../mock/mockProdutcs.js";
import litman from "../../assets/1.png";

const Home: React.FC = () => {
  return (
    <>
      <h1 className="h1">Destaques</h1>

      {/* No mobile, este container vira carrossel horizontal com snap */}
      <div className="home-container">
        {mockProducts.map((product: any) => (
          <Link to={product.path}>
            <div className="card-container" key={product.id}>
              <div className="product-card">
                <img
                  src={product.image === "litman" ? litman : product.image}
                  alt={product.name}
                  className="product-image"
                />
                <h2>{product.name}</h2>
                {/* <p className="product-description">{product.description}</p> */}

                <p className="product-price">{product.price}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Home;
