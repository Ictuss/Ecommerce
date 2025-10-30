// ...existing code...
import React from 'react';

interface VideoCardProps {
  videoThumbnail?: string;
  videoTitle?: string;
  videoDescription?: string;
  highlightText?: string;
  logoText?: React.ReactNode;
  mainTitle?: string;
  descriptionText?: string;
  onPlayClick?: React.MouseEventHandler<HTMLDivElement>;
}

const VideoCard: React.FC<VideoCardProps> = ({
  videoThumbnail,
  videoTitle,
  videoDescription = '',
  highlightText,
  logoText,
  mainTitle = '',
  descriptionText = '',
  onPlayClick
}) => {
  const videoDescriptionLines = videoDescription.split('\n');
  const mainTitleLines = mainTitle.split('\n');

  return (
    <div className="video-card-container">
      <div className="video-card">
        {/* Seção do Vídeo */}
        <div
          className="video-section"
          style={{
            backgroundImage: videoThumbnail
              ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${videoThumbnail})`
              : 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3))'
          }}
        >
          <div className="video-overlay" onClick={onPlayClick}>
            <div className="play-button">
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                <circle cx="30" cy="30" r="30" fill="rgba(0,0,0,0.7)" />
                <path d="M24 18L42 30L24 42V18Z" fill="white" />
              </svg>
            </div>
          </div>

          <div className="video-text">
            <p className="video-description">
              {videoDescriptionLines.map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {index < videoDescriptionLines.length - 1 && <br />}
                </React.Fragment>
              ))}
              {highlightText && (
                <>
                  <br />
                  <span className="highlight">{highlightText}</span>
                </>
              )}
            </p>
          </div>

          <div className="logo">{logoText}</div>
        </div>

        {/* Seção de Texto */}
        <div className="text-section">
          <h1 className="title">
            {mainTitleLines.map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < mainTitleLines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </h1>

          <div className="description">
            <p
              className="description-text"
              dangerouslySetInnerHTML={{ __html: descriptionText }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
// ...existing code...