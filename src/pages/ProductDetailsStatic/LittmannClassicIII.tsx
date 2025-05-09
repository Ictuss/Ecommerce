// src/pages/ProductDetailsStatic/LittmannClassicIII.tsx
import React from 'react';
import './littmannClassicIII.css';
import litmann1 from "../../assets/1.png" 
import litmann2 from "../../assets/2.png"
import litmann3 from "../../assets/3.png"
import litmann4 from "../../assets/4.png"

const LittmannClassicIII: React.FC = () => {
  return (
    <div className="product-page">
      <h1 className="titulo">informações</h1>
      <h2 className="subtitulo">Littmann Classic III - Vinho - 5627</h2>
      <div className="conteudo">
        <div className="descricao">
          <p>
            O estetoscópio Littmann® Classic III oferece alta sensibilidade acústica para um desempenho excepcional nas avaliações clínicas dos profissionais de saúde.
            Possui diafragmas ajustáveis e um novo design que é mais fácil de colocar e de limpar devido a sua superfície lisa sem fendas.
          </p>

          <h3>Principais Características:</h3>
          <ul>
            <li>Auscultador de dois lados, com diafragmas ajustáveis em ambos os lados</li>
            <li>Para uso adulto e pediátrico.</li>
            <li>Diafragma de peça única, fácil de remover, colocar e limpar.</li>
            <li>Face pediátrica pode virar campânula tradicional.</li>
            <li>Tubo biauricular mais resistente à oleosidade e álcool.</li>
            <li>Olivas de selamento suave com ajuste confortável.</li>
          </ul>

          <h3>Modo de Usar</h3>
          <p>
            Abra o lado do auscultador que está sendo utilizado. Isso é feito segurando a base e rodando com a outra mão até sentir um clique.
          </p>

          <h3>Especificações Técnicas</h3>
          <ul>
            <li>Auscultador: Duplo</li>
            <li>Peso do auscultador: 82g</li>
            <li>Cor: Black Edition</li>
            <li>Diâmetro do diafragma: 4,3cm</li>
            <li>Material: Epóxi/Fibra de vidro</li>
            <li>Tipo de diafragma: Ajustável</li>
            <li>Vedação das olivas: Suave</li>
            <li>Olivas extras: Sim</li>
            <li>Comprimento: 69cm</li>
            <li>Diâmetro do sino pequeno: 3,3cm</li>
            <li>Garantia: 5 anos</li>
          </ul>

          <h3>Acompanha:</h3>
          <ul>
            <li>Estetoscópio Littmann® Classic III™ – 3M</li>
            <li>Manual de instruções</li>
            <li>Par adicional de olivas rígidas</li>
          </ul>
        </div>
        <div className="imagens">
          <img src={litmann2} alt="Littmann 2" />
          <img src={litmann1} alt="Littmann 1" />
          <img src={litmann3} alt="Littmann 3" />
          <img src={litmann4} alt="Littmann 4" />
        </div>
      </div>
    </div>
  );
};

export default LittmannClassicIII;
