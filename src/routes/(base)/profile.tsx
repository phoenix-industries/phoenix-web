import { createSignal, For, Show, Suspense } from "solid-js";
import { A, createAsync, useAction, useNavigate } from "@solidjs/router";
import { toast } from "solid-sonner";
import { ensureSessionQuery } from "~/lib/api/auth";
import { getUserQuery } from "~/lib/api/users";
import {
	deleteProductAction,
	getProductsQuery,
	type Product,
} from "~/lib/api/products";
import { UserAvatar } from "~/components/user/UserAvatar";
import { ProductCard } from "~/components/product/ProductCard";
import { SpinnerInfinity } from "~/components/utils/Spinner";
import MapPinIcon from "lucide-solid/icons/map-pin";
import MailIcon from "lucide-solid/icons/mail";
import EditIcon from "lucide-solid/icons/edit";
import PhoneIcon from "lucide-solid/icons/phone";
import PlusCircleIcon from "lucide-solid/icons/plus-circle";
import "./profile.css";

type Tab = "sells" | "donations";

function ListingsSection(props: { products: Product[] }) {
	const navigate = useNavigate();
	const deleteProduct = useAction(deleteProductAction);
	const [deletePending, setDeletePending] = createSignal(false);
	const [currentTab, setCurrentTab] = createSignal<Tab>("sells");
	const items = () => {
		switch (currentTab()) {
			case "sells":
				return props.products?.filter((p) => !p.donated);
			case "donations":
				return props.products?.filter((p) => p.donated);
			default:
				return props.products;
		}
	};

	const emptyMessages: Record<Tab, string> = {
		sells: "No items for sale yet.",
		donations: "No donations yet.",
	};

	async function handleDelete(productId: string) {
		if (deletePending()) {
			toast.warning("working on it...");
			return;
		}
		if (!confirm("Delete this item permanently?")) {
			return;
		}
		setDeletePending(true);
		try {
			const res = await deleteProduct(productId);
			if (!res.ok) {
				toast.error(`Failed to delete product: ${res.error}`);
				return;
			}
			toast.success("Product deleted successfully!");
		} catch (err: unknown) {
			toast.error(`Failed to delete product: ${(err as Error).message}`);
		}
		setDeletePending(false);
	}

	return (
		<div>
			<div class="listings-header">
				<h2>My Listings</h2>
				<div class="tabs-container ">
					<For each={["sells", "donations"] as Tab[]}>
						{(tab) => (
							<button
								class={`tab-btn${currentTab() === tab ? " active" : ""}`}
								onClick={() => setCurrentTab(tab)}
							>
								{tab.charAt(0).toUpperCase() + tab.slice(1)}
							</button>
						)}
					</For>
				</div>
				<A href="/products/new" class="add-item-btn">
					<PlusCircleIcon /> Add New
				</A>
			</div>
			<Show
				when={items()?.length > 0}
				fallback={
					<div
						class="empty-state"
						onClick={() => navigate("/products/new")}
					>
						<i class="fas fa-box-open" />
						<h3>{emptyMessages[currentTab()]}</h3>
						<p style="color:var(--text-secondary);margin-top:0.5rem;">
							Click to add your first product
						</p>
					</div>
				}
			>
				<div class="product-grid">
					<For each={[...items()].reverse()}>
						{(p) => (
							<ProductCard
								product={p}
								controls={true}
								onEdit={() =>
									navigate(`/products/${p.id}/edit`)
								}
								onDelete={() => handleDelete(p.id)}
							/>
						)}
					</For>
				</div>
			</Show>
		</div>
	);
}

export default function ProfilePage() {
	const ensureSession = createAsync(() => ensureSessionQuery(), {
		deferStream: true,
	});

	const navigate = useNavigate();
	const data = createAsync(
		async () => {
			const user = await getUserQuery("me");
			if (!user.ok) return null;
			const products = await getProductsQuery({ user: "me" });
			if (!products.ok) return null;
			return {
				user: user.data,
				products: products.data,
			};
		},
		{
			initialValue: null,
			deferStream: true,
		},
	);

	return (
		<main class="container" id="mainContent">
			<Suspense fallback={<SpinnerInfinity class="text-primary" />}>
				<Show when={data()}>
					{(d) => {
						const { user, products } = d();
						return (
							<>
								<div class="profile-header">
									<div class="avatar-section">
										<div class="profile-avatar">
											<UserAvatar
												id={user.picture_id}
												alt={user.name}
											/>
										</div>
									</div>
									<div class="profile-info">
										<h1>{d().user.name}</h1>
										<div class="username">
											<MapPinIcon />
											{user.governorate} · {user.city}
										</div>

										{/* FIXME */}
										{/*
										<Show when={hasBio}>
											<div class="info-item">
												<i class="fas fa-quote-left" />{" "}
												{escapeHtml(user.bio!)}
											</div>
										</Show>
										*/}

										<div class="contact-info">
											<div class="info-item">
												<PhoneIcon />
												<span>{user.phone}</span>
											</div>
											<div class="info-item">
												<MailIcon />
												<span>{user.email}</span>
											</div>
										</div>

										<div class="profile-actions">
											<button
												type="button"
												class="edit-profile-btn"
												onClick={() =>
													navigate("/settings")
												}
											>
												<EditIcon />
												<span>Edit Profile</span>
											</button>
										</div>
									</div>
								</div>

								{/* FIXME */}
								{/*
								<div class="stats-row">
									<StatCard
										value={stats.activeListings ?? 0}
										label="Active Listings"
									/>
									<StatCard
										value={stats.successfulTrades ?? 0}
										label="Successful Trades"
									/>
									<StatCard
										value={(
											stats.averageRating ?? 0
										).toFixed(1)}
										label="Average Rating"
									/>
									<StatCard
										value={stats.responseTime ?? "N/A"}
										label="Response Time"
									/>
								</div>
								*/}

								<ListingsSection products={products} />
							</>
						);
					}}
				</Show>
			</Suspense>
		</main>
	);
}
