// src/data/posts.ts
export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  hero: string;
  thumb: string;
  content: string[];
};

export const posts: Post[] = [
  {
    slug: "pulso-dolorido",
    title: "Seu pulso está dolorido? Confira as possíveis causas.",
    excerpt:
      "Você realiza movimentos repetitivos? Passa muito tempo no teclado ou no mouse? Veja o que pode estar acontecendo.",
    date: "12/05/2025",
    hero: "/assets/blog/hero.jpg",
    thumb: "/assets/blog/thumb1.jpg",
    content: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      "Praesent pharetra posuere nisl at iaculis...",
      "Etiam a massa non nulla fringilla dictum..."
    ],
  },
  {
    slug: "dores-ombro",
    title: "Dores no ombro: quando procurar um especialista?",
    excerpt:
      "Sinais de alerta, causas mais comuns e dicas práticas para aliviar o desconforto.",
    date: "20/05/2025",
    hero: "/assets/blog/hero2.jpg",
    thumb: "/assets/blog/thumb2.jpg",
    content: ["Conteúdo do post 2...", "Mais conteúdo...", "Conclusão..."],
  },
  {
    slug: "tendinite-cuidados",
    title: "Tendinite: cuidados no dia a dia",
    excerpt:
      "Entenda o que é, como prevenir e quais produtos podem ajudar na rotina.",
    date: "01/06/2025",
    hero: "/assets/blog/hero3.jpg",
    thumb: "/assets/blog/thumb3.jpg",
    content: ["Conteúdo do post 3...", "Mais conteúdo...", "Conclusão..."],
  },
];
