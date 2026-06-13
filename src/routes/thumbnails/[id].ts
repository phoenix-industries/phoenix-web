import type { APIEvent } from "@solidjs/start/server";
import { getFileDownloadURL } from "~/lib/api/files";

export async function GET(event: APIEvent) {
	// const session = await useAuthSession();
	const headers = new Headers(event.request.headers);
	headers.delete("host");
	// headers.set("Authorization": "Bearer " + env.vars.SESSION_SECRET);

	const res = await fetch(getFileDownloadURL(event.params.id), {
		method: event.request.method,
		headers: headers,
		body: event.request.body,
		// @ts-ignore - needed in Node.js to allow streaming body
		duplex: "half",
	});

	return new Response(res.body, {
		status: res.status,
		headers: res.headers,
	});
}

// TODO
export async function POST(event: APIEvent) {}
