import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./ProductDetail.css";

// ⚠️ IMAGENS:
// - Se você usar caminhos começando com "/assets/...", coloque os arquivos em public/assets/...
// - Se as imagens ficarem em src/assets, importe-as (ex.: import img from "../../assets/xyz.png")
type Product = {
  id: string;           // slug da rota, ex.: "littmann-classic-iii"
  sku: string;          // 5627
  name: string;
  price: number;        // em centavos para evitar float
  shortBullets: string[];
  description: string[];
  boxItems?: string[];
  specs?: Record<string, string>;
  images: string[];     // primeira é a principal
  related?: Array<{
    id: string;
    name: string;
    thumbnail: string;
    price?: number;
  }>;
};

// MOCK local — troque por dados do Strapi quando quiser
const PRODUCTS: Record<string, Product> = {
  "littmann-class-iii-5627": {
    id: "littmann-class-iii-5627",
    sku: "5627",
    name: "Estetoscópio Littmann Classic III – Vinho",
    price: 0, // se não tiver preço, deixa 0 para exibir “R$ 0,00”
    shortBullets: [
      "Alta sensibilidade acústica para desempenho excepcional",
      "Diafragmas ajustáveis em ambos os lados",
      "Sem látex; fácil de limpar",
    ],
    description: [
      "O estetoscópio Littmann® Classic III oferece alta sensibilidade acústica para desempenho excepcional nas avaliações clínicas dos profissionais de saúde.",
      "Possui diafragmas ajustáveis e um novo design que é mais fácil de colocar e de limpar devido à sua superfície lisa sem fendas.",
      "A campânula pediátrica converte-se em tradicional ao remover o diafragma e colocar o anel antifrio."
    ],
    boxItems: [
      "1 Estetoscópio Littmann® Classic III™",
      "Manual do usuário",
      "Par adicional de olivas rígidas"
    ],
    specs: {
      "Peso (aprox.)": "82 g",
      "Comprimento do tubo": "71 cm",
      "Diâmetro do diafragma": "4,3 cm",
      "Garantia": "5 anos",
      "Aplicação": "Adulto e pediátrico"
    },
    images: [
      "/assets/products/littmann/hero.jpg",
      "/assets/products/littmann/detail-1.jpg",
      "/assets/products/littmann/detail-2.jpg",
      "/assets/products/littmann/detail-3.jpg",
    ],
    related: [
      { id: "olivas-reposicao", name: "Olivas de reposição", thumbnail: "/assets/products/rel/olivas.jpg", price: 2990 },
      { id: "gel-condutor", name: "Gel condutor", thumbnail: "/assets/products/rel/gel.jpg", price: 1590 },
      { id: "estojo-esteto", name: "Estojo para estetoscópio", thumbnail: "/assets/products/rel/estojo.jpg", price: 7990 },
      { id: "alcool-spray", name: "Álcool Spray 70%", thumbnail: "/assets/products/rel/alcool.jpg", price: 990 },
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
    // fallback: se id não existir, usa o Littmann
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

  const priceLabel = formatBRL(product.price);

  const handleAddToCart = () => {
    // TODO: integrar com seu carrinho/Context
    alert(`Adicionado: ${product.name} (x${qty})`);
  };

  const handleBuyNow = () => {
    // TODO: integração real de checkout
    alert(`Comprar agora: ${product.name} (x${qty})`);
  };

  return (
    <div className="pd-page">
      <nav className="pd-breadcrumbs" aria-label="breadcrumb">
        <Link to="/">Início</Link>
        <span aria-hidden>›</span>
        <Link to="/products">Produtos</Link>
        <span aria-hidden>›</span>
        <span className="current">{product.name}</span>
      </nav>

      <div className="pd-container">
        {/* Galeria */}
        <section className="pd-gallery" aria-label="Imagens do produto">
          <div className="pd-gallery-main">
            {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
            <img
              key={product.images[activeImg]}
              src={product.images[activeImg]}
              alt={`Imagem ${activeImg + 1} do produto`}
              className="pd-hero"
              loading="eager"
            />
          </div>
          <div className="pd-thumbs">
            {product.images.map((src, i) => (
              <button
                key={src}
                className={`pd-thumb ${i === activeImg ? "is-active" : ""}`}
                onClick={() => setActiveImg(i)}
                aria-label={`Ver imagem ${i + 1}`}
              >
                <img src={src} alt={`Miniatura ${i + 1}`} />
              </button>
            ))}
          </div>
        </section>

        {/* Informações principais */}
        <section className="pd-info">
          <h1 className="pd-title">{product.name}</h1>
          <div className="pd-sku">Cód.: <strong>{product.sku}</strong></div>

          <ul className="pd-bullets">
            {product.shortBullets.map((b) => <li key={b}>{b}</li>)}
          </ul>

          <div className="pd-price-line">
            <span className="pd-price">{priceLabel}</span>
          </div>

          <div className="pd-actions">
            <label className="pd-qty">
              <span>Qtd.</span>
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                inputMode="numeric"
              />
            </label>

            <button className="btn add" onClick={handleAddToCart}>Adicionar ao carrinho</button>
            <button className="btn buy" onClick={handleBuyNow}>Comprar agora</button>
            <Link className="btn quote" to="/contato">Solicite um orçamento</Link>
          </div>

          {/* Calculadora de frete (placeholder) */}
          <div className="pd-shipping">
            <label>
              <span>Calcular frete:</span>
              <input type="text" placeholder="Digite seu CEP" maxLength={9} />
            </label>
            <button className="btn outline">Calcular</button>
          </div>
        </section>
      </div>

      {/* Sobre o produto */}
      <section className="pd-about">
        <h2 className="pd-section-title">Sobre o produto:</h2>

        <h3 className="pd-h3">{product.name}</h3>
        {product.description.map((p, i) => (
          <p key={i} className="pd-paragraph">{p}</p>
        ))}

        {!!product.boxItems?.length && (
          <>
            <h3 className="pd-h3">Conteúdo da Embalagem</h3>
            <ul className="pd-list">
              {product.boxItems.map((it) => <li key={it}>{it}</li>)}
            </ul>
          </>
        )}

        {!!product.specs && (
          <>
            <h3 className="pd-h3">Especificações</h3>
            <table className="pd-specs">
              <tbody>
                {Object.entries(product.specs).map(([k, v]) => (
                  <tr key={k}>
                    <th>{k}</th>
                    <td>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </section>

      {/* Relacionados */}
      {!!product.related?.length && (
        <section className="pd-related">
          <h2 className="pd-section-title">Produtos relacionados:</h2>
          <div className="pd-related-grid">
            {product.related.map((r) => (
              <Link to={`/product/${r.id}`} key={r.id} className="pd-related-card">
                <img src={r.thumbnail} alt={r.name} />
                <div className="pd-related-name">{r.name}</div>
                {typeof r.price === "number" && (
                  <div className="pd-related-price">{formatBRL(r.price)}</div>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* SEO estruturado (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: product.name,
            sku: product.sku,
            image: product.images,
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
  );
};

export default ProductDetail;
