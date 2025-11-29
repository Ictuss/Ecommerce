// src/services/api.js
import { ENV } from "../config/env";
import type { BlogPostFromPayload, BlogPostPageData } from "../types/blog";
const API_URL = import.meta.env.VITE_API_URL || "";
const API_BASE_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:3000"
}/api`;

class ApiService {
  // ✅ CORRIGIDO: SEMPRE USA depth=2 para popular as imagens
  async fetchProducts(category: string | null = null): Promise<any[]> {
    try {
      // ✅ IMPORTANTE: depth=2 é necessário para popular as relações (imagens)
      let url = `${API_BASE_URL}/products?limit=100&depth=2`;

      if (category) {
        url += `&where[category][equals]=${category}`;
      }

      console.log("🔍 Buscando produtos em:", url); // Debug

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();

      console.log("📦 Resposta completa da API:", data); // Debug
      console.log("📦 Produtos (data.docs):", data.docs); // Debug

      // ✅ Verifica se as imagens estão populadas
      if (data.docs && data.docs.length > 0) {
        console.log(
          "🖼️ Primeira imagem do primeiro produto:",
          data.docs[0]?.images?.[0]
        );
      }

      return data.docs; // Payload retorna dados em 'docs'
    } catch (error) {
      console.error("❌ Erro ao buscar produtos:", error);
      return [];
    }
  }

  async fetchFeaturedProducts() {
    try {
      // ✅ Adiciona depth=2 aqui também
      const url = `${API_BASE_URL}/products?where[featured][equals]=true&limit=20&depth=2`;
      const response = await fetch(url);
      console.log(`Resposta: ${response.status}`);

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data.docs;
    } catch (error) {
      console.error("Erro ao buscar produtos em destaque:", error);
      return [];
    }
  }

  async fetchVideos() {
    const res = await fetch(`${API_URL}/api/videos?depth=2`);
    if (!res.ok) {
      throw new Error("Erro ao buscar vídeos");
    }

    const data = await res.json();
    // payload sempre retorna { docs: [...] }
    return data.docs;
  }

  async fetchVideoById(id: string | number) {
    const res = await fetch(`${API_BASE_URL}/videos/${id}?depth=2`);
    if (!res.ok) throw new Error("Vídeo não encontrado");
    return res.json();
  }

  async fetchProductBySlug(slug: any) {
    try {
      // ✅ Adiciona depth=2 para popular imagens
      const url = `${API_BASE_URL}/products?where[slug][equals]=${slug}&depth=2`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data.docs[0] || null;
    } catch (error) {
      console.error("Erro ao buscar produto por slug:", error);
      return null;
    }
  }

  async fetchBlogPosts(limit: number = 10): Promise<BlogPostFromPayload[]> {
    try {
      const url = `${API_BASE_URL}/blog-posts?where[status][equals]=published&depth=2&limit=${limit}&sort=-publishedAt&draft=false`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(
        `Status: ${response.status}, Status Text: ${response.statusText}`
      );

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log("Dados retornados:", data);
      return data.docs || [];
    } catch (error) {
      console.error("Erro ao buscar posts do blog:", error);
      return [];
    }
  }

  async fetchBlogPostBySlug(slug: string): Promise<BlogPostPageData | null> {
    try {
      const url = `${API_BASE_URL}/blog-posts?where[slug][equals]=${slug}&where[status][equals]=published&depth=2`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data.docs[0] || null;
    } catch (error) {
      console.error("Erro ao buscar post por slug:", error);
      return null;
    }
  }

  // Função helper para formatar produto do Payload para o formato do mock
  formatProductForHome(product: {
    id: any;
    name: any;
    salePrice: any;
    price: any;
    images: { image: { url: any } }[];
    slug: any;
    category: any;
  }) {
    return {
      id: product.id,
      name: product.name,
      price: `R$ ${product.salePrice || product.price}`,
      image: product.images?.[0]?.image?.url || "litman",
      path: `/produto/${product.slug}`,
      category: product.category,
    };
  }
}

export const apiService = new ApiService();
