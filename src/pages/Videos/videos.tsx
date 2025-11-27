// src/pages/Videos/Videos.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VideoCard from "../Videos/videoCard/videoCard";
import "./Videos.css";
import { apiService } from "../../services/api";
import { buildImageUrl } from "../../config/env";

type CmsVideo = {
  id: string | number;
  title: string;
  description?: string;
  videoUrl: string;
  category?: string;
  thumbnail?: {
    url?: string;
  };
};

const Videos: React.FC = () => {
  const [videos, setVideos] = useState<CmsVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | number | null>(
    null
  );

  const navigate = useNavigate();

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true);
        setError(null);

        const docs = await apiService.fetchVideos();

        console.log("📹 Videos recebidos:", docs); // ✅ debug

        const mapped: CmsVideo[] = docs.map((v: any) => {
          // ✅ AJUSTE AQUI: thumbnail pode ser objeto completo
          let thumbnailUrl = "";

          if (typeof v.thumbnail === "object" && v.thumbnail !== null) {
            // Se thumbnail é objeto, pega a URL
            thumbnailUrl =
              v.thumbnail.url || v.thumbnail.sizes?.thumbnail?.url || "";
          } else if (typeof v.thumbnail === "string") {
            // Se for string (ID), não conseguimos usar
            thumbnailUrl = "";
          }

          console.log("🖼️ Thumbnail processada:", thumbnailUrl); // ✅ debug

          return {
            id: v.id,
            title: v.title,
            description: v.description,
            videoUrl: v.videoUrl,
            category: v.category,
            thumbnail: {
              url: thumbnailUrl,
            },
          };
        });

        setVideos(mapped);
      } catch (err) {
        console.error(err);
        setError("Não foi possível carregar os vídeos.");
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  const handlePlayClick = (videoId: string | number) => {
    setSelectedVideo(videoId);
    navigate(`/videos/${videoId}`);
  };

  if (loading) {
    return (
      <div className="videos-page">
        <section className="videos-section">
          <p style={{ textAlign: "center", padding: 40 }}>Carregando vídeos…</p>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="videos-page">
        <section className="videos-section">
          <p style={{ textAlign: "center", padding: 40, color: "red" }}>
            {error}
          </p>
        </section>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="videos-page">
        <section className="videos-section">
          <p style={{ textAlign: "center", padding: 40 }}>
            Nenhum vídeo cadastrado ainda.
          </p>
        </section>
      </div>
    );
  }

  const rows: CmsVideo[][] = [];
  for (let i = 0; i < videos.length; i += 2) {
    rows.push(videos.slice(i, i + 2));
  }

  return (
    <div className="videos-page">
      <section className="videos-section">
        <div className="videos-section__list">
          {rows.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              <div className="videos-row">
                <VideoCard
                  videoThumbnail={buildImageUrl(row[0].thumbnail?.url) || ""}
                  mainTitle={row[0].title}
                  descriptionText={row[0].description ?? ""}
                  onPlayClick={() => handlePlayClick(row[0].id)}
                />

                {row[1] && (
                  <>
                    <div className="videos-row__divider-vertical" />
                    <VideoCard
                      videoThumbnail={
                        buildImageUrl(row[1].thumbnail?.url) || ""
                      }
                      mainTitle={row[1].title}
                      descriptionText={row[1].description ?? ""}
                      onPlayClick={() => handlePlayClick(row[1].id)}
                    />
                  </>
                )}
              </div>

              <div className="videos-row__divider-horizontal" />
            </React.Fragment>
          ))}
        </div>
      </section>

      {selectedVideo && (
        <div className="video-modal">
          <p>Vídeo {selectedVideo} selecionado</p>
        </div>
      )}
    </div>
  );
};

export default Videos;
