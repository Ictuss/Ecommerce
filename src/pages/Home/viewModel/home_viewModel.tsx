import { useEffect, useState } from "react";
import { productService, Product } from "../../../services/products_services";
import { categoryService, Category } from "../../../services/categories_services";

const PAYLOAD_API_URL = import.meta.env.VITE_API_URL || "";

const isAbsoluteUrl = (url: string) => /^https?:\/\//i.test(url);

export const useHomeViewModel = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 🚀 Busca TODOS os produtos automaticamente (com paginação interna)
        const [productsData, categoriesData] = await Promise.all([
          productService.getAll(), // ← Agora busca TODOS
          categoryService.getAll(),
        ]);

        console.log('✅ Produtos carregados:', productsData.docs?.length);
        console.log('✅ Categorias carregadas:', categoriesData.docs?.length);
        
        setProducts(productsData.docs || []);
        
        // Filtrar e ordenar categorias para a home
        const homeCategories = (categoriesData.docs || [])
          .filter((cat: Category) => cat.showOnHome === true)
          .sort((a: Category, b: Category) => {
            const orderA = a.order ?? 999;
            const orderB = b.order ?? 999;
            return orderA - orderB;
          });
        
        console.log('✅ Categorias na home:', homeCategories.length);
        
        setCategories(homeCategories);
      } catch (err: any) {
        console.error('❌ Erro ao buscar dados:', err);
        setError(err.message || "Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getProductsByCategory = (categorySlug: string) => {
    const filtered = products.filter((p) => {
      if (typeof p.category === "object" && p.category !== null) {
        return p.category.slug === categorySlug;
      }
      return false;
    });
    
    return filtered;
  };

  const getImageUrl = (product: Product): string => {
    if (!product.images || product.images.length === 0) return "";

    const wrapper = product.images[0];
    if (!wrapper || !wrapper.image) return "";

    const media = wrapper.image;
    let rawUrl = media.url || "";

    if (media.sizes) {
      rawUrl = media.sizes.card?.url || media.sizes.thumbnail?.url || media.url || "";
    }

    if (!rawUrl) return "";
    if (isAbsoluteUrl(rawUrl)) return rawUrl;

    const base = PAYLOAD_API_URL.replace(/\/$/, "");
    const path = rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`;
    return `${base}${path}`;
  };

  const getBannerUrl = (category: Category): string => {
    if (!category.banner?.url) return "";
    const rawUrl = category.banner.url;
    if (isAbsoluteUrl(rawUrl)) return rawUrl;
    const base = PAYLOAD_API_URL.replace(/\/$/, "");
    const path = rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`;
    return `${base}${path}`;
  };

  return {
    products,
    categories,
    loading,
    error,
    getProductsByCategory,
    getImageUrl,
    getBannerUrl,
  };
};