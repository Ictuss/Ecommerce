import { useState, useEffect } from "react";
import { productService, Product } from "../../../services/products_services";
import { ENV } from "../../../config/env";

export const useProductsViewModel = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Buscando produtos..."); // Debug
      const response = await productService.getAll();

      console.log("Produtos recebidos:", response.docs); // Debug
      setProducts(response.docs);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao carregar produtos";
      setError(errorMessage);
      console.error("Erro ao carregar produtos:", err);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (product: Product): string => {
    try {
      if (product.images && product.images.length > 0) {
        const firstImage = product.images[0].image;

        // Se for string (ID da imagem)
        if (typeof firstImage === "string") {
          console.warn("Imagem retornou como string (ID):", firstImage);
          return "";
        }

        // Se for objeto com URL
        if (
          firstImage &&
          typeof firstImage === "object" &&
          "url" in firstImage
        ) {
          const imageUrl = firstImage.url;

          // Se a URL já for completa
          if (imageUrl.startsWith("http")) {
            return imageUrl;
          }

          // Senão, adiciona o base URL do Payload
          return `${ENV.API_BASE_URL}${imageUrl}`;
        }
      }

      return "";
    } catch (err) {
      console.error("Erro ao processar URL da imagem:", err);
      return "";
    }
  };

  return {
    products,
    loading,
    error,
    getImageUrl,
    refetch: loadProducts,
  };
};
