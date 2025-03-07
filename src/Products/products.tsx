import React from 'react';
import { Link } from 'react-router-dom';
import { useStrapi } from '../context/StrapiContext';

const Products: React.FC = () => {
  const { products, loading, error } = useStrapi();

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
        Carregando produtos...
      </div>
    );
  }

  if (error) {
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
        Erro: {error}
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
      <h1 style={{ fontSize: '28px', marginBottom: '30px' }}>Produtos</h1>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '20px',
          maxWidth: '1200px',
        }}
      >
        {products.length === 0 ? (
          <p style={{ fontSize: '28px' }}>Nenhum produto disponível no momento.</p>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                padding: '20px',
                width: '300px',
                textAlign: 'center',
              }}
            >
              <h2 style={{ fontSize: '28px', marginBottom: '10px' }}>{product.attributes.name}</h2>
              <p style={{ fontSize: '16px', color: '#333', marginBottom: '10px' }}>
                {product.attributes.description.length > 100
                  ? `${product.attributes.description.substring(0, 100)}...`
                  : product.attributes.description}
              </p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
                R${product.attributes.price}
              </p>
              {product.attributes.imagem && product.attributes.imagem.data ? (
                <img
                  src={`http://localhost:1337${product.attributes.imagem.data.attributes.url}`}
                  alt={product.attributes.name}
                  style={{ maxWidth: '200px', borderRadius: '5px', marginBottom: '10px' }}
                />
              ) : (
                <p style={{ fontSize: '16px', color: '#666' }}>Imagem não disponível</p>
              )}
              <Link
                to={`/product/${product.id}`}
                style={{
                  display: 'inline-block',
                  fontFamily: "'Anton', sans-serif",
                  fontSize: '20px',
                  color: 'white',
                  backgroundColor: '#ff0000',
                  border: 'none',
                  borderRadius: '5px',
                  padding: '10px 20px',
                  textDecoration: 'none',
                  marginTop: '10px',
                }}
              >
                Ver Detalhes
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Products;