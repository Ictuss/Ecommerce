// src/components/VideoCard/VideoCard.tsx
import React from "react";
import "./videoCard.css"; // <-- ISSO AQUI É O QUE TÁ FALTANDO

interface VideoCardProps {
  videoThumbnail: string;
  mainTitle: string;
  descriptionText: string;
  onPlayClick?: () => void;
}

const renderLinesWithBreaks = (text: string) =>
  text.split("\n").map((line, index, arr) => (
    <React.Fragment key={index}>
      {line}
      {index < arr.length - 1 && <br />}
    </React.Fragment>
  ));

const VideoCard: React.FC<VideoCardProps> = ({
  videoThumbnail,
  mainTitle,
  descriptionText,
  onPlayClick,
}) => {
  return (
    <article className="video-card">
      {/* ESQUERDA: VÍDEO */}
      <button
        type="button"
        className="video-card__media"
        onClick={onPlayClick}
        aria-label={mainTitle}
      >
        <img
          src={videoThumbnail}
          alt={mainTitle}
          className="video-card__thumbnail"
        />

        <div className="video-card__media-overlay">
          <div className="video-card__play-button">
            <svg width="60" height="60" viewBox="0 0 60 60" aria-hidden="true">
              <circle cx="30" cy="30" r="30" />
              <path d="M24 18L42 30L24 42V18Z" />
            </svg>
          </div>
        </div>
      </button>

      {/* DIREITA: TÍTULO + DESCRIÇÃO */}
      <div className="video-card__content">
        <h2 className="video-card__title">
          {renderLinesWithBreaks(mainTitle)}
        </h2>

        <p className="video-card__description">
          {renderLinesWithBreaks(descriptionText)}
        </p>
      </div>
    </article>
  );
};

export default VideoCard;
