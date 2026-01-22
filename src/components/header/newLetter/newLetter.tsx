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

  // Função para formatar o telefone
  const formatPhone = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, "");

    // Aplica a máscara baseado no tamanho
    if (numbers.length <= 2) {
      return `(${numbers}`;
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }

    // Limita a 11 dígitos (DDD + 9 dígitos)
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Remove a formatação antes de enviar
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      setMessage("Por favor, insira um telefone válido");
      return;
    }

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
            phone: cleanPhone, // Envia só os números
          }),
        },
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
          placeholder="(00) 00000-0000"
          value={phone}
          onChange={handlePhoneChange}
          className="input-field"
          maxLength={15} // (00) 00000-0000 = 15 caracteres
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
