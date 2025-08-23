export type Product = {
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

export const PRODUCTS: Record<string, Product> = {
  "littmann-class-iii-5627": {
    id: "littmann-class-iii-5627",
    sku: "5627",
    name: "Estetoscópio Littmann Classic III – Vinho",
    price: 89900, // R$ 899,00
    description: "O estetoscópio Littmann® Classic III oferece alta sensibilidade acústica para um desempenho excepcional nas avaliações clínicas dos profissionais de saúde. Possui diafragmas ajustáveis e um novo design que é mais fácil de colocar e de limpar devido a sua superfície lisa sem fendas.",
    images: [
      "/assets/1.png",
      "/assets/1.png",
      "/assets/1.png",
      "/assets/1.png",
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