import { Product, PRODUCTS } from "../mock/products";

export const getProductById = (id: string): Product | undefined => {
  return PRODUCTS[id];
};

export const getProductsByCategory = (category: string): Product[] => {
  return Object.values(PRODUCTS).filter((product) => product.category === category);
};

export const getAllProducts = (): Product[] => {
  return Object.values(PRODUCTS);
};