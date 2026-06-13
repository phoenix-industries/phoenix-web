import { createSignal, Show } from "solid-js";
import * as money from "~/lib/utils/money";
import type { Product } from "~/lib/api/products";
import PackageIcon from "lucide-solid/icons/package";
import CircleUserRoundIcon from "lucide-solid/icons/circle-user-round";
import "./ProductCard.css";

export type PostCardImageProps = {
	id?: string | null;
	src?: string | null;
	alt?: string;
	class?: string;
};

export function ProductCardImage(props: PostCardImageProps) {
	const [error, setError] = createSignal(false);
	if (props.id && !props.src) {
		props.src = `/thumbnails/${props.id}`;
	}
	return (
		<Show
			when={props.src && !error()}
			fallback={
				<PackageIcon
					class={`text-primary p-5 size-full object-contain ${props.class ?? ""}`}
				/>
			}
		>
			<img
				src={props.src ?? undefined}
				alt={props.alt}
				class={`size-full object-contain ${props.class}`}
				onError={() => setError(true)}
				loading="lazy"
				decoding="async"
			/>
		</Show>
	);
}


export function ProductCard(props: { product: Product }) {
	return (
		<div class="product-card" data-id={props.product.id}>
			<div class="product-img">
				<ProductCardImage
					id={props.product.image}
					alt={props.product.name}
				/>
			</div>
			<div class="flex gap-3 items-center">
				<span class="badge">{props.product.category.name}</span>
				<span class="badge">{props.product.condition}</span>
			</div>
			<div class="product-title">{props.product.name}</div>
			<div class="product-user flex items-center mt-3">
				<CircleUserRoundIcon class="stroke-primary me-2" />
				<span>{props.product.user?.name}</span>
			</div>
			<div
				class="product-footer"
				style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;"
			>
				<span style="font-weight:800;color:var(--accent-2);">
					{props.product.price === 0
						? "Free"
						: money.format(props.product.price)}
				</span>
				<button class="trade-btn">
					{props.product.type === "sale" ? "Buy Now" : "Get Item"}
				</button>
			</div>
		</div>
	);
}
