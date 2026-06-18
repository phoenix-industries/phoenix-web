import { createEffect, on } from "solid-js";
import { createAsync, useNavigate, useSubmission } from "@solidjs/router";
import { ensureSessionQuery, resetPasswordAction } from "~/lib/api/auth";
import { PasswordInput } from "~/components/utils/PasswordInput";
import "./reset-password.css";
import { toast } from "solid-sonner";

export default function ResetPasswordPage() {
	const ensureSession = createAsync(() => ensureSessionQuery(), {
		deferStream: true,
	});
	const navigate = useNavigate();
	const submission = useSubmission(resetPasswordAction);

	createEffect(
		on(
			() => submission.result,
			(result) => {
				if (submission.pending || !result) return;
				if (!result.ok) {
					switch (result.error) {
						case "bad request":
							toast.error("invalid password");
							break;
						default:
							toast.error("unknown error");
							break;
					}
					toast.error(result.error);
					return;
				}
				toast.success("password reset successfully");
				navigate("/");
			},
		),
	);

	return (
		<div class="container">
			<div class="card">
				<h3>Set New Password</h3>
				<div class="subhead">Enter your new password below.</div>

				<form action={resetPasswordAction} method="post">
					<PasswordInput
						fieldName="password"
						fieldLabel="Current Password"
					/>
					<PasswordInput
						fieldName="new_password"
						fieldLabel="New Password"
						showConfirm
						showRequirements
					/>

					<button type="submit" class="btn-primary" id="submitBtn">
						<span id="submitText">Reset Password</span>
						<span
							class="spinner"
							classList={{
								hidden: !submission.pending,
								"inline-block": submission.pending,
							}}
						></span>
					</button>
				</form>

				<div class="back-link">
					<a href="/">← Back to Home</a>
				</div>
				<div class="footer-note">Phoenix Exchange System © 2026</div>
			</div>
		</div>
	);
}
