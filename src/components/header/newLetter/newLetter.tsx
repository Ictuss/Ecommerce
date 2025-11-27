import React, { useState } from "react";
import "./newLetter.css";

const NewsletterSignup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log({ name, email, phone });
    // Add your form submission logic here
  };

  return (
    <div className="newsletter-container">
      <p className="newsletter-text">
        Se cadastre para receber nossa Newsletter e novidades!
      </p>
      <form onSubmit={handleSubmit} className="newsletter-form">
        <input
          type="text"
          placeholder="Seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
        />
        <input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />
        <input
          type="tel"
          placeholder="Telefone para contato"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="input-field"
        />
        <button type="submit" className="submit-button">
          Enviar!
        </button>
      </form>
    </div>
  );
};

export default NewsletterSignup;
