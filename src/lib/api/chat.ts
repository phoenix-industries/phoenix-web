export const CHAT_ROUTE = "/api/chat/v1";

export function connect() {
	return new WebSocket(`wss://osama.phoen${CHAT_ROUTE}/connect`);
}
