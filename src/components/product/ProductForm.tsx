import { createSignal, For, Show } from "solid-js";
import { createAsync } from "@solidjs/router";
import {
	getProductCategoriesQuery,
	productConditions,
} from "~/lib/api/products";
import InfoIcon from "lucide-solid/icons/info";
import ListIcon from "lucide-solid/icons/list";
import FileImageIcon from "lucide-solid/icons/file-image";
import DollarSignIcon from "lucide-solid/icons/dollar-sign";
import CloudUploadIcon from "lucide-solid/icons/cloud-upload";
import "./ProductForm.css";

export type ProductFormProps = {
	type: "edit" | "create";
	donated?: boolean;
	onSubmit?: (form: FormData) => any;
};

export function ProductForm(props: ProductFormProps) {
	const categories = createAsync(
		async () => {
			const c = await getProductCategoriesQuery();
			return c.ok ? c.data : [];
		},
		{
			initialValue: [],
			deferStream: true,
		},
	);
	const [donate, setDonate] = createSignal(props.donated ?? false);
	const [category, setCategory] = createSignal("");
	const [imageUpload, setImageUpload] = createSignal<File | null>(null);
	let imageUploadInput: HTMLInputElement;

	function handleSubmit(ev: Event) {
		if (!props.onSubmit) return;
		ev.preventDefault();
		const form = new FormData(ev.target as HTMLFormElement);
		props.onSubmit(form);
	}

	return (
		<main class="container">
			<div class="flex items-center mt-12 text-xl font-bold bg-(--surface)">
				<button
					type="button"
					class="flex-1 p-1 text-center text-primary transition-colors duration-300 border-2 border-primary rounded-l-lg"
					classList={{
						"bg-primary text-white border-l-primary": donate(),
					}}
					onClick={() => setDonate(true)}
				>
					Donate
				</button>
				<button
					type="button"
					class="flex-1 p-1 text-center text-primary transition-colors duration-300 border-2 border-primary rounded-r-lg"
					classList={{
						"bg-primary text-white": !donate(),
					}}
					onClick={() => setDonate(false)}
				>
					Sell
				</button>
			</div>
			<div class="page-header">
				<Show
					when={donate()}
					fallback={
						<>
							<h1 class="text-3xl font-bold">
								Turn your unused items into cash
							</h1>
							<p>Sell fast, easy, and safely.</p>
						</>
					}
				>
					<h1 class="text-3xl font-bold">
						Your old items can change someone's life
					</h1>
					<p>Donate today and make an impact.</p>
				</Show>
			</div>
			<form class="form-card" onSubmit={handleSubmit}>
				<div class="form-section">
					<h2>
						<FileImageIcon /> Product Image
					</h2>
					<input
						type="file"
						name="image"
						accept="image/*"
						multiple
						style="display: none;"
						ref={(el) => (imageUploadInput = el)}
						onChange={(e) =>
							setImageUpload(e.currentTarget.files?.[0] ?? null)
						}
					/>
					<div
						class="upload-area"
						classList={{
							"py-30!": !imageUpload(),
						}}
						onClick={() => imageUploadInput.click()}
					>
						<Show
							when={imageUpload()}
							fallback={
								<>
									<CloudUploadIcon
										size="48"
										class="mx-auto"
									/>
									<p>Click to upload</p>
								</>
							}
						>
							{(image) => (
								<>
									<img
										src={URL.createObjectURL(image())}
										alt="Product Image"
										class="size-full object-contain max-h-58"
									/>
									<p class="mt-4">Click to change</p>
								</>
							)}
						</Show>
					</div>
				</div>
				<div class="form-section">
					<h2>
						<InfoIcon /> Basic Information
					</h2>
					<div class="form-group">
						<label>Product Title *</label>
						<input
							type="text"
							name="name"
							placeholder="e.g., MacBook Pro"
						/>
					</div>
					<div class="form-group">
						<label>Description *</label>
						<textarea
							name="description"
							rows="3"
							placeholder="Describe your product..."
						></textarea>
					</div>
				</div>
				<div class="form-section">
					<h2>
						<ListIcon /> Category & Condition
					</h2>
					<div class="form-row">
						<div class="form-group">
							<label>Category *</label>
							<select
								name="category"
								onChange={(e) =>
									setCategory(e.currentTarget.value)
								}
							>
								<option value="">Select category</option>
								<For each={categories()}>
									{(category) => (
										<option value={category.id}>
											{category.name}
										</option>
									)}
								</For>
								<option value="others">
									Others (write your own)
								</option>
							</select>
						</div>
						<Show when={category() === "others"}>
							<div class="form-group custom-category-group">
								<label>Write your category *</label>
								<input
									type="text"
									name="category_new"
									placeholder="e.g., Kitchen Appliances"
								/>
							</div>
						</Show>
						<div class="form-group">
							<label>Condition *</label>
							<select name="condition">
								<option value="">Select condition</option>
								<For each={productConditions}>
									{(condition) => (
										<option value={condition}>
											{condition}
										</option>
									)}
								</For>
							</select>
						</div>
					</div>
				</div>
				<Show when={!donate()}>
					<div class="form-section">
						<h2>
							<DollarSignIcon /> Pricing
						</h2>
						<div class="form-row">
							<div class="form-group">
								<label>Price *</label>
								<div class="price-group">
									<select name="currency">
										<option value="EGP">EGP</option>
										{/*
									<option value="USD">USD</option>
									<option value="EUR">EUR</option>
									*/}
									</select>
									<input
										name="price"
										type="number"
										placeholder="0.00"
										step="0.01"
										min="0"
									/>
								</div>
							</div>
						</div>
					</div>
				</Show>
				<div class="action-buttons">
					<button type="submit" class="btn-primary">
						{donate() ? "Donate Item" : "List Item for Sale"}
					</button>
				</div>
			</form>
		</main>
	);
}
