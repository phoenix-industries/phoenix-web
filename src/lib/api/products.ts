import { action, query, revalidate } from "@solidjs/router";
import { request, type ServerResponse } from "./request";
import { uploadFile } from "./files";
import type { User } from "./users";

export const PRODUCTS_ROUTE = `/api/v1/products`;

export const SHIPPING_COST = 50 * 100;

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
	user?: Pick<
		User,
		"id" | "name" | "picture_id" | "city" | "governorate" | "created_at"
	> | null;
};

export type ProductSingle = Omit<Product, "user" | "category"> & {
	user_id: string;
	category: string;
	category_id: string;
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
	user: string;
	category: string;
	condition: string;
	price: string;
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

export const getProductsQuery = query(async (search?: ProductSearchParams) => {
	"use server";
	return await request<Product[]>(PRODUCTS_ROUTE, {
		method: "GET",
		params: search,
	});
}, "getProducts");

export const getProductQuery = query(async (id: string) => {
	"use server";
	return await request<ProductSingle>(`${PRODUCTS_ROUTE}/${id}`, {
		method: "GET",
	});
}, "getProduct");

export const getProductCategoriesQuery = query(async () => {
	"use server";
	return await request<ProductCategory[]>(`${PRODUCTS_ROUTE}/categories`, {
		method: "GET",
	});
}, "getProductCategories");

export async function createProductCategory(
	name: string,
): Promise<ServerResponse<ProductCategory>> {
	"use server";
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

export const buyProductAction = action(
	async (
		productID: string,
		quantity: number,
		method: "shipping" | "pickup",
		form: FormData,
	) => {
		"use server";
		const data = {
			products: [
				{
					id: productID,
					quantity: quantity,
				},
			],
			shipping_info:
				method === "shipping"
					? {
							full_name: form.get("full_name") as string,
							phone: form.get("phone") as string,
							city: form.get("city") as string,
							address: form.get("address") as string,
						}
					: null,
		};
		return await request<Product>(`${PRODUCTS_ROUTE}/buy`, {
			method: "POST",
			body: JSON.stringify(data),
		});
	},
	"buyProduct",
);

export const deleteProductAction = action(async (id: string) => {
	"use server";
	const res = await request<Product>(`${PRODUCTS_ROUTE}/${id}`, {
		method: "DELETE",
	});
	try {
		await revalidate(getProductsQuery.key);
	} catch (err: unknown) {
		// log but ignore
		console.error(err);
	}
	return res;
}, "deleteProduct");
