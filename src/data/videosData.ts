// src/data/videosData.ts
export interface VideoData {
  instagramUrl: any;
  category: string;
  id: number;
  videoThumbnail: string;
  mainTitle: string;
  descriptionText: string;
}

// export const videosData: VideoData[] = [
//   {
//     id: 1,
//     category: "mobilidade",
//     videoThumbnail:
//       "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400",
//     mainTitle: "Assento\ngiratório",
//     descriptionText:
//       "Você trabalha com movimentos repetitivos?\n" +
//       "Passa muito tempo com as mãos no teclado ou mouse?\n" +
//       "Especialistas relatam comumente o aumento de pacientes com LER.\n" +
//       "Confira alguns produtos que podem te ajudar!",
//   },
//   {
//     id: 2,
//     category: "mobilidade",
//     videoThumbnail:
//       "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
//     mainTitle: "Suporte\nlombar",
//     descriptionText:
//       "Trabalha muitas horas sentado?\n" +
//       "O Suporte Lombar Ergonômico pode ajudar a manter a postura correta\n" +
//       "e prevenir dores nas costas.\n" +
//       "Cuide da sua saúde!",
//   },
//   {
//     id: 3,
//     category: "mobilidade",
//     videoThumbnail:
//       "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400",
//     mainTitle: "Apoio para\npés",
//     descriptionText:
//       "Sente desconforto nas pernas durante o dia?\n" +
//       "O Apoio para Pés Ajustável melhora a circulação\n" +
//       "e reduz o cansaço.\n" +
//       "Experimente a diferença!",
//   },
//   {
//     id: 4,
//     category: "mobilidade",
//     videoThumbnail:
//       "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400",
//     mainTitle: "Estetos",
//     descriptionText:
//       "Equipamentos de alta qualidade para profissionais de saúde.\n" +
//       "Descubra nossa linha de estetoscópios\n" +
//       "com desempenho e conforto superiores.",
//   },
// ];
// src/data/videosData.ts

export const videosData = [
  {
    id: 1,
    category: "mobilidade",
    instagramUrl:
      "https://www.instagram.com/p/DRdqw34DPBa/?utm_source=ig_web_copy_link&igsh=NTc4MTIwNjQ2YQ==",
    mainTitle: "Assento\ngiratório",
    descriptionText:
      "Esse é um teste usando embed real do Instagram.\n" +
      "Agora o vídeo deve aparecer certinho no site.",
  },

  {
    id: 2,
    category: "ergonomia",
    videoThumbnail:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    mainTitle: "Suporte\nlombar",
    descriptionText:
      "Trabalha muitas horas sentado?\n" +
      "O Suporte Lombar Ergonômico pode ajudar a manter a postura correta.",
  },
  {
    id: 3,
    category: "ergonomia",
    videoThumbnail:
      "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400",
    mainTitle: "Apoio para\npés",
    descriptionText:
      "Melhora a circulação e reduz o cansaço.\nExperimente a diferença!",
  },
  {
    id: 4,
    category: "aspirar-baby",
    videoThumbnail:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400",
    mainTitle: "Estetos",
    descriptionText:
      "Equipamentos de alta qualidade para profissionais de saúde.",
  },
  {
    id: 5,
    category: "mobilidade",
    videoThumbnail:
      "https://images.unsplash.com/photo-1598300053654-602287fa7ea4?w=400",
    mainTitle: "Cadeira\nde rodas",
    descriptionText: "Conforto e mobilidade com design compacto e resistente.",
  },
  {
    id: 6,
    category: "mobilidade",
    videoThumbnail:
      "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=400",
    mainTitle: "Andador\nortopédico",
    descriptionText:
      "Auxilia segurança e autonomia para idosos e pessoas com dificuldade de locomoção.",
  },
];
