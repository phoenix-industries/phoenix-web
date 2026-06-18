import { createSignal, Show } from "solid-js";
import EyeIcon from "lucide-solid/icons/eye";
import EyeOffIcon from "lucide-solid/icons/eye-off";
import CircleDotIcon from "lucide-solid/icons/circle-dot";

export const speicalChars = "!@#$%^&*";
export const speicalCharsRegex = new RegExp(`[${speicalChars}]`);

type PasswordInputProps = {
	showConfirm?: boolean;
	showRequirements?: boolean;
};

export function PasswordInput(props: PasswordInputProps) {
	const [showPassword, setShowPassword] = createSignal(false);
	const [showConfirmPassword, setShowConfirmPassword] = createSignal(false);
	const [password, setPassword] = createSignal("");
	const [confirmPassword, setConfirmPassword] = createSignal("");
	return (
		<div>
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
						<Show when={showPassword()} fallback={<EyeOffIcon />}>
							<EyeIcon />
						</Show>
					</button>
				</div>
				<Show when={props.showRequirements}>
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
										"stroke-(--accent-1)": !/[A-Z]/.test(
											password(),
										),
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
										"stroke-(--accent-1)": !/[a-z]/.test(
											password(),
										),
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
											!speicalCharsRegex.test(password()),
										"stroke-emerald-500":
											speicalCharsRegex.test(password()),
									}}
								/>
								One special character {speicalChars}
							</li>
						</ul>
					</div>
				</Show>
			</div>
			<div class="input-group">
				<label>Confirm Password</label>
				<div class="password-wrapper">
					<input
						name="password_confirm"
						type={showConfirmPassword() ? "text" : "password"}
						class="input-field"
						placeholder="Confirm your password"
						classList={{
							"border-4 border-red-500!":
								confirmPassword() !== password(),
						}}
						onInput={(e) => setConfirmPassword(e.target.value)}
					/>
					<button
						type="button"
						class="toggle-password"
						onClick={() =>
							setShowConfirmPassword(!showConfirmPassword())
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
		</div>
	);
}
