import {
	createEffect,
	createMemo,
	createSignal,
	For,
	on,
	Show,
} from "solid-js";
import { createAsync } from "@solidjs/router";
import { debounce } from "@solid-primitives/scheduled";
import {
	productConditions,
	getProductCategoriesQuery,
	type ProductSearchParams,
} from "~/lib/api/products";
import "./ProductSearch.css";

export type ProductSearchProps = {
	onChange?: (params: ProductSearchParams) => any;
	onSubmit?: (params: ProductSearchParams) => any;
};

export function ProductSearch(props: ProductSearchProps) {
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
	const [query, setQuery] = createSignal("");
	const setQueryDebounced = debounce(setQuery, 250);
	const [category, setCategory] = createSignal("");
	const [condition, setCondition] = createSignal("");
	const [price, setPrice] = createSignal<`${string}-${string}` | "">("");
	const params = createMemo<ProductSearchParams>(() => ({
		query: query(),
		category: category(),
		condition: condition(),
		price: price() || undefined,
	}));

	createEffect(on(params, () => props.onChange?.(params())));

	return (
		<div>
			<div class="search-bar">
				<input
					type="text"
					name="query"
					placeholder="Search for products..."
					onInput={(e) => setQueryDebounced(e.currentTarget.value)}
				/>
				<button
					type="button"
					onClick={() => props.onSubmit?.(params())}
				>
					Search
				</button>
			</div>
			<div class="filter-bar">
				<Show when={categories().length > 0}>
					<div class="filter-group">
						<label>Category</label>
						<select
							name="category"
							onChange={(e) => setCategory(e.currentTarget.value)}
						>
							<option value="">All</option>
							<For each={categories()}>
								{(category) => (
									<option value={category.id}>
										{category.name}
									</option>
								)}
							</For>
						</select>
					</div>
				</Show>
				<div class="filter-group">
					<label>Condition</label>
					<select
						name="condition"
						onChange={(e) => setCondition(e.currentTarget.value)}
					>
						<option value="">All</option>
						<For each={productConditions}>
							{(condition) => (
								<option value={condition}>{condition}</option>
							)}
						</For>
					</select>
				</div>
				<div class="filter-group">
					<label>Price</label>
					<select
						name="price"
						onChange={(e) => setPrice(e.currentTarget.value)}
					>
						<option value="">All</option>
						<option value="0-0">Free</option>
						<option value="0-5000">Under 50 EGP</option>
						<option value="5000-20000">50-200 EGP</option>
						<option value="20000-50000">200-500 EGP</option>
						<option value="50000-0">500+ EGP</option>
					</select>
				</div>
			</div>
		</div>
	);
}
