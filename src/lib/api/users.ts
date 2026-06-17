import { query } from "@solidjs/router";
import { request } from "./request";

export const USERS_ROUTE = `api/v1/users`;

export type User = {
	id: string;
	name: string;
	picture_id: string;
	city: string;
	governorate: string;
	created_at: string;
	updated_at: string;
	email: string;
	phone: string;
	address: string;
	birthday: string;
};

export const getUserQuery = query(
	(id: string) =>
		request<User>(`${USERS_ROUTE}/${id}`, {
			method: "GET",
		}),
	"getUser",
);
