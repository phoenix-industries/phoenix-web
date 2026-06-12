import { query } from "@solidjs/router";
import { request } from "./request";
import type { User } from "./users";

export const PRODUCTS_ROUTE = `api/v1/products`;

export type Product = {
	id: number;
	name: string;
	price: number;
	discount: number;
	type: string;
	category: string;
	condition: string;
	image?: string | null;
	user?: Pick<User, "id" | "name"> | null;
};

export const getProductsQuery = query(
	() => request<Product[]>(PRODUCTS_ROUTE, { method: "GET" }),
	"getProducts",
);
