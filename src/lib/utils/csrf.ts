"use server";

import * as crypto from "crypto";
import * as env from "~/lib/utils/env";

const TOKEN_LENGTH = 64;
const HMAC_ENCODING = "hex";
const HMAC_ALGORITHM = "sha256";
const TOKEN_SECRET = env.vars.TRUSTED_ORIGINS;

export const TRUSTED_ORIGINS = env.vars.TRUSTED_ORIGINS.split(",");
export const SAFE_METHODS = ["GET", "HEAD", "OPTIONS", "TRACE"];
export const COOKIE_NAME = "csrf_token";
export const HEADER_NAME = "X-CSRF-Token";

export function generateToken(sessionId: string): string {
	const rand = crypto.randomBytes(TOKEN_LENGTH).toString(HMAC_ENCODING);
	const payload = `${sessionId.length}!${sessionId}!${rand.length}!${rand}`;
	const hmac = crypto
		.createHmac(HMAC_ALGORITHM, TOKEN_SECRET)
		.update(payload)
		.digest(HMAC_ENCODING);
	return `${hmac}.${rand}`;
}

export function verifyToken(token: string, sessionId: string): boolean {
	const [hmac, rand] = token.split(".");
	const payload = `${sessionId.length}!${sessionId}!${rand.length}!${rand}`;
	const expectedHmac = crypto
		.createHmac(HMAC_ALGORITHM, TOKEN_SECRET)
		.update(payload)
		.digest(HMAC_ENCODING);
	if (hmac.length !== expectedHmac.length) {
		return false;
	}
	try {
		return crypto.timingSafeEqual(
			Buffer.from(expectedHmac),
			Buffer.from(hmac),
		);
	} catch (err: unknown) {
		console.error(`utils/csrf.verifyToken: ${err}`);
		return false;
	}
}
