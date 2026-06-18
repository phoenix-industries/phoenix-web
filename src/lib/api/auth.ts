import { action, query, redirect, revalidate } from "@solidjs/router";
import { useSession } from "@solidjs/start/http";
import { request, type ServerResponse } from "~/lib/api/request";
import * as env from "~/lib/utils/env";

export const AUTH_ROUTE = "/auth";

export type AuthSessionData = {
	user_id: string;
	token_type: string;
	access_token: string;
	refresh_token: string;
	expires_at: number;
};

export async function useAuthSession() {
	"use server";
	return await useSession<AuthSessionData>({
		name: "auth",
		maxAge: 30 * 24 * 60 * 60, // 30 days
		password: env.vars.SESSION_SECRET,
		cookie: {
			maxAge: 30 * 24 * 60 * 60, // 30 days
			httpOnly: true,
			secure: !env.DEV,
			sameSite: "lax",
			path: "/",
		},
	});
}

export async function refresh(
	token?: string,
): Promise<ServerResponse<AuthSessionData>> {
	"use server";
	if (!token) {
		const auth = await useAuthSession();
		if (!auth.data) {
			return { ok: false, error: "No auth session" };
		}
		token = auth.data.refresh_token;
		if (!token) {
			return { ok: false, error: "No refresh token" };
		}
	}
	return await request<AuthSessionData>(`${AUTH_ROUTE}/refresh`, {
		method: "POST",
		body: JSON.stringify({
			refresh_token: token,
		}),
	});
}

export type AuthLoginData = {
	identifier: string;
	password: string;
};

export async function login(
	data: AuthLoginData,
): Promise<ServerResponse<AuthSessionData>> {
	"use server";
	return await request<AuthSessionData>(`${AUTH_ROUTE}/login`, {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export type AuthRegisterData = {
	name: string;
	email: string;
	phone: string;
	password: string;
	gender: string;
	birthdate: string;
	city: string | null;
	governorate: string | null;
	address: string | null;
};

export async function register(
	data: AuthRegisterData,
): Promise<ServerResponse<AuthSessionData>> {
	"use server";
	return await request<AuthSessionData>(`${AUTH_ROUTE}/register`, {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export async function logout(token: string): Promise<ServerResponse<null>> {
	"use server";
	return await request<null>(`${AUTH_ROUTE}/logout`, {
		method: "POST",
		body: JSON.stringify({
			refresh_token: token,
		}),
	});
}

export const getSessionQuery = query(async () => {
	"use server";
	const auth = await useAuthSession();
	if (!auth.data.refresh_token) {
		return { ok: false, error: "No auth session" };
	}
	return { ok: true, data: { userID: auth.data.user_id } };
}, "getSession");

export const ensureSessionQuery = query(async () => {
	"use server";
	const auth = await useAuthSession();
	if (!auth.data.refresh_token) {
		throw redirect("/login", { status: 302, statusText: "Found" });
	}
	return { ok: true, data: { userID: auth.data.user_id } };
}, "ensureSession");

export const loginAction = action(async (form: FormData) => {
	"use server";
	const data: AuthLoginData = {
		identifier: form.get("identifier") as string,
		password: form.get("password") as string,
	};
	// TODO: client-side validation
	const response = await login(data);
	if (!response.ok) {
		return response;
	}
	const auth = await useAuthSession();
	await auth.update((data) => ({
		...data,
		token_type: response.data.token_type,
		access_token: response.data.access_token,
		refresh_token: response.data.refresh_token,
		expires_at: response.data.expires_at,
	}));
	return { ok: true, data: null } as ServerResponse<null>;
}, "login");

export const registerAction = action(async (form: FormData) => {
	"use server";
	const data: AuthRegisterData = {
		name: `${form.get("first_name")} ${form.get("last_name")}`,
		email: form.get("email") as string,
		phone: form.get("phone") as string,
		password: form.get("password") as string,
		gender: form.get("gender") as string,
		birthdate: new Date(form.get("birthdate") as string).toISOString(),
		city: form.get("city") as string | null,
		governorate: form.get("governorate") as string | null,
		address: form.get("address") as string | null,
	};
	if (!data.name || !data.email || !data.phone || !data.password) {
		return { ok: false, error: "Please fill all fields" };
	}
	if (!data.email.includes("@")) {
		return { ok: false, error: "Please enter a valid email" };
	}
	// TODO: client-side validation
	const response = await register(data);
	if (!response.ok) {
		return response;
	}
	const auth = await useAuthSession();
	await auth.update((data) => ({
		...data,
		token_type: response.data.token_type,
		access_token: response.data.access_token,
		refresh_token: response.data.refresh_token,
		expires_at: response.data.expires_at,
	}));
	return { ok: true, data: null } as ServerResponse<null>;
}, "register");

export const logoutAction = action(async () => {
	"use server";
	const auth = await useAuthSession();
	if (!auth.data.refresh_token) {
		return { ok: false, error: "No auth session" };
	}
	const res = await logout(auth.data.refresh_token);
	if (!res.ok) {
		return res;
	}
	await auth.clear();
	await revalidate(getSessionQuery.key);
	return { ok: true, data: null };
}, "logout");

export const resetPasswordAction = action(async (form: FormData) => {
	"use server";
	const data = {
		password: form.get("password") as string,
		new_password: form.get("new_password") as string,
	};
	const res = await request<AuthSessionData>(`${AUTH_ROUTE}/password`, {
		method: "PUT",
		body: JSON.stringify(data),
	});
	if (!res.ok) {
		return res;
	}
	const auth = await useAuthSession();
	await auth.update((data) => ({
		...data,
		token_type: res.data.token_type,
		access_token: res.data.access_token,
		refresh_token: res.data.refresh_token,
		expires_at: res.data.expires_at,
	}));
	await revalidate(getSessionQuery.key);
	return { ok: true, data: null } as ServerResponse<null>;
}, "resetPassword");
