// src/pages/Videos/Videos.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VideoCard from "../Videos/videoCard/videoCard";
import "./Videos.css";
import { apiService } from "../../services/api";
import { buildImageUrl } from "../../config/env";
import { Category } from "../../services/categories_services";

type CmsVideo = {
  id: string | number;
  title: string;
  description?: string;
  videoUrl: string;
  category?: Category;
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
          let thumbnailUrl = "";

          // thumbnail vem populado como objeto (porque usamos depth=2)
          if (v.thumbnail && typeof v.thumbnail === "object") {
            const thumb = v.thumbnail as any;

            // tenta usar o size "thumbnail" do media; se não tiver, cai pra url normal
            thumbnailUrl = thumb.sizes?.thumbnail?.url || thumb.url || "";
          }

          console.log("🖼️ Thumbnail processada:", v.title, thumbnailUrl);

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
        <div className="videos-grid">
          {videos.map((video, index) => (
            <React.Fragment key={video.id}>
              <VideoCard
                videoThumbnail={buildImageUrl(video.thumbnail?.url) || ""}
                mainTitle={video.title}
                descriptionText={video.description ?? ""}
                onPlayClick={() => handlePlayClick(video.id)}
              />

              {/* Adiciona divisor vertical só se não for o último da linha (índice ímpar) */}
              {index % 2 === 0 && index !== videos.length - 1 && (
                <div className="videos-grid__divider-vertical" />
              )}

              {/* Adiciona divisor horizontal ao final de cada linha completa (ou no último item) */}
              {(index % 2 === 1 || index === videos.length - 1) && (
                <>
                  <div className="videos-grid__divider-horizontal" />
                </>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Videos;
