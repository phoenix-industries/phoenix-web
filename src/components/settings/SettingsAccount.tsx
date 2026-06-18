import { A, useAction, useNavigate, useSubmission } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import { toast } from "solid-sonner";
import { deleteUserAction, type User } from "~/lib/api/users";
import CogIcon from "lucide-solid/icons/cog";
import TrashIcon from "lucide-solid/icons/trash-2";
import LockIcon from "lucide-solid/icons/lock";
import AlertTriangleIcon from "lucide-solid/icons/alert-triangle";

export type SettingsAccountProps = {
	user: User;
};

export function SettingsAccount(props: SettingsAccountProps) {
	const navigate = useNavigate();
	const [deleteModal, setDeleteModal] = createSignal(false);
	const submission = useSubmission(deleteUserAction);
	const deleteAccount = useAction(deleteUserAction);

	async function handleDeleteAccount() {
		if (submission.pending) return;
		try {
			const res = await deleteAccount(props.user.id);
			if (!res.ok) {
				const msg = `Failed to delete account: ${res.error}`;
				toast.error(msg);
				console.error(msg);
				return;
			}
			toast.success("Account deleted successfully, bye!");
			navigate("/");
		} catch (err: unknown) {
			toast.error(`Error deleting account: ${err}`);
			console.error(err);
		}
	}

	return (
		<>
			<div class="section-title">
				<CogIcon size="24" /> Account Management
			</div>
			<A href="/reset-password">
			<div class="settings-card max-w-48 flex flex-col items-center gap-2 mx-auto">
				<LockIcon size={20} color="var(--accent-1)" />
				<span>Reset Password</span>
			</div>
			</A>
			<div class="settings-card danger-zone">
				<div class="danger-title">
					<AlertTriangleIcon size="20" /> Danger Zone
				</div>
				<div class="danger-action">
					<div class="danger-action-info">
						<h4>Delete Account Permanently</h4>
						<p>
							This action cannot be undone. All your data will be
							erased.
						</p>
					</div>
					<button
						class="danger-btn"
						onClick={() => setDeleteModal(true)}
					>
						Delete
					</button>
				</div>
			</div>

			<Show when={deleteModal()}>
				<div class="modal-overlay active">
					<div class="modal-box">
						<TrashIcon
							size={32}
							color="var(--danger)"
							style="margin-bottom:1rem;"
						/>
						<h3>Permanently Delete Account</h3>
						<p>
							⚠️ WARNING: This action is permanent. All your data
							will be deleted. Continue?
						</p>
						<div class="modal-actions">
							<button
								class="modal-btn outline"
								onClick={() => setDeleteModal(false)}
							>
								Cancel
							</button>
							<button
								class="modal-btn danger"
								onClick={handleDeleteAccount}
							>
								Yes, Delete Permanently
							</button>
						</div>
					</div>
				</div>
			</Show>
		</>
	);
}
