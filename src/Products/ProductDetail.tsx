import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStrapi } from '../context/StrapiContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchProductById } = useStrapi();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      if (id) {
        setLoading(true);
        const fetchedProduct = await fetchProductById(id);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          setError(null);
        } else {
          setError('Produto não encontrado');
        }
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, fetchProductById]);

  const handleWhatsAppClick = () => {
    if (product) {
      const message = `Olá, quero comprar: ${product.attributes.name} - R$${product.attributes.price}.`;
      window.open(
        `https://wa.me/55${product.attributes.whatsAppLink || '42991383593'}?text=${encodeURIComponent(message)}`,
        '_blank'
      );
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          fontFamily: "'Anton', sans-serif",
          color: '#ff0000',
          fontSize: '28px',
        }}
      >
        Carregando produto...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          fontFamily: "'Anton', sans-serif",
          color: '#ff0000',
          fontSize: '28px',
        }}
      >
        {error || 'Produto não encontrado'}
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontFamily: "'Anton', sans-serif",
        color: '#ff0000',
        textAlign: 'center',
        backgroundColor: '#f5f5f5',
        padding: '20px',
      }}
    >
      <h1 style={{ fontSize: '28px', marginBottom: '20px' }}>{product.attributes.name}</h1>
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          padding: '30px',
          maxWidth: '600px',
          width: '100%',
        }}
      >
        {product.attributes.imagem && product.attributes.imagem.data ? (
          <img
            src={`http://localhost:1337${product.attributes.imagem.data.attributes.url}`}
            alt={product.attributes.name}
            style={{ maxWidth: '300px', borderRadius: '5px', marginBottom: '20px' }}
          />
        ) : (
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>
            Imagem não disponível
          </p>
        )}
        <p style={{ fontSize: '20px', color: '#333', marginBottom: '20px' }}>
          {product.attributes.description}
        </p>
        <p style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
          R${product.attributes.price}
        </p>
        <button
          onClick={handleWhatsAppClick}
          style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: '20px',
            color: 'white',
            backgroundColor: '#ff0000',
            border: 'none',
            borderRadius: '5px',
            padding: '10px 20px',
            cursor: 'pointer',
          }}
        >
          Comprar via WhatsApp
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;