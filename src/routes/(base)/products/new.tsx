import { useAction, useNavigate, useSearchParams } from "@solidjs/router";
import { toast } from "solid-sonner";
import { ProductForm } from "~/components/product/ProductForm";
import { createProductAction } from "~/lib/api/products";

export default function NewProductPage() {
	const navigate = useNavigate();
	const [params] = useSearchParams();
	const createProduct = useAction(createProductAction);

	async function handleSubmit(form: FormData) {
		console.log(form);
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
