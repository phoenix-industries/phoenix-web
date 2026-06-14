import { createEffect, createSignal, on, For, Show } from "solid-js";
import { A, useNavigate, useSubmission } from "@solidjs/router";
import { toast } from "solid-sonner";
import { registerAction } from "~/lib/api/auth";
import {
	governorates,
	speicalChars,
	speicalCharsRegex,
} from "~/lib/utils/constants";
import UserIcon from "lucide-solid/icons/user";
import LockIcon from "lucide-solid/icons/lock";
import MapPinIcon from "lucide-solid/icons/map-pin";
import EyeIcon from "lucide-solid/icons/eye";
import EyeOffIcon from "lucide-solid/icons/eye-off";
import CircleDotIcon from "lucide-solid/icons/circle-dot";
import "./register.css";

export default function RegisterPage() {
	const navigate = useNavigate();
	const submission = useSubmission(registerAction);
	const [password, setPassword] = createSignal("");
	const [confirmPassword, setConfirmPassword] = createSignal("");
	const [showPassword, setShowPassword] = createSignal(false);
	const [showConfirmPassword, setShowConfirmPassword] = createSignal(false);

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
		<div class="signup-container">
			<form action={registerAction} method="post" class="signup-card">
				<div class="form-side">
					<h3>Create Account</h3>
					<div class="subhead">
						Fill in your details to get started.
					</div>

					<div class="section-label">
						<UserIcon /> Personal Info
					</div>
					<div class="form-row">
						<div class="input-group">
							<label>First Name</label>
							<input
								type="text"
								name="first_name"
								class="input-field"
								placeholder="John"
								autofocus
							/>
						</div>
						<div class="input-group">
							<label>Last Name</label>
							<input
								type="text"
								name="last_name"
								class="input-field"
								placeholder="Doe"
							/>
						</div>
					</div>
					<div class="form-row">
						<div class="input-group">
							<label>Email Address</label>
							<input
								type="email"
								name="email"
								class="input-field"
								placeholder="hello@phoenix.exchange"
							/>
						</div>
						<div class="input-group">
							<label>Phone Number</label>
							<input
								type="tel"
								name="phone"
								class="input-field"
								placeholder="+20 123 456 789"
							/>
						</div>
					</div>
					<div class="form-row">
						<div class="input-group">
							<label>Gender</label>
							<select name="gender" class="input-field">
								<option value="" disabled selected>
									Select Gender
								</option>
								<option value="male">Male</option>
								<option value="female">Female</option>
							</select>
						</div>
						<div class="input-group">
							<label>Date of Birth</label>
							<input
								type="date"
								name="birthdate"
								class="input-field"
							/>
						</div>
					</div>

					<div class="section-label">
						<MapPinIcon /> Location
					</div>
					<div class="form-row">
						<div class="input-group">
							<label>Governorate</label>
							<select name="governorate" class="input-field">
								<option value="" disabled selected>
									Select Governorate
								</option>
								<For each={governorates}>
									{(governorate) => (
										<option>{governorate}</option>
									)}
								</For>
							</select>
						</div>
						<div class="input-group">
							<label>City</label>
							<input
								type="text"
								name="city"
								class="input-field"
								placeholder="e.g. Faqous"
							/>
						</div>
					</div>

					<div class="section-label flex items-center">
						<LockIcon />
						Security
					</div>
					<div class="input-group">
						<label>Password</label>
						<div class="password-wrapper">
							<input
								name="password"
								type={showPassword() ? "text" : "password"}
								class="input-field"
								placeholder="Create a strong password"
								onInput={(e) => setPassword(e.target.value)}
							/>
							<button
								type="button"
								class="toggle-password"
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
						<div class="password-requirements">
							<p>Your password must contain:</p>
							<ul>
								<li>
									<CircleDotIcon
										size="16"
										classList={{
											"stroke-(--accent-1)":
												password().length < 8,
											"stroke-emerald-500":
												password().length >= 8,
										}}
									/>
									At least 8 characters characters
								</li>
								<li>
									<CircleDotIcon
										size="16"
										classList={{
											"stroke-(--accent-1)":
												!/[A-Z]/.test(password()),
											"stroke-emerald-500": /[A-Z]/.test(
												password(),
											),
										}}
									/>
									One uppercase letter
								</li>
								<li>
									<CircleDotIcon
										size="16"
										classList={{
											"stroke-(--accent-1)":
												!/[a-z]/.test(password()),
											"stroke-emerald-500": /[a-z]/.test(
												password(),
											),
										}}
									/>
									One lowercase letter
								</li>
								<li>
									<CircleDotIcon
										size="16"
										classList={{
											"stroke-(--accent-1)": !/\d/.test(
												password(),
											),
											"stroke-emerald-500": /\d/.test(
												password(),
											),
										}}
									/>
									One number
								</li>
								<li>
									<CircleDotIcon
										size="16"
										classList={{
											"stroke-(--accent-1)":
												!speicalCharsRegex.test(
													password(),
												),
											"stroke-emerald-500":
												speicalCharsRegex.test(
													password(),
												),
										}}
									/>
									One special character {speicalChars}
								</li>
							</ul>
						</div>
					</div>
					<div class="input-group">
						<label>Confirm Password</label>
						<div class="password-wrapper">
							<input
								name="password_confirm"
								type={
									showConfirmPassword() ? "text" : "password"
								}
								class="input-field"
								placeholder="Confirm your password"
								classList={{
									"border-4 border-red-500!":
										confirmPassword() !== password(),
								}}
								onInput={(e) =>
									setConfirmPassword(e.target.value)
								}
							/>
							<button
								type="button"
								class="toggle-password"
								onClick={() =>
									setShowConfirmPassword(
										!showConfirmPassword(),
									)
								}
							>
								<Show
									when={showConfirmPassword()}
									fallback={<EyeOffIcon />}
								>
									<EyeIcon />
								</Show>
							</button>
						</div>
					</div>

					<button class="btn-signup" type="submit">
						<span>Create Account</span>
					</button>

					<p class="login-link">
						Already have an account? <A href="/login">Login</A>
					</p>
				</div>
			</form>
		</div>
	);
}
