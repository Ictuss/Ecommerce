const PAYLOAD_API_URL = import.meta.env.VITE_API_URL || "";

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  images?: Array<{
    image: {
      id: number;
      url?: string;
      sizes?: {
        thumbnail?: { url?: string };
        card?: { url?: string };
      };
    };
    alt?: string;
  }>;
  featured: boolean;
}

export interface ProductsResponse {
  docs: Product[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export const productService = {
  /**
   * Busca TODOS os produtos de forma automática, fazendo paginação
   * Não importa se tem 100, 1000 ou 15000 produtos!
   */
  async getAll(): Promise<{ docs: Product[]; totalDocs: number }> {
    const allProducts: Product[] = [];
    let currentPage = 1;
    let hasMore = true;
    const limit = 100; // Busca de 100 em 100

    console.log('📦 Buscando todos os produtos...');

    while (hasMore) {
      try {
        const response = await fetch(
          `${PAYLOAD_API_URL}/api/products?page=${currentPage}&limit=${limit}&sort=-createdAt`
        );

        if (!response.ok) {
          throw new Error(`Erro ao buscar produtos - página ${currentPage}`);
        }

        const data: ProductsResponse = await response.json();
        
        allProducts.push(...data.docs);
        
        console.log(`  ✅ Página ${currentPage}/${data.totalPages} carregada (${data.docs.length} produtos)`);

        hasMore = data.hasNextPage;
        currentPage++;
      } catch (error) {
        console.error(`❌ Erro na página ${currentPage}:`, error);
        hasMore = false; // Para o loop em caso de erro
      }
    }

    console.log(`✅ Total de produtos carregados: ${allProducts.length}`);

    return {
      docs: allProducts,
      totalDocs: allProducts.length,
    };
  },

  /**
   * Busca produtos de uma página específica (para listagens paginadas)
   */
  async getPage(page = 1, limit = 20): Promise<ProductsResponse> {
    const response = await fetch(
      `${PAYLOAD_API_URL}/api/products?page=${page}&limit=${limit}&sort=-createdAt`
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar produtos");
    }

    return response.json();
  },

  /**
   * Busca um produto específico pelo slug
   */
  async getBySlug(slug: string): Promise<Product | null> {
    const response = await fetch(
      `${PAYLOAD_API_URL}/api/products?where[slug][equals]=${slug}&limit=1`
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar produto");
    }

    const data: ProductsResponse = await response.json();
    return data.docs[0] || null;
  },
};