// src/pages/Videos/VideoDetail.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./VideoDetail.css";
import { videosData } from "../../../data/videosData";
import { apiService } from "../../../services/api";

type VideoProduct = {
  id: string | number;
  image: string;
  name: string;
  description?: string;
  price: string;
  category?: string;
  slug?: string;
};

const VideoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // vídeo ainda é estático (mock)
  const video = useMemo(
    () => videosData.find((v) => v.id === Number(id)),
    [id]
  );

  // ⬇️ estados PRECISAM vir antes de qualquer return condicional
  const [products, setProducts] = useState<VideoProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [errorProducts, setErrorProducts] = useState<string | null>(null);

  useEffect(() => {
    // se não tiver vídeo ou categoria, não faz nada
    if (!video?.category) return;

    const loadProducts = async () => {
      try {
        setLoadingProducts(true);
        setErrorProducts(null);

        // Busca produtos da MESMA categoria no Payload
        const docs = await apiService.fetchProducts(video.category);

        // Mapeia pro formato usado na tela
        const formatted: VideoProduct[] = docs.map((product: any) => ({
          id: product.id,
          name: product.name,
          price: `R$ ${product.salePrice ?? product.price}`,
          image:
            product.images?.[0]?.image?.url || "/imgs/fallback-produto.png",
          description: product.description ?? "",
          category: product.category,
          slug: product.slug,
        }));

        setProducts(formatted);
      } catch (error) {
        console.error(error);
        setErrorProducts("Não foi possível carregar os produtos desse vídeo.");
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, [video?.category]);

  // ⬇️ aqui pode retornar, mas depois dos hooks
  if (!video) {
    return (
      <div className="video-detail-page">
        <div className="video-detail video-detail--notfound">
          <p>Vídeo não encontrado.</p>
          <button onClick={() => navigate("/videos")}>
            Voltar para vídeos
          </button>
        </div>
      </div>
    );
  }

  const truncateText = (text: string, max = 180) => {
    if (!text) return "";
    return text.length > max ? `${text.slice(0, max)}...` : text;
  };

  const renderLinesWithBreaks = (text: string) =>
    text.split("\n").map((line, index, arr) => (
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
            aria-label={`Reproduzir vídeo ${video.mainTitle.replace(
              "\n",
              " "
            )}`}
            onClick={() => console.log("play vídeo", video.id)}
          >
            <img
              src={video.videoThumbnail}
              alt={video.mainTitle.replace("\n", " ")}
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

            <p className="video-detail__description">{video.descriptionText}</p>

            {products.length > 0 && (
              <div className="video-detail__products">
                <h2 className="video-detail__products-title">
                  Produtos nesse vídeo
                </h2>

                <div className="video-detail__products-row">
                  <div className="video-detail__products-list">
                    {products.map((product) => (
                      <article
                        key={product.id}
                        className="video-detail__product-card"
                        onClick={() => navigate(`/product/${product.slug}`)}
                        role="button"
                        style={{ cursor: "pointer" }}
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
                          {product.description && (
                            <p className="video-detail__product-description">
                              {truncateText(product.description, 180)}
                            </p>
                          )}
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
            )}

            {loadingProducts && <p>Carregando produtos...</p>}
            {errorProducts && <p>{errorProducts}</p>}
          </div>
        </div>

        {/* PRODUTOS RELACIONADOS */}
        <section className="video-related-products">
          <h2 className="video-related-title">Produtos relacionados:</h2>

          <div className="video-related-list">
            {products.map((product) => (
              <article
                key={product.id}
                className="video-related-card"
                onClick={() => navigate(`/product/${product.slug}`)}
              >
                <div className="video-related-image-wrapper">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="video-related-image"
                  />
                </div>

                <p className="video-related-name">{product.name}</p>
                <p className="video-related-price">{product.price}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
};

export default VideoDetail;
