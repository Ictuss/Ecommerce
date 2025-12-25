// viewModel/home_viewModel.ts
import { useEffect, useState } from "react";
import { productService, Product } from "../../../services/products_services";

const PAYLOAD_API_URL = import.meta.env.VITE_API_URL || "";

const isAbsoluteUrl = (url: string) => /^https?:\/\//i.test(url);

export const useHomeViewModel = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getAll(1, 100);
        setProducts(data.docs || []);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar produtos");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

const getProductsByCategory = (categorySlug: string) =>
  products.filter((p) => {
    if (typeof p.category === 'object' && p.category !== null) {
      return p.category.slug === categorySlug;
    }
    return false;
  });
      

  const getImageUrl = (product: Product): string => {
    if (!product.images || product.images.length === 0) return "";

    const wrapper = product.images[0];
    if (!wrapper || !wrapper.image) return "";

    const media = wrapper.image;

    // 1) Usa a URL principal (é onde está vindo a imagem hoje)
    let rawUrl = media.url || "";
    console.log("URL imagem do produto", product.name, media.url, media.sizes);

    // 2) Se um dia os sizes vierem preenchidos, você pode priorizar:
    if (media.sizes) {
      rawUrl =
        media.sizes.card?.url || media.sizes.thumbnail?.url || media.url || "";
    }

    if (!rawUrl) return "";

    // Se já for absoluta (https://...), usa direto
    if (isAbsoluteUrl(rawUrl)) return rawUrl;

    // Se for relativa (/media/...), prefixa com a API
    const base = PAYLOAD_API_URL.replace(/\/$/, "");
    const path = rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`;
    return `${base}${path}`;
  };

  return {
    products,
    loading,
    error,
    getProductsByCategory,
    getImageUrl,
  };
};
