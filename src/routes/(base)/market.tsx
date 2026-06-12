import { createSignal, For, Show, Suspense } from "solid-js";
import { createAsync } from "@solidjs/router";
import { getProductsQuery, type ProductSearchParams } from "~/lib/api/products";
import { ProductSearch } from "~/components/product/ProductSearch";
import { ProductCard } from "~/components/product/ProductCard";
import "./market.css";
import { SpinnerInfinityOverlay } from "~/components/utils/Spinner";

export default function MarketPage() {
	const [search, setSearch] = createSignal<ProductSearchParams>({});
	const [loading, setLoading] = createSignal(false);
	const products = createAsync(
		async () => {
			const res = await getProductsQuery(search());
			return res.ok ? res.data : [];
		},
		{ deferStream: true },
	);

	function handleChange(params: ProductSearchParams) {
		setSearch(params);
		setLoading(true);
		const timeout = setTimeout(() => {
			setLoading(false);
			clearTimeout(timeout);
		}, 500);
	}

	// TODO: add pagination
	return (
		<main class="container">
			<div class="page-header">
				<h1>Marketplace</h1>
				<p>Discover items donated or sold by the community.</p>
			</div>
			<ProductSearch onChange={handleChange} />
			<Suspense fallback={<SpinnerInfinityOverlay />}>
				<Show when={!loading()} fallback={<SpinnerInfinityOverlay />}>
					<div classList={{ "product-grid": !!products()}}>
						<For
							each={products()}
							fallback={
								<p class="text-lg text-center text-muted-foreground">
									No products found!
								</p>
							}
						>
							{(p) => <ProductCard product={p} />}
						</For>
					</div>
				</Show>
			</Suspense>
		</main>
	);
}
