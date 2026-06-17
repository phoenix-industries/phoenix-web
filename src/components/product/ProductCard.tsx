import * as money from "~/lib/utils/money";
import type { Product } from "~/lib/api/products";
import { ProductThumbnail } from "./ProductThumbnail";
import CircleUserRoundIcon from "lucide-solid/icons/circle-user-round";
import "./ProductCard.css";
import { A } from "@solidjs/router";

export function ProductCard(props: { product: Product }) {
	return (
		<A href={`/products/${props.product.id}`}>
			<div class="product-card">
				<div class="product-img">
					<ProductThumbnail
						id={props.product.image_id}
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
						{props.product.donated ? "Get Item" : "Buy Now"}
					</button>
				</div>
			</div>
		</A>
	);
}
