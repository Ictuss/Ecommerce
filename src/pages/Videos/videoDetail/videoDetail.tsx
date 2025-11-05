// src/pages/Videos/VideoDetail.tsx
import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './VideoDetail.css';
import { videosData } from '../../../data/videosData';

const VideoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const video = useMemo(
    () => videosData.find((v) => v.id === Number(id)),
    [id]
  );

  // Se id não existe, dá um fallback simples
  if (!video) {
    return (
      <div className="video-detail-page">
        <div className="video-detail video-detail--notfound">
          <p>Vídeo não encontrado.</p>
          <button onClick={() => navigate('/videos')}>Voltar para vídeos</button>
        </div>
      </div>
    );
  }

  // mock de produtos por enquanto, depois dá pra amarrar com o vídeo
  const products = [
    {
      id: 1,
      image: '/imgs/produto-aspirar-baby.png',
      name: 'Aspirar baby',
      description: 'Desentupidor de nariz',
      price: 'R$ 8,00',
    },
    {
      id: 2,
      image: '/imgs/produto-aspirar-baby.png',
      name: 'Aspirar baby',
      description: 'Desentupidor de nariz',
      price: 'R$ 8,00',
    },
    {
      id: 3,
      image: '/imgs/produto-aspirar-baby.png',
      name: 'Aspirar baby',
      description: 'Desentupidor de nariz',
      price: 'R$ 8,00',
    },
  ];

  const renderLinesWithBreaks = (text: string) =>
    text.split('\n').map((line, index, arr) => (
      <React.Fragment key={index}>
        {line}
        {index < arr.length - 1 && <br />}
      </React.Fragment>
    ));

  return (
    <div className="video-detail-page">
      <section className="video-detail">
        {/* TOPO: VÍDEO + TÍTULO/DESC */}
        <div className="video-detail__header">
          {/* ESQUERDA – VÍDEO */}
          <button
            type="button"
            className="video-detail__media"
            aria-label={`Reproduzir vídeo ${video.mainTitle.replace('\n', ' ')}`}
            onClick={() => console.log('play vídeo', video.id)}
          >
            <img
              src={video.videoThumbnail}
              alt={video.mainTitle.replace('\n', ' ')}
              className="video-detail__thumbnail"
            />

            <div className="video-detail__media-overlay">
              <div className="video-detail__play-button">
                <svg
                  width="80"
                  height="80"
                  viewBox="0 0 80 80"
                  aria-hidden="true"
                >
                  <circle cx="40" cy="40" r="40" />
                  <path d="M32 24L54 40L32 56V24Z" />
                </svg>
              </div>
            </div>

            <div className="video-detail__media-footer">ICTUS</div>
          </button>

          {/* DIREITA – TÍTULO + DESCRIÇÃO */}
          <div className="video-detail__info">
            <h1 className="video-detail__title">
              {renderLinesWithBreaks(video.mainTitle)}
            </h1>

            <p className="video-detail__description">
              {video.descriptionText}
            </p>
          </div>
        </div>

        {/* SEÇÃO PRODUTOS NESSE VÍDEO */}
        <div className="video-detail__products">
          <h2 className="video-detail__products-title">Produtos nesse vídeo</h2>

          <div className="video-detail__products-row">
            <div className="video-detail__products-list">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="video-detail__product-card"
                >
                  <div className="video-detail__product-image-wrapper">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="video-detail__product-image"
                    />
                  </div>

                  <div className="video-detail__product-info">
                    <p className="video-detail__product-name">
                      {product.name}
                    </p>
                    <p className="video-detail__product-description">
                      {product.description}
                    </p>
                    <p className="video-detail__product-price">
                      {product.price}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <div className="video-detail__products-more">
              <span className="video-detail__products-more-icon">+</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VideoDetail;
