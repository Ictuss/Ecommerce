const PAYLOAD_API_URL = import.meta.env.VITE_API_URL || "";

export interface ProductsResponse {
  docs: Product[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  featured: boolean;
  images: Array<{
    image: {
      id: string;
      url?: string;
      alt?: string;
      width?: number;
      height?: number;
      sizes?: {
        thumbnail?: {
          url?: string;
          width?: number;
          height?: number;
        };
        card?: {
          url?: string;
          width?: number;
          height?: number;
        };
        tablet?: {
          url?: string;
          width?: number;
          height?: number;
        };
      };
    };
    alt: string;
    id?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export const productService = {
  async getAll(page = 1, limit = 100): Promise<ProductsResponse> {
    try {
      const response = await fetch(
        `${PAYLOAD_API_URL}/api/products?page=${page}&limit=${limit}&depth=2`
      );

      if (!response.ok) {
        throw new Error(`Erro ao buscar produtos: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Dados recebidos do Payload:", data); // Debug
      return data;
    } catch (error) {
      console.error("Erro no productService.getAll:", error);
      throw error;
    }
  },
  async getByCategory(
    category: string,
    limit = 100
  ): Promise<ProductsResponse> {
    try {
      const response = await fetch(
        `${PAYLOAD_API_URL}/api/products?where[category][equals]=${category}&limit=${limit}&depth=2`
      );

      if (!response.ok) {
        throw new Error(
          `Erro ao buscar produtos por categoria: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log(`Produtos da categoria "${category}":`, data);
      return data;
    } catch (error) {
      console.error("Erro no productService.getByCategory:", error);
      throw error;
    }
  },
  async getBySlug(slug: string): Promise<Product> {
    try {
      const response = await fetch(
        `${PAYLOAD_API_URL}/api/products?where[slug][equals]=${slug}&depth=2`
      );

      if (!response.ok) {
        throw new Error(`Erro ao buscar produto: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.docs.length === 0) {
        throw new Error("Produto não encontrado");
      }

      return data.docs[0];
    } catch (error) {
      console.error("Erro no productService.getBySlug:", error);
      throw error;
    }
  },
};
