import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export interface ProductVariant {
  _id?: string;
  color: string;
  images?: string[];
  size?: Array<{ size: string; stock: number }>;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  productInformation: string;
  category: string;
  subCategory: string;
  sku: string;
  isActive: boolean;
  price: number;
  mrp: number;
  design: string;
  label?: string;
  averageRating: number;
  ratingCount: number;
  variants: ProductVariant[];
}

export interface FetchProductsParams {
  searchQuery?: string;
  category?: string;
  subCategory?: string;
  design?: string;
  priceMin?: string;
  priceMax?: string;
  rating?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface ProductListResult {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

const fetchProducts = async (
  params: FetchProductsParams,
): Promise<ProductListResult> => {
  const urlParams = new URLSearchParams();
  urlParams.append("page", String(params.page || 1));
  urlParams.append("limit", String(params.limit || 8));
  urlParams.append("sort", params.sort || "newest");
  if (params.searchQuery) urlParams.append("searchQuery", params.searchQuery);
  if (params.category) urlParams.append("category", params.category);
  if (params.subCategory) urlParams.append("subCategory", params.subCategory);
  if (params.design) urlParams.append("design", params.design);
  if (params.priceMin) urlParams.append("priceMin", params.priceMin);
  if (params.priceMax) urlParams.append("priceMax", params.priceMax);
  if (params.rating) urlParams.append("rating", params.rating);

  const response = await api.get<{
    status?: boolean;
    data?: {
      products?: Product[];
      total?: number;
      page?: number;
      limit?: number;
    };
    message?: string;
  }>(`/product/filter?${urlParams.toString()}`);

  if (response?.status && Array.isArray(response.data?.products)) {
    return {
      products: response.data.products,
      total: response.data.total ?? response.data.products.length,
      page: response.data.page ?? params.page ?? 1,
      limit: response.data.limit ?? params.limit ?? 8,
    };
  } else {
    throw new Error(response?.message || "Failed to load products");
  }
};

export const useProducts = (params: FetchProductsParams) => {
  return useQuery<ProductListResult, Error>({
    queryKey: ["products", params],
    queryFn: () => fetchProducts(params),
  });
};
