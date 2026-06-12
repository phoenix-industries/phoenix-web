import pino from "pino";

export const logger = pino({
	level: import.meta.env.PROD ? "info" : "debug",
	transport: import.meta.env.PROD
		? {
				target: "pino-pretty",
				options: {
					colorize: true,
				},
			}
		: undefined,
});

export default logger;
