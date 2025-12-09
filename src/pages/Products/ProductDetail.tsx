import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./ProductDetail.css";
import littmannImg from "../../assets/1.png";
import { useProductDetailViewModel } from "./viewModel/productsDetail_viewModel";
import { useCart } from "../../contexts/CartContext";

function formatBRL(price: number) {
  return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { product, loading, error, getAllImageUrls } =
    useProductDetailViewModel(slug);

  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const { addToCart, openCart } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveImg(0);
  }, [slug]);

  if (loading) {
    return (
      <div className="pd-page">
        <div className="pd-container">
          <p style={{ textAlign: "center", padding: "50px", fontSize: "24px" }}>
            Carregando produto...
          </p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pd-page">
        <div className="pd-container">
          <p
            style={{
              textAlign: "center",
              padding: "50px",
              fontSize: "24px",
              color: "red",
            }}
          >
            {error || "Produto não encontrado."}
          </p>
          <div style={{ textAlign: "center" }}>
            <Link to="/" className="btn btn-primary">
              Voltar para Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const productImages = getAllImageUrls();
  const displayImages =
    productImages.length > 0 ? productImages : [littmannImg];

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price, // precisa ser number e já é!
        image: displayImages[0] ?? littmannImg,
        slug: product.slug,
      },
      qty
    );

    openCart();
  };

  const handleBuyNow = () => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: displayImages[0] ?? littmannImg,
        slug: product.slug,
      },
      qty
    );

    openCart();
  };

  return (
    <div className="pd-page">
      <div className="pd-container">
        {/* Layout principal com imagem e informações */}
        <div className="pd-main-grid">
          {/* Galeria de imagens */}
          <section className="pd-gallery">
            <div className="pd-main-image">
              <img
                src={displayImages[activeImg]}
                alt={`${product.name} - Imagem ${activeImg + 1}`}
                className="pd-hero"
                loading="eager"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = littmannImg;
                }}
              />
            </div>
            <div className="pd-thumbnails">
              {displayImages.map((src, i) => (
                <button
                  key={`thumb-${i}`}
                  className={`pd-thumb ${i === activeImg ? "active" : ""}`}
                  onClick={() => setActiveImg(i)}
                  aria-label={`Ver imagem ${i + 1}`}
                  type="button"
                >
                  <img
                    src={src}
                    alt={`Miniatura ${i + 1}`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = littmannImg;
                    }}
                  />
                </button>
              ))}
            </div>
          </section>

          {/* Informações do produto */}
          <section className="pd-product-info">
            <h1 className="pd-title">{product.name}</h1>

            <div className="pd-sku">Código: {product.id}</div>

            <FormattedDescription
              text={product.description}
              className="pd-description"
            />

            <div className="pd-price">{formatBRL(product.price)}</div>

            {/* Quantidade */}
            <div className="pd-quantity">
              <label htmlFor="quantity">Qtd:</label>
              <input
                id="quantity"
                type="number"
                min={1}
                max={999}
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                inputMode="numeric"
              />
            </div>

            {/* Botões de ação */}
            <div className="pd-actions">
              <div className="pd-buttons">
                <button
                  className="btn btn-primary"
                  onClick={handleAddToCart}
                  type="button"
                >
                  Adicionar ao Carrinho
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleBuyNow}
                  type="button"
                >
                  Comprar Agora
                </button>
                <Link className="btn btn-secondary" to="/contato">
                  Solicite um Orçamento
                </Link>
              </div>
            </div>
          </section>
        </div>

        {/* Seção "Sobre o produto" */}
        <section className="pd-about-section">
          <div className="pd-section-header">
            <h2 className="pd-section-title">Sobre o produto</h2>
          </div>
          <div className="pd-section-content">
            <h3 className="pd-product-name">{product.name}</h3>

            <div className="pd-specs-grid">
              <div className="pd-spec-group">
                <h4>Descrição Completa:</h4>
                <p>{product.description}</p>
              </div>

              <div className="pd-spec-group">
                <h4>Categoria:</h4>
                <p>{product.category}</p>
              </div>

              <div className="pd-spec-group">
                <h4>Informações:</h4>
                <ul className="pd-spec-list">
                  <li>Produto verificado</li>
                  <li>Entrega conforme região</li>
                  <li>Atendimento personalizado</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* SEO estruturado */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              name: product.name,
              image: displayImages,
              description: product.description,
              offers: {
                "@type": "Offer",
                priceCurrency: "BRL",
                price: product.price,
                availability: "https://schema.org/InStock",
              },
            }),
          }}
        />
      </div>
    </div>
  );
};

export default ProductDetail;
function getAllImageUrls() {
  throw new Error("Function not implemented.");
}

function addToCart(
  arg0: {
    id: any;
    name: any;
    price: any; // precisa ser number e já é!
    image: any;
    slug: any;
  },
  qty: any
) {
  throw new Error("Function not implemented.");
}

function openCart() {
  throw new Error("Function not implemented.");
}

function setActiveImg(i: any) {
  throw new Error("Function not implemented.");
}

function setQty(arg0: number) {
  throw new Error("Function not implemented.");
}
