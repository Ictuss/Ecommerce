// src/pages/Videos/Videos.tsx
import React, { useState } from 'react';
import VideoCard from '../Videos/videoCard/videoCard';
import './Videos.css';

const Videos = () => {
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);

  const videosData = [
    {
      id: 1,
      videoThumbnail:
        'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400',
      mainTitle: 'Assento\ngiratório',
      descriptionText:
        'Você trabalha com movimentos repetitivos?\n' +
        'Passa muito tempo com as mãos no teclado ou mouse?\n' +
        'Especialistas relatam comumente o aumento de pacientes com LER.\n' +
        'Confira alguns produtos que podem te ajudar!',
    },
    {
      id: 2,
      videoThumbnail:
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      mainTitle: 'Suporte\nlombar',
      descriptionText:
        'Trabalha muitas horas sentado?\n' +
        'O Suporte Lombar Ergonômico pode ajudar a manter a postura correta\n' +
        'e prevenir dores nas costas.\n' +
        'Cuide da sua saúde!',
    },
    {
      id: 3,
      videoThumbnail:
        'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400',
      mainTitle: 'Apoio para\npés',
      descriptionText:
        'Sente desconforto nas pernas durante o dia?\n' +
        'O Apoio para Pés Ajustável melhora a circulação\n' +
        'e reduz o cansaço.\n' +
        'Experimente a diferença!',
    },
    {
      id: 4,
      videoThumbnail:
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
      mainTitle: 'Estetos',
      descriptionText:
        'Equipamentos de alta qualidade para profissionais de saúde.\n' +
        'Descubra nossa linha de estetoscópios\n' +
        'com desempenho e conforto superiores.',
    },
  ];

  const handlePlayClick = (videoId: number) => {
    setSelectedVideo(videoId);
    console.log(`Reproduzindo vídeo ${videoId}`);
  };

  // Agrupa os vídeos em pares [0,1], [2,3], ...
  const rows: typeof videosData[] = [];
  for (let i = 0; i < videosData.length; i += 2) {
    rows.push(videosData.slice(i, i + 2));
  }

  return (
    <div className="videos-page">
      <section className="videos-section">
        <div className="videos-section__list">
          {rows.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              <div className="videos-row">
                {/* Primeiro card da linha (sempre existe) */}
                <VideoCard
                  videoThumbnail={row[0].videoThumbnail}
                  mainTitle={row[0].mainTitle}
                  descriptionText={row[0].descriptionText}
                  onPlayClick={() => handlePlayClick(row[0].id)}
                />

                {/* Divider vertical + segundo card (se existir) */}
                {row[1] && (
                  <>
                    <div className="videos-row__divider-vertical" />
                    <VideoCard
                      videoThumbnail={row[1].videoThumbnail}
                      mainTitle={row[1].mainTitle}
                      descriptionText={row[1].descriptionText}
                      onPlayClick={() => handlePlayClick(row[1].id)}
                    />
                  </>
                )}
              </div>

              {/* Divider horizontal sob a linha */}
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
