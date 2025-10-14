export default interface ProductHome {
  id: string;
  name: string;
  slug: string; // ✅ ADICIONAR
  price: number | string;
  category: string;
  image?: string;
  images?: any[]; // ✅ ADICIONAR
  path?: string; // manter para compatibilidade
}

type ProductDetail = {
  id: string;
  sku: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  specs: {
    caracteristicas: string[];
    aplicacao: string[];
    especificacoes: string[];
    garantia: string[];
  };
  related?: Array<{
    id: string;
    name: string;
    thumbnail: string;
    price?: number;
  }>;
};
