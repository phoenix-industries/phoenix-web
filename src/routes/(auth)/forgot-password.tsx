import { createSignal, Show } from "solid-js";
import { toast } from "solid-sonner";
import { SpinnerInfinity } from "~/components/utils/Spinner";
import "./forgot-password.css";

export default function ForgotPasswordPage() {
	const [loading, setLoading] = createSignal(false);

	function handleSubmit(ev: SubmitEvent) {
		ev.preventDefault();
		setLoading(true);
		const timeout = setTimeout(() => {
			setLoading(false);
			toast.success("An email has been sent to reset your password");
			clearTimeout(timeout);
		}, 1000);
	}

	return (
		<div class="container">
			<div class="card">
				<h3>Forgot Password?</h3>
				<div class="subhead">
					Enter your email and we'll send you a reset link.
				</div>
				<form onSubmit={handleSubmit}>
					<div class="input-group">
						<label>Email Address</label>
						<input
							type="email"
							id="email"
							placeholder="hello@phoenix.exchange"
							required
							autocomplete="email"
						/>
					</div>
					<button
						type="submit"
						class="btn-primary flex justify-center items-center gap-3"
						disabled={loading()}
					>
						<span id="submitText">Send Reset Link</span>
						<Show when={loading()}>
							<SpinnerInfinity class="size-7 text-white" />
						</Show>
					</button>
				</form>
				<div class="back-link">
					<a href="/login">← Back to Login</a>
				</div>
				<div class="footer-note">Phoenix Exchange System © 2026</div>
			</div>
		</div>
	);
}
