import React from "react";
import "./blogCard.css";
import dorPulso from "../../../assets/dorPulso.png";

interface PostHighlightProps {
  title: string;
  text: string;
  date: string;
  image: string;
}

export default function PostHighlight({
  title,
  text,
  date,
  image
}: PostHighlightProps) {

  // Função para lidar com erro no carregamento da imagem
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log(`Erro ao carregar imagem: ${image}`);
    e.currentTarget.src = dorPulso; // Fallback para imagem padrão
  };

  // Função para lidar com o carregamento bem-sucedido
  const handleImageLoad = () => {
    console.log(`Imagem carregada com sucesso: ${image}`);
  };

  return (
    <article className="hl-card" role="article" aria-label={`Post: ${title}`}>
      <div className="hl-media">
        <img 
          className="hl-img" 
          src={image || dorPulso} 
          alt={`Imagem do post: ${title}`}
          onError={handleImageError}
          onLoad={handleImageLoad}
          loading="lazy" // Otimização de performance
        />
      </div>

      <div className="hl-content">
        <h2 className="hl-title">{title}</h2>
        <p className="hl-text">{text}</p>

        <div className="hl-footer">
          <time className="hl-date" dateTime={date}>{date}</time>
        </div>
      </div>
    </article>
  );
}