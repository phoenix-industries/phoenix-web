import { Show } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import * as money from "~/lib/utils/money";
import type { Product } from "~/lib/api/products";
import { ProductThumbnail } from "~/components/product/ProductThumbnail";
import CircleUserRoundIcon from "lucide-solid/icons/circle-user-round";
import EditIcon from "lucide-solid/icons/edit";
import TrashIcon from "lucide-solid/icons/trash";
import "./ProductCard.css";

export type ProductCardProps = {
	product: Product;
	controls?: boolean;
	onEdit?: () => void;
	onBuy?: () => void;
	onDelete?: () => void;
	onView?: () => void;
};

export function ProductCard(props: ProductCardProps) {
	const navigate = useNavigate();

	function handleView(e: Event) {
		e.stopPropagation();
		if (!props.onView) {
			navigate(`/products/${props.product.id}`);
			return;
		}
		props.onView();
	}

	function handleBuy(e: Event) {
		e.stopPropagation();
		if (!props.onBuy) {
			navigate(`/products/checkout/${props.product.id}`);
			return;
		}
		props.onBuy();
	}

	function handleEdit(e: Event) {
		e.stopPropagation();
		if (!props.onEdit) {
			navigate(`/products/${props.product.id}/edit`);
			return;
		}
		props.onEdit();
	}

	function handleDelete(e: Event) {
		e.stopPropagation();
		props.onDelete?.();
	}

	return (
		<div class="product-card" onClick={handleView}>
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
				<button type="button" class="trade-btn" onClick={handleBuy}>
					{props.product.donated ? "Get Item" : "Buy Now"}
				</button>
			</div>
			<Show when={props.controls}>
				<div class="flex gap-3 items-center mt-3">
					<button
						type="button"
						class="action-icon edit-icon"
						onClick={handleEdit}
					>
						<EditIcon class="size-5" />
						<span class="font-bold">Edit</span>
					</button>
					<button
						type="button"
						class="action-icon delete-icon"
						onClick={handleDelete}
					>
						<TrashIcon class="size-5" />
						<span class="font-bold">Delete</span>
					</button>
				</div>
			</Show>
		</div>
	);
}
