import { createAsync } from "@solidjs/router";
import "./index.css";
import { getProductsQuery, Product } from "~/lib/api/products";
import { For, Show } from "solid-js";
import { SpinnerInfinity } from "~/components/utils/Spinner";
import { ProductCard } from "~/components/product/ProductCard";
import TagsIcon from "lucide-solid/icons/tags";
import RecycleIcon from "lucide-solid/icons/recycle";
import ShieldIcon from "lucide-solid/icons/shield";
import MapPinIcon from "lucide-solid/icons/map-pin";
import HandHeartIcon from "lucide-solid/icons/hand-heart";
import HeartHandshakeIcon from "lucide-solid/icons/heart-handshake";
import MessageSquareMoreIcon from "lucide-solid/icons/message-square-more";
import GooglePlayIcon from "~/assets/icons/google-play.svg";
import AppStoreIcon from "~/assets/icons/app-store.svg";

function HeroSection() {
	return (
		<section class="hero">
			<h1 class="text-5xl">
				<span class="block">Give your items a new life</span>
				<span class="line2">donate or trade with purpose</span>
			</h1>
			<p>
				Join a community that gives items new life. Every exchange
				matters.
			</p>
			<div class="hero-buttons">
				<a href="sign.html" class="btn-glow">
					Start Trading
				</a>
				<a href="about.html" class="btn-outline-glow">
					Learn More
				</a>
			</div>
		</section>
	);
}

function SearchBar() {
	return (
		<>
			<div class="search-bar">
				<input
					type="text"
					id="searchInput"
					placeholder="Search for products..."
				/>
				<button id="searchBtn">Search</button>
			</div>

			<div class="filter-bar" id="categories">
				<div class="filter-group">
					<label>
						<i class="fas fa-tag"></i> Category
					</label>
					<select id="categorySelect">
						<option value="all">All</option>
						<option value="electronics">Electronics</option>
						<option value="fashion">Fashion</option>
						<option value="furniture">Furniture</option>
						<option value="sports">Sports</option>
						<option value="books">Books</option>
						<option value="toys">Toys</option>
						<option value="other">Other</option>
					</select>
				</div>
				<div class="filter-group">
					<label>
						<i class="fas fa-check-circle"></i> Condition
					</label>
					<select id="conditionSelect">
						<option value="all">All</option>
						<option value="new">New</option>
						<option value="like-new">Like New</option>
						<option value="good">Good</option>
						<option value="fair">Fair</option>
					</select>
				</div>
				<div class="filter-group">
					<label>
						<i class="fas fa-dollar-sign"></i> Price
					</label>
					<select id="priceSelect">
						<option value="all">All</option>
						<option value="under50">Under $50</option>
						<option value="50-200">$50 - $200</option>
						<option value="200-500">$200 - $500</option>
						<option value="500plus">$500+</option>
					</select>
				</div>
			</div>
		</>
	);
}

function MarketSection(props: { products: Product[] }) {
	return (
		<section id="market">
			<h2 class="section-title">
				Featured <span>products</span>
			</h2>
			<div class="product-grid" id="productGrid">
				<For each={props.products}>
					{(p) => <ProductCard product={p} />}
				</For>
			</div>
		</section>
	);
}

