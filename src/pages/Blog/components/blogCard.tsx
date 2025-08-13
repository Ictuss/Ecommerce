import React from "react";
import "./blogCard.css";

export default function PostHighlight({
  title = "Seu pulso está dolorido? Confira as possíveis causas.",
  text = `Você trabalha com movimentos repetitivos? Passa muito tempo com as mãos no teclado ou mouse? Especialistas relatam o número crescente de pacientes com LER. Confira alguns produtos que podem te ajudar!`,
  date = "12/05/2025",
  image = "https://images.unsplash.com/photo-1588702547919-26089e690ecc?q=80&w=800&auto=format&fit=crop"
}) {
  return (
    <article className="hl-card" role="article" aria-label="Destaque de conteúdo">
      <div className="hl-media">
        <img className="hl-img" src={image} alt="Pessoa com dor no punho usando notebook" />
      </div>

      <div className="hl-content">
        <h2 className="hl-title">{title}</h2>
        <p className="hl-text">{text}</p>

        <div className="hl-footer">
          <time className="hl-date">{date}</time>
        </div>
      </div>
    </article>
  );
}
