import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./ProductDetail.css";
import littmannImg from "../../assets/1.png";
import a from "../../assets/1.png"

type Product = {
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

const PRODUCTS: Record<string, Product> = {
  "littmann-class-iii-5627": {
    id: "littmann-class-iii-5627",
    sku: "5627",
    name: "Estetoscópio Littmann Classic III – Vinho",
    price: 89900, // R$ 899,00
    description: "O estetoscópio Littmann® Classic III oferece alta sensibilidade acústica para um desempenho excepcional nas avaliações clínicas dos profissionais de saúde. Possui diafragmas ajustáveis e um novo design que é mais fácil de colocar e de limpar devido a sua superfície lisa sem fendas.",
    images: [
      littmannImg,
      littmannImg, 
      littmannImg,
      littmannImg,
    ],
    specs: {
      caracteristicas: [
        "Excelente desempenho acústico com oitava a mais",
        "Diafragma ajustável dupla face",
        "Campânula pediátrica conversível",
        "Diafragma Littmann de alto desempenho",
        "Superfície lisa sem fendas, facilitando a limpeza",
        "Peça torácica de design ergonômico e durável",
        "Hastes anatômicas anguladas"
      ],
      aplicacao: [
        "Cardiologia",
        "Medicina interna", 
        "Medicina geral",
        "Pediatria",
        "Cirurgia",
        "Medicina familiar",
        "Emergência"
      ],
      especificacoes: [
        "Peso (aprox.): 82 g",
        "Comprimento do tubo: 71 cm",
        "Diâmetro do diafragma: 4,3 cm",
        "Binaurais: Liga metálica anodizada",
        "Olivas: Soft-sealing",
        "Tubo: Sem látex",
        "Diafragma: Liga metálica"
      ],
      garantia: [
        "Garantia total: 5 anos",
        "Cobertura nacional",
        "Certificado de garantia incluso",
        "Assistência técnica autorizada",
        "Peças de reposição disponíveis"
      ]
    },
    related: [
      { 
        id: "olivas-littmann", 
        name: "Olivas de Reposição Littmann", 
        thumbnail: "/assets/products/rel/olivas.jpg", 
        price: 2990 
      },
      { 
        id: "pamnmetro-aneroid", 
        name: "Esfigmomanômetro Aneroide", 
        thumbnail: "/assets/products/rel/esfig.jpg", 
        price: 15990 
      },
      { 
        id: "algodao-70", 
        name: "Algodão 70° - Caixa com 500ml", 
        thumbnail: "/assets/products/rel/alcool.jpg", 
        price: 1299 
      },
      { 
        id: "lanterna-led", 
        name: "Lanterna Clínica LED", 
        thumbnail: "/assets/products/rel/lanterna.jpg", 
        price: 4990 
      },
    ]
  }
};

function formatBRL(cents: number) {
  const v = (cents || 0) / 100;
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = useMemo(() => {
    return (id && PRODUCTS[id]) || PRODUCTS["littmann-class-iii-5627"] || Object.values(PRODUCTS)[0];
  }, [id]);

  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveImg(0);
  }, [id]);

  if (!product) {
    return (
      <div className="pd-page">
        <div className="pd-container">
          <p>Produto não encontrado.</p>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    alert(`Adicionado ao carrinho: ${product.name} (x${qty})`);
  };

  const handleBuyNow = () => {
    alert(`Comprar agora: ${product.name} (x${qty})`);
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
                src={product.images[activeImg]}
                alt={`${product.name} - Imagem ${activeImg + 1}`}
                className="pd-hero"
                loading="eager"
              />
            </div>
            <div className="pd-thumbnails">
              {product.images.map((src, i) => (
                <button
                  key={`thumb-${i}`}
                  className={`pd-thumb ${i === activeImg ? "active" : ""}`}
                  onClick={() => setActiveImg(i)}
                  aria-label={`Ver imagem ${i + 1}`}
                  type="button"
                >
                  <img src={src} alt={`Miniatura ${i + 1}`} />
                </button>
              ))}
            </div>
          </section>

          {/* Informações do produto */}
          <section className="pd-product-info">
            <h1 className="pd-title">{product.name}</h1>
            
            <div className="pd-sku">Código: {product.sku}</div>
            
            <div className="pd-description">
              {product.description}
            </div>
            
            <div className="pd-price">
              {formatBRL(product.price)}
            </div>

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

        {/* Seção "Sobre o produto" com faixa vermelha */}
        <section className="pd-about-section">
          <div className="pd-section-header">
            <h2 className="pd-section-title">Sobre o produto</h2>
          </div>
          <div className="pd-section-content">
            <h3 className="pd-product-name">{product.name}</h3>
            
            <div className="pd-specs-grid">
              <div className="pd-spec-group">
                <h4>Características:</h4>
                <ul className="pd-spec-list">
                  {product.specs.caracteristicas.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="pd-spec-group">
                <h4>Aplicação:</h4>
                <ul className="pd-spec-list">
                  {product.specs.aplicacao.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="pd-spec-group">
                <h4>Especificações Técnicas:</h4>
                <ul className="pd-spec-list">
                  {product.specs.especificacoes.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="pd-spec-group">
                <h4>Garantia:</h4>
                <ul className="pd-spec-list">
                  {product.specs.garantia.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Produtos relacionados */}
        {!!product.related?.length && (
          <section className="pd-related-section">
            <div className="pd-related-header">
              <h2 className="pd-related-title">Produtos relacionados</h2>
            </div>
            <div className="pd-related-content">
              <div className="pd-related-grid">
                {product.related.map((relatedProduct) => (
                  <Link 
                    to={`/product/${relatedProduct.id}`} 
                    key={relatedProduct.id} 
                    className="pd-related-item"
                  >
                    <img 
                      src={littmannImg} 
                      alt={relatedProduct.name}
                      loading="lazy"
                    />
                    <div className="pd-related-name">{relatedProduct.name}</div>
                    {typeof relatedProduct.price === "number" && (
                      <div className="pd-related-price">
                        {formatBRL(relatedProduct.price)}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SEO estruturado */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              name: product.name,
              sku: product.sku,
              image: product.images,
              description: product.description,
              brand: {
                "@type": "Brand",
                name: "Littmann"
              },
              offers: {
                "@type": "Offer",
                priceCurrency: "BRL",
                price: (product.price || 0) / 100,
                availability: "https://schema.org/InStock"
              }
            })
          }}
        />
      </div>
    </div>
  );
};

export default ProductDetail;