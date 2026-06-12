import type { APIEvent } from "@solidjs/start/server";
import { getFileURL } from "~/lib/api/files";

export async function GET(event: APIEvent) {
	return proxyRequest(event);
}

export async function POST(event: APIEvent) {
	return proxyRequest(event);
}

async function proxyRequest(event: APIEvent) {
	// const session = await useAuthSession();
	const headers = new Headers(event.request.headers);
	headers.delete("host");
	// headers.set("Authorization": "Bearer " + env.vars.SESSION_SECRET);

	const response = await fetch(getFileURL(event.params.id), {
		method: event.request.method,
		headers: headers,
		body: event.request.body,
		// @ts-ignore - needed in Node.js to allow streaming body
		duplex: "half",
	});

	return new Response(response.body, {
		status: response.status,
		headers: response.headers,
	});
}
