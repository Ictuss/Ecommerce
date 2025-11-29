// src/config/env.ts

/**
 * Configuração centralizada de URLs do ambiente
 */
export const ENV = {
  // URL base da API (sem /api no final)
  API_BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:3000",

  // URL completa da API (com /api)
  API_URL: `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api`,
} as const;

// src/config/env.ts
const API_URL = import.meta.env.VITE_API_URL || "";

export const buildImageUrl = (url?: string) => {
  if (!url) return "";
  // se já é absoluta (Blob / https), retorna direto
  if (/^https?:\/\//i.test(url)) return url;
  // senão, prefixa com a URL do backend
  return `${API_URL.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
};

/**
 * Helper para construir URLs de imagens do Payload
 */
// export const buildImageUrl = (imageUrl?: string, fallback?: string): string => {
//   if (!imageUrl) return fallback || "";
//   if (imageUrl.startsWith("http")) return imageUrl;

//   const baseUrl = ENV.API_BASE_URL;
//   const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
//   const cleanImageUrl = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;

//   return `${cleanBaseUrl}${cleanImageUrl}`;
// };
