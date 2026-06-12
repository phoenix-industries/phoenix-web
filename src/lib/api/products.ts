import { query } from "@solidjs/router";
import { request } from "./request";
import type { User } from "./users";

export const PRODUCTS_ROUTE = `api/v1/products`;

export type ProductCategory = {
	id: number;
	name: string;
};

export type Product = {
	id: number;
	name: string;
	price: number;
	discount: number;
	type: string;
	category: ProductCategory;
	condition: string;
	image?: string | null;
	user?: Pick<User, "id" | "name"> | null;
};

export type ProductSearchParams = Partial<{
	query: string;
	category: string;
	condition: string;
	price: string;
	type: string;
}>;

export const productConditions = [
	"new",
	"good",
	"fair",
	"used",
	"refurbished",
] as const;

export const getProductsQuery = query(
	(search?: ProductSearchParams) =>
		request<Product[]>(PRODUCTS_ROUTE, {
			method: "GET",
			params: search,
		}),
	"getProducts",
);

export const getProductCategoriesQuery = query(
	() =>
		request<ProductCategory[]>(`${PRODUCTS_ROUTE}/categories`, {
			method: "GET",
		}),
	"getProductCategories",
);
