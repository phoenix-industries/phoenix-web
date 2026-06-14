import { action, query } from "@solidjs/router";
import { request, type ServerResponse } from "./request";
import { uploadFile } from "./files";
import type { User } from "./users";

export const PRODUCTS_ROUTE = `api/v1/products`;

export type ProductCategory = {
	id: string;
	name: string;
};

export type Product = {
	id: string;
	name: string;
	description?: string;
	price: number;
	discount: number;
	donated: boolean;
	category: ProductCategory;
	minimum_age: number;
	maximum_age: number;
	condition: string;
	image_id?: string | null;
	user?: Pick<User, "id" | "name"> | null;
};

export type ProductCreateData = Omit<
	Product,
	"id" | "user" | "category" | "donated"
> & {
	category_id: string;
	image_id?: string | null;
	donated?: boolean;
};

export type ProductSearchParams = Partial<{
	query: string;
	category: string;
	condition: string;
	price: `${string}-${string}`;
	limit: number;
	offset: number;
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

export async function createProductCategory(
	name: string,
): Promise<ServerResponse<ProductCategory>> {
	return await request<ProductCategory>(`${PRODUCTS_ROUTE}/categories`, {
		method: "POST",
		body: JSON.stringify({
			name: name,
		}),
	});
}

export const createProductAction = action(async (form: FormData) => {
	"use server";
	const data: ProductCreateData = {
		name: form.get("name") as string,
		description: form.get("description") as string,
		condition: form.get("condition") as string,
		category_id: form.get("category") as string,
		price: parseInt((form.get("price") ?? "0") as string) * 100,
		discount: parseInt((form.get("discount") ?? "0") as string) * 100,
		minimum_age: 3,
		maximum_age: 99,
	};
	data.donated = data.price === 0;
	const category = form.get("category_new") as string;
	if (category) {
		const res = await createProductCategory(category);
		if (!res.ok) {
			return res;
		}
		data.category_id = res.data.id;
	}
	const image = form.get("image") as File | null;
	if (image && image.size > 0) {
		data.image_id = await uploadFile(image);
	}
	return await request<Product>(`${PRODUCTS_ROUTE}`, {
		method: "POST",
		body: JSON.stringify(data),
	});
}, "createProduct");
