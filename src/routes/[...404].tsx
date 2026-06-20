import { onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";

export default function NotFound() {
	const navigate = useNavigate();
	onMount(() => {
		navigate("/");
	});
	return <div></div>;
}
