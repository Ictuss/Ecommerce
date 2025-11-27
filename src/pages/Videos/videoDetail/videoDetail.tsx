// src/pages/Videos/VideoDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./videoDetail.css";
import { apiService } from "../../../services/api";

type CmsVideo = {
  id: string | number;
  title: string;
  description?: string;
  videoUrl: string;
  category?: string;
  thumbnail?: {
    url?: string;
  };
  instagramUrl?: string;
};

type VideoProduct = {
  id: string | number;
  image: string;
  name: string;
  price: string;
  description?: string;
  category?: string;
  slug?: string;
};

const VideoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [video, setVideo] = useState<CmsVideo | null>(null);
  const [loadingVideo, setLoadingVideo] = useState(true);
  const [products, setProducts] = useState<VideoProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [errorProducts, setErrorProducts] = useState<string | null>(null);
  const [instagramEmbed, setInstagramEmbed] = useState<string>("");
  const [loadingEmbed, setLoadingEmbed] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  // Função para extrair ID do YouTube de diferentes formatos de URL
  const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;

    // Padrões de URL do YouTube
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/, // ID direto
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  };

  // Verifica se é URL do YouTube
  const isYouTubeUrl = (url: string): boolean => {
    return url?.includes("youtube.com") || url?.includes("youtu.be");
  };

  // Carrega o vídeo do CMS
  useEffect(() => {
    const loadVideo = async () => {
      try {
        setLoadingVideo(true);
        const videos = await apiService.fetchVideos();
        const foundVideo = videos.find((v: any) => String(v.id) === String(id));

        if (foundVideo) {
          setVideo({
            id: foundVideo.id,
            title: foundVideo.title,
            description: foundVideo.description,
            videoUrl: foundVideo.videoUrl,
            category: foundVideo.category,
            thumbnail: {
              url:
                foundVideo.thumbnail?.url ||
                foundVideo.thumbnail?.sizes?.thumbnail?.url,
            },
            instagramUrl: foundVideo.instagramUrl,
          });
        }
      } catch (error) {
        console.error("Erro ao carregar vídeo:", error);
      } finally {
        setLoadingVideo(false);
      }
    };

    loadVideo();
  }, [id]);

  // Carrega embed do Instagram usando oEmbed API
  useEffect(() => {
    if (!video?.instagramUrl) return;

    const loadInstagramEmbed = async () => {
      try {
        setLoadingEmbed(true);

        const publicOembedUrl = `https://api.instagram.com/oembed/?url=${encodeURIComponent(
          video.instagramUrl
        )}`;

        const response = await fetch(publicOembedUrl);
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

  // Processa o embed HTML do Instagram
  useEffect(() => {
    if (!instagramEmbed) return;

    const container = document.getElementById("instagram-embed-container");
    if (container) {
      container.innerHTML = instagramEmbed;

      const script = document.createElement("script");
      script.src = "//www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);

      if ((window as any).instgrm) {
        (window as any).instgrm.Embeds.process();
      }

      return () => {
        if (script.parentNode) {
          document.body.removeChild(script);
        }
      };
    }
  }, [instagramEmbed]);

  // Carrega produtos relacionados
  useEffect(() => {
    if (!video?.category) return;

    const loadProducts = async () => {
      try {
        setLoadingProducts(true);
        const docs = await apiService.fetchProducts(video.category);

        const formatted = docs.map((product: any) => ({
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

  const handlePlayClick = () => {
    setShowVideoPlayer(true);
  };

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

  const renderLinesWithBreaks = (text: string) =>
    text.split("\n").map((line, i, arr) => (
      <React.Fragment key={i}>
        {line}
        {i < arr.length - 1 && <br />}
      </React.Fragment>
    ));

  // Determina qual player usar
  const youtubeVideoId = video.videoUrl
    ? getYouTubeVideoId(video.videoUrl)
    : null;
  const isYouTube = video.videoUrl && isYouTubeUrl(video.videoUrl);

  return (
    <div className="video-detail-page">
      <section className="video-detail">
        <div className="video-detail__header">
          {/* LADO ESQUERDO — VÍDEO */}
          <div className="video-detail__media">
            {video.instagramUrl ? (
              // Embed do Instagram
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
              // Player do YouTube
              <div className="video-detail__player-wrapper">
                <div
                  style={{
                    position: "relative",
                    paddingBottom: "56.25%", // 16:9
                    height: 0,
                    overflow: "hidden",
                    maxWidth: "100%",
                    borderRadius: "8px",
                  }}
                >
                  <iframe
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      border: 0,
                      borderRadius: "8px",
                    }}
                    src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="video-detail__media-footer">ICTUS</div>
              </div>
            ) : showVideoPlayer && video.videoUrl ? (
              // Player HTML5 para vídeos hospedados
              <div className="video-detail__player-wrapper">
                <video
                  controls
                  autoPlay
                  controlsList="nodownload"
                  poster={video.thumbnail?.url}
                  style={{
                    width: "100%",
                    maxWidth: "100%",
                    borderRadius: "8px",
                    backgroundColor: "#000",
                  }}
                >
                  <source src={video.videoUrl} type="video/mp4" />
                  <source src={video.videoUrl} type="video/webm" />
                  Seu navegador não suporta a reprodução de vídeos.
                </video>
                <div className="video-detail__media-footer">ICTUS</div>
              </div>
            ) : (
              // Thumbnail com botão de play
              <button
                type="button"
                className="video-detail__media-button"
                onClick={handlePlayClick}
              >
                <img
                  src={video.thumbnail?.url || "/imgs/fallback-video.png"}
                  alt="video"
                  className="video-detail__thumbnail"
                />

                <div className="video-detail__media-overlay">
                  <div className="video-detail__play-button">
                    <svg width="80" height="80" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="40" />
                      <path d="M32 24L54 40L32 56V24Z" />
                    </svg>
                  </div>
                </div>

                <div className="video-detail__media-footer">ICTUS</div>
              </button>
            )}
          </div>

          {/* DIREITA — INFO */}
          <div className="video-detail__info">
            <h1 className="video-detail__title">
              {renderLinesWithBreaks(video.title)}
            </h1>

            <p className="video-detail__description">{video.description}</p>
          </div>
        </div>

        {/* PRODUTOS RELACIONADOS */}
        {products.length > 0 && (
          <section className="video-related-products">
            <h2 className="video-related-title">Produtos relacionados:</h2>

            <div className="video-related-list">
              {products.map((p) => (
                <article
                  key={p.id}
                  className="video-related-card"
                  onClick={() => navigate(`/product/${p.slug}`)}
                >
                  <div className="video-related-image-wrapper">
                    <img src={p.image} alt={p.name} />
                  </div>
                  <p className="video-related-name">{p.name}</p>
                  <p className="video-related-price">{p.price}</p>
                </article>
              ))}
            </div>
          </section>
        )}
      </section>
    </div>
  );
};

export default VideoDetail;
