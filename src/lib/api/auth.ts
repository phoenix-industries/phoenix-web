import { useSession } from "@solidjs/start/http";
import { request, type ServerResponse } from "~/lib/api/request";
import * as env from "~/lib/utils/env";

export const AUTH_ROUTE = "/auth/v1";

export type AuthSessionData = {
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
			secure: env.PROD,
			sameSite: "lax",
			path: "/",
		},
	});
}

export async function refresh(
	token?: string,
): Promise<ServerResponse<AuthSessionData>> {
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
};

export async function register(
	data: AuthRegisterData,
): Promise<ServerResponse<AuthSessionData>> {
	return await request<AuthSessionData>(`${AUTH_ROUTE}/login`, {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export async function logout(token?: string): Promise<ServerResponse<null>> {
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
	return await request<null>(`${AUTH_ROUTE}/refresh`, {
		method: "POST",
		body: JSON.stringify({
			refresh_token: token,
		}),
	});
}
