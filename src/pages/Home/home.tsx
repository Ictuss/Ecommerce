import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import litman from "../../assets/1.png"
const Home: React.FC = () => {
  return (
    <div className="home-container">
      <h1>Destaques</h1>
      <div className="card-container">
        <div className="product-card">
          <h2>Estetoscópio Littmann Classic III</h2>
          <img
            src={litman} // Coloque a imagem na pasta public/images
            alt="Estetoscópio Littmann Classic III"
            className="product-image"
          />
          <p className="product-description">
            O Littmann Classic III oferece acústica de excelência para profissionais de saúde.
          </p>
          <p className="product-price">R$ 799,90</p>
          <Link to="/product/littmann-classic-iii" className="product-button">
            Ver Detalhes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
