// src/types/blog.ts

export interface Media {
  id: string;
  url: string;
  alt?: string;
  filename: string;
  mimeType: string;
  filesize: number;
  width?: number;
  height?: number;
}

export interface BlogPostFromPayload {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Agora é string simples, não rich text
  featuredImage?: Media;
  gallery?: Array<{
    image: Media;
    id?: string;
  }>;
  category: 'news' | 'tips' | 'trends' | 'events';
  tags?: Array<{
    tag: string;
    id?: string;
  }>;
  status: 'draft' | 'published';
  featured: boolean;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
  wpId?: number;
  publishedAt: string;
  updatedAt: string;
  createdAt: string;
}

export interface FormattedBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  category: string;
  featured: boolean;
}

export interface BlogPostPageData {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string; // String simples
  featuredImage?: Media;
  gallery?: Array<{
    image: Media;
    id?: string;
  }>;
  category: string;
  tags?: Array<{
    tag: string;
    id?: string;
  }>;
  featured: boolean;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
  publishedAt: string;
}