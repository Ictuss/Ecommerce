import React, { useState } from 'react';
import VideoCard from './videoCard/videoCard';
import './Videos.css';

const Videos = () => {
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);

  const videosData = [
    {
      id: 1,
      videoThumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400',
      videoDescription: 'MOVIMENTOS SIMPLES PODEM SER\nUM DESAFIO PARA QUEM TEM\nDORES NA COLUNA, ARTROSE OU',
      highlightText: 'MOBILIDADE REDUZIDA',
      logoText: 'ICTUS',
      mainTitle: 'Assento\ngiratório',
      descriptionText: 'Você trabalha com movimentos repetitivos?<br />Passa muito tempo com as mãos ocupadas<br />ou inclinado? Especialistas recomendam<br />usar o <strong>Assento Giratório Confort</strong>.<br />Conheça alguns produtos que podem te ajudar!',
    },
    {
      id: 2,
      videoThumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      videoDescription: 'CUIDE DA SUA POSTURA\nDURANTE O TRABALHO\nEVITE DORES E LESÕES',
      highlightText: 'ERGONOMIA PROFISSIONAL',
      logoText: 'ICTUS',
      mainTitle: 'Suporte\nlombar',
      descriptionText: 'Trabalha muitas horas sentado?<br />O <strong>Suporte Lombar Ergonômico</strong><br />pode ajudar a manter a postura correta<br />e prevenir dores nas costas.<br />Cuide da sua saúde!',
    },
    {
      id: 3,
      videoThumbnail: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400',
      videoDescription: 'MANTENHA SEUS PÉS\nNA POSIÇÃO IDEAL\nPARA MELHOR CIRCULAÇÃO',
      highlightText: 'CONFORTO GARANTIDO',
      logoText: 'ICTUS',
      mainTitle: 'Apoio para\npés',
      descriptionText: 'Sente desconforto nas pernas durante o dia?<br />O <strong>Apoio para Pés Ajustável</strong><br />melhora a circulação e reduz o cansaço.<br />Experimente a diferença!',
    },
  ];

  const handlePlayClick = (videoId: number) => {
    setSelectedVideo(videoId);
    console.log(`Reproduzindo vídeo ${videoId}`);
    // Adicione aqui a lógica para abrir o player de vídeo
  };

  return (
    <div className="videos-page">
      <header className="videos-header">
        <h1>Nossos Produtos</h1>
        <p>Soluções ergonômicas para seu bem-estar</p>
      </header>

      <div className="videos-grid">
        {videosData.map((video) => (
          <VideoCard
            key={video.id}
            videoThumbnail={video.videoThumbnail}
            videoDescription={video.videoDescription}
            highlightText={video.highlightText}
            logoText={video.logoText}
            mainTitle={video.mainTitle}
            descriptionText={video.descriptionText}
            onPlayClick={() => handlePlayClick(video.id)}
          />
        ))}
      </div>

      {selectedVideo && (
        <div className="video-modal">
          <p>Vídeo {selectedVideo} selecionado</p>
        </div>
      )}
    </div>
  );
};

export default Videos;