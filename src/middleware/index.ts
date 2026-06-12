import { createMiddleware } from "@solidjs/start/middleware";
import * as loggerMiddleware from "~/middleware/logger";
import * as authMiddleware from "~/middleware/auth";
import * as cspMiddleware from "~/middleware/csp";
import * as csrfMiddleware from "~/middleware/csrf";
import * as corsMiddleware from "~/middleware/cors";

export default createMiddleware({
	onRequest: [
		loggerMiddleware.onRequest,
		authMiddleware.onRequest,
		cspMiddleware.onRequest,
		csrfMiddleware.onRequest,
	],
	onBeforeResponse: [
		corsMiddleware.onBeforeResponse,
	],
});
