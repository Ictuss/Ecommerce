import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface Product {
  id: number;
  attributes: {
    name: string;
    description: string;
    price: number;
    whatsAppLink: string;
    imagem: {
      data: {
        attributes: {
          url: string;
        };
      } | null;
    } | null;
  };
}

interface StrapiContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProductById: (id: string) => Promise<Product | null>;
}

export const StrapiContext = createContext<StrapiContextType | undefined>(undefined);

interface StrapiProviderProps {
  children: ReactNode;
}

export const StrapiProvider: React.FC<StrapiProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:1337/api/products');
        if (!response.ok) {
          throw new Error('Erro ao buscar produtos do Strapi');
        }
        const data = await response.json();
        setProducts(data.data || []); // Garante que seja um array vazio se não houver dados
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        console.error('Erro ao carregar produtos:', err); // Adiciona log para debug
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const fetchProductById = async (id: string): Promise<Product | null> => {
    try {
      const response = await fetch(`http://localhost:1337/api/products/${id}`);
      if (!response.ok) {
        throw new Error(`Erro ao buscar o produto com ID ${id}`);
      }
      const data = await response.json();
      return data.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      console.error('Erro ao carregar produto por ID:', err);
      return null;
    }
  };

  return (
    <StrapiContext.Provider value={{ products, loading, error, fetchProductById }}>
      {children}
    </StrapiContext.Provider>
  );
};

export const useStrapi = () => {
  const context = React.useContext(StrapiContext);
  if (!context) {
    throw new Error('useStrapi deve ser usado dentro de um StrapiProvider');
  }
  return context;
};