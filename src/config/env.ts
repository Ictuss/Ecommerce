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

// Base "crua" para arquivos (imagens, vídeos, etc.)
const RAW_API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// remove barra final, se tiver
const cleanBaseUrl = RAW_API_URL.replace(/\/$/, "");

// helper pra saber se já é URL absoluta
const isAbsoluteUrl = (url: string) => /^https?:\/\//i.test(url);

/**
 * Helper genérico para construir URL de arquivo (imagem, vídeo, etc.)
 */
const buildFileUrl = (url?: string) => {
  if (!url) return "";

  // Se já é absoluta (Blob, YouTube, etc.), retorna direto
  if (isAbsoluteUrl(url)) return url;

  // Se for caminho relativo, prefixa com a URL base do backend
  const cleanPath = url.replace(/^\//, "");
  return `${cleanBaseUrl}/${cleanPath}`;
};

/**
 * Helper para construir URLs de imagens do Payload
 */
export const buildImageUrl = (url?: string) => buildFileUrl(url);

/**
 * Helper para construir URLs de vídeos do Payload / Blob
 */
export const buildVideoUrl = (url?: string) => buildFileUrl(url);
