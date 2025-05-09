import React from 'react';
import './contact.css';

const Contato: React.FC = () => {
  return (
    <section className="contato">
      <h2 className="titulo">FALE CONOSCO</h2>
      <div className="conteudo">
        <form className="formulario">
          <input type="text" placeholder="Seu nome (obrigatório)" required />
          <input type="email" placeholder="Seu e-mail (obrigatório)" required />
          <input type="text" placeholder="Assunto" />
          <textarea placeholder="Sua mensagem" rows={6}></textarea>
          <button type="submit">Enviar</button>
        </form>

        <div className="info">
  <h3>CONTATO</h3>
  <p><i className="fas fa-phone-alt"></i>📞 42 3622 1080</p>
  <p><i className="fas fa-mobile-alt"></i>📱  42 9 9138 3593</p>
  <p><i className="fas fa-envelope"></i>✉️  ictus@ictusvirtual.com.br</p>

  <h3>EXPEDIENTE</h3>
  <p><i className="fas fa-calendar-alt"></i>🗓 Segunda – Sexta: 8h30 – 12h | 13h – 18h30</p>
  <p><i className="fas fa-calendar-day"></i>🗓 Sábado: 8h30 – 13h</p>

  <h3>LOCALIZAÇÃO</h3>
  <p><i className="fas fa-map-marker-alt"></i>📍 Rua Getúlio Vargas 1951 – Centro, Guarapuava – PR</p>
</div>

   
      </div>
    </section>
  );
};

export default Contato;
