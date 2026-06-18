import { createSignal, Show, For } from "solid-js";
import { Portal } from "solid-js/web";
import { toast } from "solid-sonner";
import { governorates } from "~/lib/utils/constants";
import { updateUserAction, type User } from "~/lib/api/users";
import { uploadFile } from "~/lib/api/files";
import UserAvatar from "~/components/user/UserAvatar";
import InfoIcon from "lucide-solid/icons/info";
import CameraIcon from "lucide-solid/icons/camera";
import UserCircleIcon from "lucide-solid/icons/user-circle";
import ChevronDownIcon from "lucide-solid/icons/chevron-down";
import "./SettingsProfile.css";

export type GovernorateSelectProps = {
	value: string;
	onSelect: (gov: string) => void;
};

export function GovernorateSelect(props: GovernorateSelectProps) {
	const [open, setOpen] = createSignal(false);
	const [search, setSearch] = createSignal("");

	const filtered = () =>
		governorates.filter((g) =>
			g.toLowerCase().includes(search().toLowerCase()),
		);

	const select = (gov: string) => {
		props.onSelect(gov);
		setOpen(false);
		setSearch("");
	};

	return (
		<div class="custom-select">
			<div
				class={`custom-select-trigger ${open() ? "open" : ""}`}
				onClick={() => setOpen(!open())}
			>
				<span>{props.value || "Select Governorate"}</span>
				<ChevronDownIcon size="16" />
			</div>
			<div class="custom-select-dropdown" classList={{ show: open() }}>
				<div class="custom-select-search">
					<input
						type="text"
						placeholder="Search governorate..."
						value={search()}
						onInput={(e) => setSearch(e.target.value)}
					/>
				</div>
				<div class="custom-select-options">
					<For each={filtered()}>
						{(gov) => (
							<div
								class={`custom-select-option ${gov === props.value ? "selected" : ""}`}
								onClick={() => select(gov)}
							>
								{gov}
							</div>
						)}
					</For>
					{filtered().length === 0 && (
						<div
							class="custom-select-option"
							style="cursor:default"
						>
							No results found
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

type ProfileImageProps = {
	pictureID?: string;
	onUpload: (id: string) => void;
};

function ProfileImage(props: ProfileImageProps) {
	let cropperImage: HTMLImageElement | null = null;
	let canvasRef: HTMLCanvasElement | undefined;
	const [imageID, setImageID] = createSignal(props.pictureID ?? "");
	const [showCropper, setShowCropper] = createSignal(false);
	const [zoom, setZoom] = createSignal(1);
	const [panX, setPanX] = createSignal(0);
	const [panY, setPanY] = createSignal(0);
	let dragging = false;
	let lastX = 0;
	let lastY = 0;

	function handleDraw() {
		if (!canvasRef || !cropperImage) return;
		const ctx = canvasRef.getContext("2d")!;
		const size = 280;
		ctx.clearRect(0, 0, size, size);
		ctx.save();
		ctx.beginPath();
		ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
		ctx.clip();
		const scaledW = cropperImage.width * zoom();
		const scaledH = cropperImage.height * zoom();
		const x = panX() + (size - scaledW) / 2;
		const y = panY() + (size - scaledH) / 2;
		ctx.drawImage(cropperImage, x, y, scaledW, scaledH);
		ctx.restore();
		ctx.beginPath();
		ctx.arc(size / 2, size / 2, size / 2 - 1, 0, Math.PI * 2);
		ctx.strokeStyle = "var(--accent-1)";
		ctx.lineWidth = 3;
		ctx.stroke();
	}

	function handleStartDrag(e: MouseEvent | TouchEvent) {
		e.preventDefault();
		dragging = true;
		const rect = canvasRef!.getBoundingClientRect();
		const scaleX = 280 / rect.width;
		const scaleY = 280 / rect.height;
		const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
		const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
		lastX = (clientX - rect.left) * scaleX;
		lastY = (clientY - rect.top) * scaleY;
	}

	function handleDrag(e: MouseEvent | TouchEvent) {
		e.preventDefault();
		if (!dragging || !canvasRef) return;
		const rect = canvasRef.getBoundingClientRect();
		const scaleX = 280 / rect.width;
		const scaleY = 280 / rect.height;
		const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
		const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
		const currentX = (clientX - rect.left) * scaleX;
		const currentY = (clientY - rect.top) * scaleY;
		setPanX((p) => p + currentX - lastX);
		setPanY((p) => p + currentY - lastY);
		lastX = currentX;
		lastY = currentY;
		handleDraw();
	}

	function handleEndDrag(e: MouseEvent | TouchEvent) {
		e.preventDefault();
		dragging = false;
	}

	function fitToCircle() {
		if (!cropperImage) return;
		const size = 280;
		const scaleX = size / cropperImage.width;
		const scaleY = size / cropperImage.height;
		const fitScale = Math.min(scaleX, scaleY);
		setZoom(fitScale);
		setPanX(0);
		setPanY(0);
		handleDraw();
	}

	function resetCropper() {
		setZoom(1);
		setPanX(0);
		setPanY(0);
		handleDraw();
	}

	async function getCroppedImage(): Promise<File | null> {
		if (!canvasRef) return null;
		const size = 280;
		const offCanvas = document.createElement("canvas");
		offCanvas.width = size;
		offCanvas.height = size;
		const offCtx = offCanvas.getContext("2d")!;
		offCtx.beginPath();
		offCtx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
		offCtx.clip();
		offCtx.drawImage(canvasRef, 0, 0, size, size);
		return new Promise((resolve, reject) => {
			offCanvas.toBlob(
				(blob) => {
					if (!blob) {
						reject("invalid file");
						return;
					}
					const file = new File([blob], "avatar.png", {
						type: "image/png",
					});
					resolve(file);
				},
				"image/png",
				90,
			);
		});
	}

	function handleAvatarChange(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file && file.type.startsWith("image/")) {
			const reader = new FileReader();
			reader.onload = (ev) => {
				const img = new Image();
				img.onload = () => {
					cropperImage = img;
					setZoom(1);
					setPanX(0);
					setPanY(0);
					setShowCropper(true);
					fitToCircle();
				};
				img.src = ev.target?.result as string;
			};
			reader.readAsDataURL(file);
		}
	}

	async function confirmCropper() {
		try {
			const image = await getCroppedImage();
			if (!image) {
				toast.error("Failed to crop image");
				return;
			}
			const id = await uploadFile(image);
			console.log(id);
			setImageID(id);
			props.onUpload(id);
			setShowCropper(false);
		} catch (err: any) {
			toast.error(`Error updating avatar: ${err.message}`);
			console.error(err);
		}
	}

	return (
		<div>
			<div style="display:flex; align-items:center; gap:1.5rem; margin-bottom:1.5rem;">
				<div class="size-48 rounded-b-full border-3 border-(--accent-1)">
					<UserAvatar id={imageID()} class="object-cover" />
				</div>
				<div>
					<button
						class="change-photo-btn"
						onClick={() =>
							document.getElementById("avatarInput")?.click()
						}
					>
						<CameraIcon size="16" /> Change Photo
					</button>
					<input
						type="file"
						id="avatarInput"
						accept="image/png,image/jpeg"
						style="display:none"
						onChange={handleAvatarChange}
					/>
				</div>
			</div>
			<Portal>
				<Show when={showCropper()}>
					<div class="modal-overlay active cropper-modal">
						<div class="modal-box">
							<h3>Adjust Profile Photo</h3>
							<div class="cropper-container">
								<div class="circle-cropper">
									<canvas
										ref={canvasRef}
										width="280"
										height="280"
										onMouseDown={handleStartDrag}
										onMouseMove={handleDrag}
										onMouseUp={handleEndDrag}
										onTouchStart={handleStartDrag}
										onTouchMove={handleDrag}
										onTouchEnd={handleEndDrag}
										onLoad={handleDraw}
									/>
								</div>
								<div class="cropper-controls">
									<input
										type="range"
										min="0.3"
										max="3"
										step="0.01"
										value={zoom()}
										onInput={(e) => {
											setZoom(parseFloat(e.target.value));
											handleDraw();
										}}
									/>
									<button
										class="btn-outline"
										onClick={fitToCircle}
									>
										Fit to Circle
									</button>
									<button
										class="btn-outline"
										onClick={resetCropper}
									>
										Reset
									</button>
								</div>
								<div class="modal-actions">
									<button
										class="modal-btn outline"
										onClick={() => setShowCropper(false)}
									>
										Cancel
									</button>
									<button
										class="modal-btn"
										onClick={confirmCropper}
									>
										Confirm Photo
									</button>
								</div>
							</div>
						</div>
					</div>
				</Show>
			</Portal>
		</div>
	);
}

export type SettingsProfileProps = {
	user: Omit<User, "created_at" | "updated_at">;
};

export function SettingsProfile(props: SettingsProfileProps) {
	const [governorate, setGovernorate] = createSignal(props.user.governorate);
	const [pcitureID, setPictureID] = createSignal(props.user.picture_id);

	return (
		<form action={updateUserAction.with("me")} method="post">
			<div class="section-title">
				<UserCircleIcon size="24" /> Edit Profile
			</div>
			<div class="settings-card">
				<input type="hidden" name="picture_id" value={pcitureID()} />
				<ProfileImage
					pictureID={props.user.picture_id}
					onUpload={(id) => setPictureID(id)}
				/>
				<div class="form-group">
					<label>Name</label>
					<input type="text" name="name" value={props.user.name} />
				</div>
				<div class="form-group">
					<label>Email</label>
					<input type="email" value={props.user.email} readonly />
				</div>
				<div class="form-group">
					<label>Phone Number</label>
					<input type="tel" value={props.user.phone} readonly />
					<div style="font-size:0.7rem; margin-top:0.3rem;">
						<InfoIcon size="12" /> If you need to change your phone
						number, please contact support.
					</div>
				</div>
				<div style="display:flex; gap:1rem; flex-wrap:wrap;">
					<div class="form-group" style="flex:1">
						<input
							type="hidden"
							name="governorate"
							value={governorate()}
						/>
						<label>Governorate</label>
						<GovernorateSelect
							value={governorate()}
							onSelect={(v) => setGovernorate(v)}
						/>
					</div>
					<div class="form-group" style="flex:1">
						<label>City</label>
						<input
							name="city"
							type="text"
							placeholder="Enter City Name"
							value={props.user.city}
						/>
					</div>
				</div>
				{/*
				<div class="form-group">
					<label>Bio</label>
					<textarea
						rows="2"
						style="width:100%; padding:0.8rem; border-radius:20px;"
						value={bio()}
						onInput={(e) => setBio(e.target.value)}
					/>
				</div>
				*/}
				<button type="submit" class="btn">
					Save Changes
				</button>
			</div>
		</form>
	);
}

export default SettingsProfile;
