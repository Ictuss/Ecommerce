type ProductHome = {
  id: string | number;
  name: string;
  price: string;
  image: string;
  path: string;
  category: "inverno" | "mae-bebe" | "mobilidade"; 
};
export default ProductHome

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
