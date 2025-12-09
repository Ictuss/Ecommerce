// components/FormattedDescription.tsx
import React from "react";

interface FormattedDescriptionProps {
  text: string;
  className?: string;
}

/**
 * Componente que formata texto simples com quebras de linha e bullets
 * preservando a formatação visual sem usar HTML no banco.
 */
export const FormattedDescription: React.FC<FormattedDescriptionProps> = ({
  text,
  className = "",
}) => {
  if (!text) return null;

  // Divide o texto em linhas
  const lines = text.split("\n");

  return (
    <div className={className}>
      {lines.map((line, index) => {
        const trimmedLine = line.trim();

        // Linha vazia - adiciona espaçamento
        if (!trimmedLine) {
          return <br key={`br-${index}`} />;
        }

        // Linha com bullet (começa com •)
        if (trimmedLine.startsWith("•")) {
          const content = trimmedLine.substring(1).trim();
          return (
            <div
              key={`line-${index}`}
              style={{
                marginLeft: "20px",
                textIndent: "-20px",
                marginBottom: "4px",
              }}
            >
              <span style={{ marginRight: "8px" }}>•</span>
              {content}
            </div>
          );
        }

        // Verifica se é um título/seção (termina com : ou está em negrito)
        const isTitle =
          trimmedLine.endsWith(":") ||
          trimmedLine.match(
            /^(Composição|Dimensões|Medidas|Indicação|Peso|Altura|Cores)/i
          );

        if (isTitle) {
          return (
            <strong
              key={`line-${index}`}
              style={{
                display: "block",
                marginTop: index > 0 ? "12px" : "0",
                marginBottom: "8px",
              }}
            >
              {trimmedLine}
            </strong>
          );
        }

        // Linha normal
        return (
          <div key={`line-${index}`} style={{ marginBottom: "4px" }}>
            {trimmedLine}
          </div>
        );
      })}
    </div>
  );
};
