import {
	createAsync,
	useAction,
	useNavigate,
	useSearchParams,
} from "@solidjs/router";
import { toast } from "solid-sonner";
import { ensureSessionQuery } from "~/lib/api/auth";
import { createProductAction } from "~/lib/api/products";
import { ProductForm } from "~/components/product/ProductForm";

export default function NewProductPage() {
	const ensureSession = createAsync(() => ensureSessionQuery(), {
		deferStream: true,
	});
	const navigate = useNavigate();
	const [params] = useSearchParams();
	const createProduct = useAction(createProductAction);

	async function handleSubmit(form: FormData) {
		const res = await createProduct(form);
		if (!res.ok) {
			toast.error(res.error);
			return;
		}
		toast.success("Product created successfully");
		navigate("/products/new/review");
	}

	return (
		<div>
			<ProductForm
				type="create"
				donated={params.type === "donate"}
				onSubmit={handleSubmit}
			/>
		</div>
	);
}
