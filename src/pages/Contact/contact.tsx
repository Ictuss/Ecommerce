import React, { useState } from "react";
import emailjs from "emailjs-com";
import "./contact.css";

// Tenta pegar do .env, se vier undefined usa os valores hardcoded
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;

const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const Contato: React.FC = () => {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setSent(false);

    // Só pra você ver no console o que está sendo usado
    console.log("SERVICE:", EMAILJS_SERVICE_ID);
    console.log("TEMPLATE:", EMAILJS_TEMPLATE_ID);
    console.log("PUBLIC:", EMAILJS_PUBLIC_KEY);

    emailjs
      .sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        e.currentTarget,
        EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setSending(false);
          setSent(true);
          // e.currentTarget.reset();
        },
        (error) => {
          console.error("Erro ao enviar email:", error);
          setSending(false);
        }
      );
  };

  return (
    <section className="contato">
      <h2 className="titulo">FALE CONOSCO</h2>
      <div className="conteudo">
        <form className="formulario" onSubmit={sendEmail}>
          <input
            name="nome"
            type="text"
            placeholder="Seu nome (obrigatório)"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Seu e-mail (obrigatório)"
            required
          />
          <input name="assunto" type="text" placeholder="Assunto" />
          <textarea
            name="mensagem"
            placeholder="Sua mensagem"
            rows={6}
          ></textarea>

          <button type="submit" disabled={sending}>
            {sending ? "Enviando..." : "Enviar"}
          </button>

          {sent && (
            <p style={{ color: "green", marginTop: "10px" }}>
              Mensagem enviada com sucesso! 🎉
            </p>
          )}
        </form>

        <div className="info">
          <h3>CONTATO</h3>
          <p>📞 42 3622 1080</p>
          <p>📱 42 9 9138 3593</p>
          <p>✉️ ictus@ictusvirtual.com.br</p>

          <h3>EXPEDIENTE</h3>
          <p>🗓 Segunda – Sexta: 8h30 – 12h | 13h – 18h30</p>
          <p>🗓 Sábado: 8h30 – 13h</p>

          <h3>LOCALIZAÇÃO</h3>
          <p>📍 Rua Presidente Getúlio Vargas 1951 – Centro, Guarapuava – PR</p>
        </div>
      </div>
    </section>
  );
};

export default Contato;
