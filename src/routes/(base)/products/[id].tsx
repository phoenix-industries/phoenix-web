import { Show, Suspense } from "solid-js";
import { A, createAsync, useNavigate, useParams } from "@solidjs/router";
import * as money from "~/lib/utils/money";
import { datetime } from "~/lib/utils/datetime";
import { getProductQuery, type Product } from "~/lib/api/products";
import { getUserQuery } from "~/lib/api/users";
import { SpinnerInfinityOverlay } from "~/components/utils/Spinner";
import { ProductThumbnail } from "~/components/product/ProductThumbnail";
import UserAvatar from "~/components/user/UserAvatar";
import HandHeartIcon from "lucide-solid/icons/hand-heart";
import ShoppingCartIcon from "lucide-solid/icons/shopping-cart";
import ChevronLeftIcon from "lucide-solid/icons/chevron-left";
import MessageIcon from "lucide-solid/icons/message-circle";
import "./[id].css";

function ProductInfo(props: { product: Product }) {
	return (
		<div class="product-container">
			<div class="product-gallery">
				<div class="main-image" id="mainImage">
					<ProductThumbnail
						id={props.product.image_id}
						alt={props.product.name}
					/>
				</div>
			</div>
			<div class="product-info">
				<h1>{props.product.name}</h1>
				<div>
					<span class="condition-badge">
						{props.product.condition}
					</span>
					<span class="badge">{props.product.category.name}</span>
				</div>
				<div class="price-location">
					<span class="price">
						{money.format(props.product.price)}
					</span>
				</div>
				<div class="description-section">
					<h3 class="text-xl font-bold">Description</h3>
					<p class="text-muted-foreground">
						{props.product.description ||
							"No description provided."}
					</p>
				</div>
				<div class="seller-section">
					<div class="seller-avatar">
						<Show when={props.product.user}>
							<UserAvatar
								id={props.product.user?.picture_id}
								alt={props.product.user?.name}
								class="text-white"
							/>
						</Show>
					</div>
					<div class="seller-info">
						<div class="seller-name">
							{props.product.user?.name}
						</div>

						{
							<div style="font-size:0.8rem; color:var(--text-secondary);">
								Member since{" "}
								{datetime(
									props.product.user?.created_at,
								).format("MMMM, YYYY")}
							</div>
						}
					</div>
				</div>
				<div class="action-buttons">
					<A href={`/products/checkout/${props.product.id}`}>
						<button class="btn-primary flex items-center gap-3">
							<Show
								when={props.product.donated}
								fallback={<ShoppingCartIcon />}
							>
								<HandHeartIcon />
							</Show>
							<span>
								{props.product.donated ? "Get Item" : "Buy Now"}
							</span>
						</button>
					</A>
					<A href={`/chat/direct/${props.product.user?.id}`}>
						<button class="btn-outline flex items-center gap-3">
							<MessageIcon class="inline size-6 text-primary" />
							Chat
						</button>
					</A>
					{/*
					<div class="share-dropdown">
						<button class="icon-btn" id="shareBtn">
							<i class="fas fa-share-alt"></i> Share
						</button>
						<div class="share-menu" id="shareMenu">
							<button id="copyLinkBtn">
								<i class="fas fa-link"></i> Copy link
							</button>
							<button id="facebookShareBtn">
								<i class="fab fa-facebook"></i> Facebook
							</button>
							<button id="twitterShareBtn">
								<i class="fab fa-twitter"></i> Twitter
							</button>
							<button id="whatsappShareBtn">
								<i class="fab fa-whatsapp"></i> WhatsApp
							</button>
						</div>
					</div>
					*/}
				</div>
			</div>
		</div>
	);
}

export default function ViewProductPage() {
	const params = useParams();
	const navigate = useNavigate();
	if (!params.id || typeof params.id !== "string") {
		navigate("/market");
		return;
	}
	const product = createAsync(
		async () => {
			const p = await getProductQuery(params.id as string);
			if (!p.ok) return null;
			const u = await getUserQuery(p.data?.user_id);
			return {
				...p.data,
				user: u.ok ? u.data : null,
				category_id: undefined,
				category: {
					id: p.data.category_id,
					name: p.data.category,
				},
			};
		},
		{
			initialValue: null,
			deferStream: true,
		},
	);
	return (
		<main class="container">
			<A href="/market" class="back-link flex items-center gap-3">
				<i>
					<ChevronLeftIcon class="inline size-6 text-primary" />
				</i>
				<span>Back to Market</span>
			</A>
			<div id="productContainer">
				<Suspense
					fallback={
						<SpinnerInfinityOverlay class="size-24 text-primary" />
					}
				>
					<Show when={product()}>
						{(p) => <ProductInfo product={p()} />}
					</Show>
				</Suspense>
			</div>
		</main>
	);
}
