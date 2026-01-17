import React, { useState } from "react";
import "./newLetter.css";

const PAYLOAD_API_URL = import.meta.env.VITE_API_URL || "";

const NewsletterSignup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch(
        `${PAYLOAD_API_URL}/api/newsletter/subscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessageType("success");
        setMessage(data.message || "Inscrição realizada com sucesso!");
        // Limpar o formulário após sucesso
        setName("");
        setEmail("");
        setPhone("");
      } else {
        setMessageType("error");
        setMessage(data.error || "Erro ao processar inscrição");
      }
    } catch (error) {
      setMessageType("error");
      setMessage("Erro de conexão. Tente novamente.");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="newsletter-container">
      <p className="newsletter-text">
        Se cadastre para receber nossa Newsletter e novidades!
      </p>

      {message && (
        <div className={`newsletter-message ${messageType}`}>{message}</div>
      )}

      <form onSubmit={handleSubmit} className="newsletter-form">
        <input
          type="text"
          placeholder="Seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
          required
          maxLength={100}
          disabled={loading}
        />
        <input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          required
          disabled={loading}
        />
        <input
          type="tel"
          placeholder="Telefone para contato"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="input-field"
          maxLength={20}
          disabled={loading}
        />
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Enviando..." : "Enviar!"}
        </button>
      </form>
    </div>
  );
};

export default NewsletterSignup;
