import { createEffect, on, For } from "solid-js";
import { A, useNavigate, useSubmission } from "@solidjs/router";
import { toast } from "solid-sonner";
import { governorates } from "~/lib/utils/constants";
import { registerAction } from "~/lib/api/auth";
import {PasswordInput} from "~/components/utils/PasswordInput";
import UserIcon from "lucide-solid/icons/user";
import LockIcon from "lucide-solid/icons/lock";
import MapPinIcon from "lucide-solid/icons/map-pin";
import "./register.css";

export default function RegisterPage() {
	const navigate = useNavigate();
	const submission = useSubmission(registerAction);

	createEffect(
		on(
			() => submission.result,
			(result) => {
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
					<PasswordInput showConfirm showRequirements />
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
