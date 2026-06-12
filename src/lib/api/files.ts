import * as env from "~/lib/utils/env";
import type {} from "./request.ts";

const FILES_ROUTE = "api/v1/files";

export function getFileURL(fileId: string) {
	return `${env.vars.SERVER_URL}/${FILES_ROUTE}/${fileId}`;
}
