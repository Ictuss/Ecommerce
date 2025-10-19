import { useState, useEffect } from 'react';
import { productService, Product } from '../../../services/products_services';

export const useProductDetailViewModel = (slug: string | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      loadProduct(slug);
    }
  }, [slug]);

  const loadProduct = async (productSlug: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Buscando produto:', productSlug);
      const data = await productService.getBySlug(productSlug);
      
      console.log('Produto recebido:', data);
      setProduct(data);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar produto';
      setError(errorMessage);
      console.error('Erro ao carregar produto:', err);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imageUrl: string): string => {
    try {
      if (imageUrl.startsWith('http')) {
        return imageUrl;
      }
      
      const baseUrl = import.meta.env.VITE_PAYLOAD_API_URL?.replace('/api', '') || 'http://localhost:3000';
      return `${baseUrl}${imageUrl}`;
    } catch (err) {
      console.error('Erro ao processar URL da imagem:', err);
      return '';
    }
  };

  const getAllImageUrls = (): string[] => {
    if (!product?.images) return [];
    
    return product.images.map(img => {
      if (typeof img.image === 'object' && 'url' in img.image) {
        return getImageUrl(img.image.url);
      }
      return '';
    }).filter(url => url !== '');
  };

  return {
    product,
    loading,
    error,
    getImageUrl,
    getAllImageUrls,
  };
};