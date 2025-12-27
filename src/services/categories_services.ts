const PAYLOAD_API_URL = import.meta.env.VITE_API_URL || "";

export interface Category {
  id: number;
  name: string;
  slug: string;
  banner?: {
    url?: string;
  };
  order?: number;
 showOnHome?: boolean;  
}

export interface CategoriesResponse {
  docs: Category[];
  totalDocs: number;
}

export const categoryService = {
  async getAll(): Promise<CategoriesResponse> {
    const response = await fetch(
      `${PAYLOAD_API_URL}/api/categories?limit=100&sort=order`
    );
    if (!response.ok) {
      throw new Error("Erro ao buscar categorias");
    }
    return response.json();
  },
};