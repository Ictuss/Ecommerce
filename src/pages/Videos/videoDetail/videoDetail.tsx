import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./videoDetail.css";
import { apiService } from "../../../services/api";
import { buildImageUrl, buildVideoUrl } from "../../../config/env";

type VideoProduct = {
  id: string | number;
  name: string;
  price: string;
  description?: string;
  slug?: string;
  images: {
    image: {
      url: string;
    };
  }[];
};

type CmsVideo = {
  id: string | number;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnail?: {
    url?: string;
  };
  instagramUrl?: string;
  relatedProducts?: VideoProduct[];
};

const VideoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [video, setVideo] = useState<CmsVideo | null>(null);
  const [products, setProducts] = useState<VideoProduct[]>([]);
  const [loadingVideo, setLoadingVideo] = useState(true);
  const [instagramEmbed, setInstagramEmbed] = useState("");
  const [loadingEmbed, setLoadingEmbed] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;

    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) return match[1];
    }

    return null;
  };

  const isYouTubeUrl = (url: string) =>
    url.includes("youtube.com") || url.includes("youtu.be");

  const getFirstProductImageUrl = (
    product: VideoProduct
  ): string | undefined => {
    if (!product.images?.length) return undefined;
    const rawUrl = product.images[0]?.image?.url;
    return rawUrl ? buildImageUrl(rawUrl) : undefined;
  };

  // 🔹 LOAD VIDEO + RELATED PRODUCTS
  useEffect(() => {
    const loadVideo = async () => {
      try {
        setLoadingVideo(true);

        const videos = await apiService.fetchVideos();
        const foundVideo = videos.find((v: any) => String(v.id) === String(id));

        if (!foundVideo) return;

        let thumbnailUrl = "";
        if (foundVideo.thumbnail) {
          thumbnailUrl =
            foundVideo.thumbnail?.sizes?.thumbnail?.url ||
            foundVideo.thumbnail?.url ||
            "";
        }

        let rawVideoUrl = "";

        if (foundVideo.videoFile) {
          rawVideoUrl =
            foundVideo.videoFile?.url || foundVideo.videoFile?.filename || "";
        }

        if (!rawVideoUrl && foundVideo.videoUrl) {
          rawVideoUrl = foundVideo.videoUrl;
        }

        const finalVideoUrl = buildVideoUrl(rawVideoUrl);

        const relatedProducts =
          foundVideo.relatedProducts
            ?.filter(
              (product: any) =>
                product && typeof product === "object" && product.id
            )
            ?.map((product: any) => ({
              id: product.id,
              name: product.name,
              price: `R$ ${product.salePrice ?? product.price ?? 0}`,
              images: product.images ?? [],
              description: product.description ?? "",
              slug: product.slug,
            })) ?? [];

        setVideo({
          id: foundVideo.id,
          title: foundVideo.title,
          description: foundVideo.description,
          videoUrl: finalVideoUrl,
          thumbnail: { url: thumbnailUrl },
          instagramUrl: foundVideo.instagramUrl,
          relatedProducts,
        });

        setProducts(relatedProducts);
      } catch (error) {
        console.error("Erro ao carregar vídeo:", error);
      } finally {
        setLoadingVideo(false);
      }
    };

    loadVideo();
  }, [id]);

  // 🔹 INSTAGRAM OEMBED
  useEffect(() => {
    if (!video?.instagramUrl) return;

    const loadInstagramEmbed = async () => {
      try {
        setLoadingEmbed(true);

        const response = await fetch(
          `https://api.instagram.com/oembed/?url=${encodeURIComponent(
            video.instagramUrl
          )}`
        );
        const data = await response.json();

        if (data.html) {
          setInstagramEmbed(data.html);
        }
      } catch (error) {
        console.error("Erro ao carregar embed do Instagram:", error);
      } finally {
        setLoadingEmbed(false);
      }
    };

    loadInstagramEmbed();
  }, [video?.instagramUrl]);

  useEffect(() => {
    if (!instagramEmbed) return;

    const container = document.getElementById("instagram-embed-container");
    if (!container) return;

    container.innerHTML = instagramEmbed;

    const script = document.createElement("script");
    script.src = "//www.instagram.com/embed.js";
    script.async = true;
    document.body.appendChild(script);

    if ((window as any).instgrm) {
      (window as any).instgrm.Embeds.process();
    }

    return () => {
      if (script.parentNode) document.body.removeChild(script);
    };
  }, [instagramEmbed]);

  const handlePlayClick = () => setShowVideoPlayer(true);

  if (loadingVideo) {
    return (
      <div className="video-detail-page">
        <div className="video-detail">
          <p style={{ textAlign: "center", padding: 40 }}>
            Carregando vídeo...
          </p>
        </div>
      </div>
    );
  }

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

  const youtubeVideoId = getYouTubeVideoId(video.videoUrl);
  const isYouTube = isYouTubeUrl(video.videoUrl);

  const renderLinesWithBreaks = (text: string) =>
    text.split("\n").map((line, i, arr) => (
      <React.Fragment key={i}>
        {line}
        {i < arr.length - 1 && <br />}
      </React.Fragment>
    ));

  return (
    <div className="video-detail-page">
      <section className="video-detail">
        <div className="video-detail__header">
          <div className="video-detail__media">
            {video.instagramUrl ? (
              <div className="video-detail__embed-wrapper">
                {loadingEmbed && <p>Carregando vídeo do Instagram...</p>}
                <div
                  id="instagram-embed-container"
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    minHeight: "540px",
                  }}
                />
              </div>
            ) : showVideoPlayer && isYouTube && youtubeVideoId ? (
              <div className="video-detail__player-wrapper">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0`}
                  title={video.title}
                  allowFullScreen
                />
                <div className="video-detail__media-footer">ICTUS</div>
              </div>
            ) : showVideoPlayer ? (
              <div className="video-detail__player-wrapper">
                <video
                  controls
                  autoPlay
                  controlsList="nodownload"
                  poster={buildImageUrl(video.thumbnail?.url)}
                >
                  <source src={video.videoUrl} type="video/mp4" />
                </video>
                <div className="video-detail__media-footer">ICTUS</div>
              </div>
            ) : (
              <button
                className="video-detail__media-button"
                onClick={handlePlayClick}
              >
                <img
                  src={
                    buildImageUrl(video.thumbnail?.url) ||
                    "/imgs/fallback-video.png"
                  }
                  alt="video"
                  className="video-detail__thumbnail"
                />
              </button>
            )}
          </div>

          <div className="video-detail__info">
            <h1 className="video-detail__title">
              {renderLinesWithBreaks(video.title)}
            </h1>
            <p className="video-detail__description">{video.description}</p>

            {products.length > 0 && (
              <div className="video-detail__products">
                <h2 className="video-detail__products-title">
                  Produtos nesse vídeo
                </h2>

                <div className="video-detail__products-row">
                  <div className="video-detail__products-list">
                    {products.slice(0, 3).map((p) => {
                      const imageUrl = getFirstProductImageUrl(p);

                      return (
                        <article
                          key={p.id}
                          className="video-detail__product-card"
                          onClick={() => navigate(`/product/${p.slug}`)}
                        >
                          <div className="video-detail__product-image-wrapper">
                            {imageUrl && (
                              <img
                                src={imageUrl}
                                alt={p.name}
                                className="video-detail__product-image"
                              />
                            )}
                          </div>
                          <div className="video-detail__product-info">
                            <p className="video-detail__product-name">
                              {p.name}
                            </p>
                            <p className="video-detail__product-price">
                              {p.price}
                            </p>
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  {/* Botão + vermelho - agora clicável */}
                  {products.length > 3 && (
                    <button
                      className="video-detail__products-more"
                      onClick={() => {
                        // Scroll suave até produtos relacionados
                        document
                          .querySelector(".video-related-products")
                          ?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                      }}
                      title="Ver mais produtos"
                    >
                      <span className="video-detail__products-more-icon">
                        +
                      </span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {products.length > 0 && (
          <section className="video-related-products">
            <h2 className="video-related-title">Produtos relacionados:</h2>

            <div className="video-related-list">
              {products.map((p) => {
                const imageUrl = getFirstProductImageUrl(p);

                return (
                  <article
                    key={p.id}
                    className="video-related-card"
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    <div className="video-related-image-wrapper">
                      {imageUrl && <img src={imageUrl} alt={p.name} />}
                    </div>
                    <p className="video-related-name">{p.name}</p>
                    <p className="video-related-price">{p.price}</p>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </section>
    </div>
  );
};

export default VideoDetail;