function FeaturesSection() {
	const testimonials = [
		{
			name: "Sara Ahmed",
			city: "Cairo",
			stars: 5,
			text: "I donated my old laptop and it helped a student in need. Amazing feeling!",
		},
		{
			name: "Mohamed Ali",
			city: "Alexandria",
			stars: 5,
			text: "Sold my camera quickly and easily. The platform is very user-friendly.",
		},
		{
			name: "Nora Hassan",
			city: "Giza",
			stars: 5,
			text: "Received a free winter coat for my son. Such a generous community!",
		},
	];
	const features = [
		{
			title: "Sustainable",
			desc: "Reduce waste",
			icon: RecycleIcon,
		},
		{
			title: "Safe",
			desc: "Verified profiles",
			icon: ShieldIcon,
		},
		{
			title: "Nearby",
			desc: "Local pickup",
			icon: MapPinIcon,
		},
		{
			title: "Chat",
			desc: "Direct messaging",
			icon: MessageSquareMoreIcon,
		},
		{
			title: "Trust",
			desc: "Badges & ratings",
			icon: HeartHandshakeIcon,
		},
		{
			title: "Donation impact",
			desc: "Track goodwill",
			icon: HandHeartIcon,
		},
	];
	return (
		<>
			<svg
				width="0"
				height="0"
				style={{ position: "absolute", display: "hidden" }}
			>
				<defs>
					<linearGradient id="lucide-gradient">
						<stop offset="0%" stop-color="#ff8a4c" />
						<stop offset="100%" stop-color="#ff4d4d" />
					</linearGradient>
				</defs>
			</svg>
			<section class="dual-section" id="donate">
				<div class="dual-card">
					<HandHeartIcon
						size="48"
						class="text-primary text-(accent-1) mx-auto"
					/>
					<h3 class="text-lg font-bold mt-3">Donate items</h3>
					<p>
						Give belongings a new home. Zero cost, maximum impact.
					</p>
					<button class="btn-glow mt-3" id="donateBtnLanding">
						Start Donating
					</button>
				</div>
				<div class="dual-card" id="sell">
					<TagsIcon
						size="48"
						class="text-primary text-(accent-1) mx-auto"
					/>
					<h3 class="text-lg font-bold mt-3">Items for sale</h3>
					<p>Quality pre-loved items at fair prices.</p>
					<button class="btn-outline-glow mt-3" id="sellBtnLanding">
						Start Selling
					</button>
				</div>
			</section>

			<section>
				<h2 class="section-title">
					Why Choose <span>Phoenix?</span>
				</h2>
				<div class="features-grid">
					<For each={features}>
						{(f) => (
							<div class="feature-item">
								<div class="feature-icon">
									{
										<f.icon
											size="42"
											class="mx-auto"
											stroke="url(#lucide-gradient)"
										/>
									}
								</div>
								<h3 class="text-lg font-bold">{f.title}</h3>
								<p>{f.desc}</p>
							</div>
						)}
					</For>
				</div>
			</section>

			<section>
				<h2 class="section-title">
					What Our <span>Community Says</span>
				</h2>
				<div class="testimonial-grid">
					<For each={testimonials}>
						{(t) => (
							<div class="testimonial">
								<div class="testimonial-header">
									<div class="testimonial-avatar-letter">
										{t.name.charAt(0)}
									</div>
									<div>
										<h4 class="text-lg font-bold">
											{t.name}
										</h4>
										<div class="text-sm text-muted-foretext-muted-foregroundd">
											{t.city}
										</div>
									</div>
								</div>
								<div class="testimonial-stars">
									{"★".repeat(t.stars)}
								</div>
								<div class="text-md">"{t.text}"</div>
							</div>
						)}
					</For>
				</div>
			</section>

			<section class="app-download">
				<h2 class="text-2xl font-bold">Take Phoenix with you anywhere</h2>
				<p>Fast & Easy · Real-time Chat · Location-based</p>
				<div class="app-buttons">
					<a href="#" class="store-btn flex items-center gap-3">
						<i class="me-2">
							<AppStoreIcon
								width="20"
								fill="currentColor"
								class="inline"
							/>
						</i>
						<span>App Store</span>
					</a>
					<a href="#" class="store-btn">
						<i class="me-2">
							<GooglePlayIcon
								width="20"
								fill="currentColor"
								class="inline"
							/>
						</i>
						<span>Google Play</span>
					</a>
				</div>
			</section>
		</>
	);
}

export default function HomePage() {
	const products = createAsync(() => getProductsQuery(), {
		deferStream: true,
	});
	return (
		<main class="container">
			<HeroSection />
			<SearchBar />
			<Show when={products()} fallback={<SpinnerInfinity />}>
				<Show when={products()?.ok} fallback={<p>No products found</p>}>
					<MarketSection
						products={
							products()?.ok ? (products()?.data ?? []) : []
						}
					/>
				</Show>
			</Show>
			<FeaturesSection />
		</main>
	);
}
