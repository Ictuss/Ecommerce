const PAYLOAD_API_URL = import.meta.env.VITE_PAYLOAD_API_URL || "";

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
      url: string;
      alt?: string;
      width?: number;
      height?: number;
    };
    alt: string;
    id?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  docs: Product[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
}

export const productService = {
  async getAll(page = 1, limit = 100): Promise<ProductsResponse> {
    try {
      const response = await fetch(
        `${PAYLOAD_API_URL}/products?page=${page}&limit=${limit}&depth=2`
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

  async getBySlug(slug: string): Promise<Product> {
    try {
      const response = await fetch(
        `${PAYLOAD_API_URL}/products?where[slug][equals]=${slug}&depth=2`
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
