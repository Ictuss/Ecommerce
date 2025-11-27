import React from "react";
import "./aboutus.css";

const SobreNos: React.FC = () => {
  return (
    <section className="sobre">
      <h2 className="titulo">SOBRE</h2>
      <div className="cards">
        <div className="card from-left">
          <div className="icone">📄</div>
          <h3>MISSÃO</h3>
          <p>
            Comercializar, dentro dos mais altos preceitos éticos e de
            qualidade, produtos médicos, odontológicos e hospitalares,
            contribuindo para a promoção, prevenção e preservação da saúde
            humana.
          </p>
        </div>
        <div className="card from-bottom">
          <div className="icone">👁️</div>
          <h3>VISÃO</h3>
          <p>
            Ser referência no comércio de produtos médicos, odontológicos e
            hospitalares, oferecendo o que há de melhor em produtos para a
            saúde.
          </p>
        </div>
        <div className="card from-right">
          <div className="icone">❤️</div>
          <h3>VALORES</h3>
          <p>
            Comprometimento, Credibilidade, Eficiência, Ética, Inovação,
            Integridade, Melhoria Contínua, Respeito, Responsabilidade e
            Valorização Humana.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SobreNos;
