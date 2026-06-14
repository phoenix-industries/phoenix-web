import { request } from "./request";
import * as env from "~/lib/utils/env";

const FILES_ROUTE = "files/v1";

export type FileUploadResponse = {
	id: string;
};

export async function uploadFile(file: File): Promise<string> {
	const form = new FormData();
	form.append("file", file);
	const res = await request<FileUploadResponse>(`${FILES_ROUTE}/upload`, {
		method: "POST",
		body: form,
	});
	if (!res.ok) {
		console.log(res);
		throw new Error("Failed to upload file");
	}
	return res.data.id;
}

export function getFileDownloadURL(fileID: string): string {
	return `${env.vars.SERVER_URL}/${FILES_ROUTE}/download/${fileID}`;
}
