import { action, query } from "@solidjs/router";
import { request } from "./request";

export const USERS_ROUTE = `/api/v1/users`;

export type User = {
	id: string;
	name: string;
	picture_id: string;
	city: string;
	governorate: string;
	email: string;
	phone: string;
	address: string;
	birthdate: string;
	created_at: string;
	updated_at: string;
};

export const getUserQuery = query(async (id: string) => {
	"use server";
	return await request<User>(`${USERS_ROUTE}/${id}`, {
		method: "GET",
	});
}, "getUser");

export const updateUserAction = action(async (id: string, form: FormData) => {
	"use server";
	const data: Partial<User> = {};
	for (const [key, value] of form.entries()) {
		if (!value || typeof value !== "string") continue;
		data[key as keyof User] = value;
	}
	return await request<null>(`${USERS_ROUTE}/${id}`, {
		method: "PATCH",
		body: JSON.stringify(data),
	});
});

export const deleteUserAction = action(async (id: string) => {
	"use server";
	return await request<null>(`${USERS_ROUTE}/${id}`, {
		method: "DELETE",
	});
});
