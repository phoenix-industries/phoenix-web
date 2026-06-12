import { createEffect, createSignal, on, Show } from "solid-js";
import { useNavigate, useSubmission } from "@solidjs/router";
import { loginAction } from "~/lib/api/auth";
import EyeIcon from "lucide-solid/icons/eye";
import EyeOffIcon from "lucide-solid/icons/eye-off";
import "./login.css";
import { toast } from "solid-sonner";

export default function LoginPage() {
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = createSignal(false);
	const submission = useSubmission(loginAction);

	createEffect(
		on(
			() => submission.result,
			async (result) => {
				if (submission.pending || !result) return;
				if (!result.ok) {
					toast.error(result.error);
					return;
				}
				toast.success("Successfully logged in");
				navigate("/");
			},
		),
	);

	return (
		<div class="signin-container min-h-screen -mt-20">
			<div class="signin-card bg-white dark:bg-[#1e1e2a] shadow-lg">
				<form class="form-side" action={loginAction} method="post">
					<h3>Sign In</h3>
					<div class="subhead">
						Access your account to donate or sell items.
					</div>

					<div class="input-group">
						<label>Email Address</label>
						<input
							name="identifier"
							type="text"
							class="input-field"
							placeholder="hello@phoenix.exchange"
							autocomplete="email"
							autofocus
						/>
					</div>
					<div class="input-group">
						<label>Password</label>
						<div class="input-wrapper">
							<input
								type={showPassword() ? "text" : "password"}
								name="password"
								class="input-field"
								placeholder="8+ characters"
								autocomplete="current-password"
							/>
							<button
								type="button"
								class="password-toggle"
								aria-label="Show password"
								onClick={() => setShowPassword(!showPassword())}
							>
								<Show
									when={showPassword()}
									fallback={<EyeOffIcon />}
								>
									<EyeIcon />
								</Show>
							</button>
						</div>
					</div>

					<div class="row-options">
						<label class="remember">
							<input type="checkbox" /> Remember me
						</label>
						<div class="forgot">
							<a href="forgot-password.html">Forgot Password?</a>
						</div>
					</div>

					<div id="errorMessage" class="error-message">
						<i class="fas fa-exclamation-circle"></i>
						<span id="errorText"></span>
					</div>

					<button class="btn-signin" type="submit">
						Sign In
					</button>

					<div class="create-account mt-4">
						Don't have an account?{" "}
						<a href="create-account.html">Create an Account</a>
					</div>
					<div class="footer-note">
						Phoenix Exchange System © 2026
					</div>
				</form>
			</div>
		</div>
	);
}
