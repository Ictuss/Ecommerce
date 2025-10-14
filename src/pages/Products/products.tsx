import React from 'react';
import { Link } from 'react-router-dom';
import { useProductsViewModel } from './viewModel/products_viewModel';

const Products: React.FC = () => {
  const { products, loading, error, getImageUrl } = useProductsViewModel();

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
          products.map((product: any) => (
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
              <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>{product.name}</h2>
              
              {getImageUrl(product) ? (
                <img
                  src={getImageUrl(product)}
                  alt={product.images[0]?.alt || product.name}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '5px',
                    marginBottom: '10px',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '200px',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '5px',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#666',
                  }}
                >
                  Sem imagem
                </div>
              )}

              <p style={{ fontSize: '16px', color: '#333', marginBottom: '10px' }}>
                {product.description.length > 100
                  ? `${product.description.substring(0, 100)}...`
                  : product.description}
              </p>

              <p style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
                R$ {product.price.toFixed(2).replace('.', ',')}
              </p>

              <span
                style={{
                  display: 'inline-block',
                  fontSize: '14px',
                  color: '#666',
                  backgroundColor: '#f0f0f0',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  marginBottom: '10px',
                }}
              >
                {product.category}
              </span>

              <Link
                to={`/product/${product.slug}`}
                style={{
                  display: 'block',
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