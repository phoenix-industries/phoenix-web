import { createEffect, createSignal, on, Show, Suspense } from "solid-js";
import {
	createAsync,
	useNavigate,
	useParams,
	useSubmission,
} from "@solidjs/router";
import { toast } from "solid-sonner";
import * as money from "~/lib/utils/money";
import { getUserQuery } from "~/lib/api/users";
import {
	buyProductAction,
	getProductQuery,
	SHIPPING_COST,
} from "~/lib/api/products";
import { SpinnerInfinity } from "~/components/utils/Spinner";
import { ProductThumbnail } from "~/components/product/ProductThumbnail";
import StoreIcon from "lucide-solid/icons/store";
import TruckIcon from "lucide-solid/icons/truck";
import ShoppingBagIcon from "lucide-solid/icons/shopping-bag";
import "./[id].css";
import { Title } from "@solidjs/meta";

export default function ProductCheckoutPage() {
	const params = useParams();
	const navigate = useNavigate();
	if (!params.id || typeof params.id !== "string") {
		navigate("/market");
		return;
	}

	const submission = useSubmission(buyProductAction);
	const data = createAsync(
		async () => {
			const p = await getProductQuery(params.id as string);
			if (!p.ok) return null;
			const me = await getUserQuery("me");
			if (!me.ok) return null;
			return { product: p.data, user: me.data };
		},
		{
			initialValue: null,
			deferStream: true,
		},
	);

	const [method, setMethod] = createSignal<"shipping" | "pickup">("shipping");
	const total = () =>
		method() === "shipping"
			? (data()?.product.price ?? 0) + SHIPPING_COST
			: (data()?.product.price ?? 0);

	createEffect(
		on(
			() => submission.result,
			async (result) => {
				if (submission.pending || !result) return;
				if (!result.ok) {
					toast.error(result.error);
					return;
				}
				toast.success("Your order has been placed successfully", {
					description:
						"You will receive an email confirmation shortly",
				});
				navigate("/");
			},
		),
	);

	return (
		<main class="container">
			<Title>Checkout - Phoenix</Title>
			<div class="checkout-grid">
				<form
					class="payment-section"
					method="post"
					action={buyProductAction.with(params.id, 1, method())}
				>
					<div class="section-title">
						<TruckIcon class="inline size-6 text-primary" />{" "}
						Delivery Method
					</div>
					<div class="delivery-options">
						<button
							type="button"
							class="delivery-option"
							classList={{ selected: method() === "shipping" }}
							onClick={() => setMethod("shipping")}
						>
							<TruckIcon class="inline size-6 text-primary" />
							<span>Ship to address</span>
						</button>
						<button
							type="button"
							class="delivery-option"
							classList={{ selected: method() === "pickup" }}
							onClick={() => setMethod("pickup")}
						>
							<StoreIcon class="inline size-6 text-primary" />
							<span>Pick up from seller</span>
						</button>
					</div>
					<div
						class="shipping-fields"
						classList={{ show: method() === "shipping" }}
					>
						<div class="form-group">
							<label>Full Name *</label>
							<input
								type="text"
								name="full_name"
								value={data()?.user?.name ?? ""}
								placeholder="Enter your full name"
							/>
						</div>
						<div class="form-group">
							<label>Phone Number *</label>
							<input
								type="tel"
								name="phone"
								value={data()?.user?.phone ?? ""}
								placeholder="Your phone number"
							/>
						</div>
						<div class="form-group">
							<label>City *</label>
							<input
								type="text"
								name="city"
								value={data()?.user?.city ?? ""}
								placeholder="City"
							/>
						</div>
						<div class="form-group">
							<label>Street Address *</label>
							<input
								type="text"
								name="address"
								value={data()?.user?.address ?? ""}
								placeholder="Street, building, apartment"
							/>
						</div>
					</div>
					<button class="btn-block" type="submit">
						Confirm Order
					</button>
				</form>
				<div class="summary-section">
					<div class="section-title">
						<ShoppingBagIcon class="size" /> Order Summary
					</div>
					<Suspense fallback={<SpinnerInfinity />}>
						<Show when={data()?.product}>
							{(p) => (
								<div>
									<div class="product-summary-item">
										<div class="product-summary-img">
											<ProductThumbnail
												id={p().image_id}
												alt={p().name}
											/>
										</div>
										<div class="product-summary-details">
											<h4>{p().name}</h4>
											<p>Qty: 1</p>
										</div>
										<div style="margin-left: auto; font-weight:600;">
											{money.format(p().price)}
										</div>
									</div>
									<div class="price-row">
										<span>Subtotal</span>
										<span>{money.format(p().price)}</span>
									</div>
									<Show when={method() === "shipping"}>
										<div class="price-row">
											<span>Shipping</span>
											<span id="shippingCostDisplay">
												{money.format(SHIPPING_COST)}
											</span>
										</div>
									</Show>
									<div class="total-row">
										<span>Total</span>
										<span>{money.format(total())}</span>
									</div>
								</div>
							)}
						</Show>
					</Suspense>
				</div>
			</div>
		</main>
	);
}
