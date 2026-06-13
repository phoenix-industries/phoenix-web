import * as env from "~/lib/utils/env";
import type {} from "./request.ts";

const FILES_ROUTE = "files/v1";

export function getFileDownloadURL(fileID: string): string {
	return `${env.vars.SERVER_URL}/${FILES_ROUTE}/download/${fileID}`;
}
