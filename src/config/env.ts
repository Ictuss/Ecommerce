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

/**
 * Helper para construir URLs de imagens do Payload
 */
export const buildImageUrl = (imageUrl?: string, fallback?: string): string => {
  if (!imageUrl) return fallback || "";
  if (imageUrl.startsWith("http")) return imageUrl;

  const baseUrl = ENV.API_BASE_URL;
  const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const cleanImageUrl = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;

  return `${cleanBaseUrl}${cleanImageUrl}`;
};
